// src/lib/agents/chat-agent.ts
// TRUE AGENTIC AI: ReAct (Reason + Act) orchestrator loop.
// The Groq LLM autonomously decides which tools to call, in what order,
// and loops until it has enough information to give a complete answer.

import { dbExecute } from '@/lib/fluxbase';
import { getGeminiModel } from '@/lib/gemini';
import { saveMemory } from './context';
import { logAgentAction } from './memory';
import { FARM_TOOLS } from './tools/registry';
import { executeTool } from './tools/executor';
import type { AgentContext, AgentResult } from './types';
import type { FarmToolName } from './tools/registry';

export interface ChatData {
  response: string;
  toolsUsed?: string[];
  thinkingSteps?: string[];
}

const MAX_ITERATIONS = 12; // Increased to allow more room for complex reasoning

const AGENT_SYSTEM_PROMPT = `You are SuperFarmer AI — an expert farming advisor for Indian farmers. Use tools to fetch real data; never invent facts.

Rules:
1. Greetings/simple questions → answer directly, no tools needed.
2. Any question about the farmer → call get_farmer_profile first.
3. "What to plant" → get_crop_recommendations.
4. Plant symptoms (spots, yellowing, wilting) → diagnose_crop_disease.
5. "My plan" / "what's next" → get_crop_plan.
6. "Farm status" / "full report" → generate_crop_report.
7. Price/mandi questions → get_mandi_prices.
8. Weather/irrigation timing → get_weather_forecast.
9. "Remind me" → save_reminder.
10. "Make a plan detailed" / "generate layout" / "spatial twin" → generate_spatial_twin.
11. IMPORTANT: Call MULTIPLE tools in parallel in a single response whenever possible (e.g. call profile, plan, and memory at the same time).
12. Chain tools as needed; each tool only once unless allowed.
13. Synthesize a warm, practical answer after tool results.
14. VERY IMPORTANT: If a tool returns Recommended Products with Amazon links, you MUST include those exact markdown links in your final response to the user!

Style: friendly, simple language, 1-2 actionable next steps.`;

// ─────────────────────────────────────────────────────────────
// ReAct Orchestrator Loop
// ─────────────────────────────────────────────────────────────
export async function runChatAgent(
  ctx: AgentContext,
  question: string,
  imageBase64?: string,
  sessionHistory: { role: 'user' | 'assistant'; content: string }[] = [],
  onEvent?: (event: { type: 'thinking' | 'tool_start' | 'tool_done' | 'tool_data'; message: string; data?: any }) => void
): Promise<AgentResult<ChatData>> {
  const trace: string[] = [];
  const toolsUsed: string[] = [];
  const thinkingSteps: string[] = [];
  const { farmerId } = ctx;

  const emit = (type: 'thinking' | 'tool_start' | 'tool_done', message: string) => {
    thinkingSteps.push(message);
    onEvent?.({ type, message });
  };

  // Store imageBase64 in context so executor can pass it to disease agent
  if (imageBase64) {
    (ctx as AgentContext & { imageBase64?: string }).imageBase64 = imageBase64;
  }

  // Build initial message thread — inject session history between system prompt and new question
  // This gives Groq full memory of everything said in this chat session
  const historyMessages = sessionHistory.slice(-6).map((m) => ({ // Keep last 6 turns to stay within token limits
    role: m.role,
    content: m.content,
  }));

  const langPref = ctx.farmerProfile?.preferred_lang || 'en';
  const langInstruction = langPref !== 'en' 
    ? `\n\nCRITICAL LANGUAGE INSTRUCTION: 
1. You MUST translate and write your FINAL RESPONSE exclusively in the language code: '${langPref}'. Do not use English script in the final answer, use the native script of '${langPref}'.
2. However, when calling ANY tools, you MUST pass all arguments in English! Translate the user's input to English internally before passing it into a tool's JSON arguments. Tool arguments must be in English.` 
    : '';

  const messages: object[] = [
    { role: 'system', content: AGENT_SYSTEM_PROMPT + langInstruction },
    ...historyMessages,
    { role: 'user', content: imageBase64
      ? `${question}\n\n[A crop/leaf photo has been attached by the farmer. When calling diagnose_crop_disease, the image will be automatically used for visual analysis.]`
      : question
    },
  ];

  trace.push('Starting ReAct orchestrator loop...');
  // Track which tools have been called — prevent the same read-only tool being called twice
  const calledTools = new Set<string>();
  // Tools that are safe to call multiple times (e.g. price lookups with different args)
  const MULTI_CALL_ALLOWED = new Set(['get_mandi_prices', 'save_reminder']);

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    trace.push(`Iteration ${iteration + 1}: Calling Gemini orchestrator...`);

    const model = getGeminiModel();

    let geminiResponse: string;
    try {
      const prompt = `
${AGENT_SYSTEM_PROMPT}

Conversation:

${JSON.stringify(messages, null, 2)}

Available Tools:

${JSON.stringify(FARM_TOOLS, null, 2)}

Think carefully.

IMPORTANT RESPONSE FORMAT

If you need one or more tools, your ENTIRE response must be valid JSON.

Example:

{
  "tool_calls":[
    {
      "name":"get_crop_plan",
      "arguments":{
        "crop":"Cotton"
      }
    }
  ]
}

Do NOT include any explanation before or after the JSON.

If no tool is required, respond using plain text only.
`;

      const result = await model.generateContent(prompt);
      geminiResponse = result.response.text();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      trace.push(`Gemini call failed: ${errMsg}`);
      console.error('[AgenticChat] Gemini error:', errMsg);
      return {
        success: false,
        error: errMsg,
        trace,
      };
    }

    let toolCalls: Array<{ id: string; function: { name: string; arguments: string } }> = [];
    let finalContent = geminiResponse;

    try {
      const cleaned = geminiResponse.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(cleaned);

      if (parsed && Array.isArray(parsed.tool_calls)) {
        toolCalls = parsed.tool_calls
          .filter((tool: any) => tool && typeof tool.name === 'string')
          .map((tool: any, index: number) => {
            const argumentObject = tool.arguments && typeof tool.arguments === 'object' && tool.arguments !== null
              ? tool.arguments
              : {};

            return {
              id: String(index),
              function: {
                name: tool.name,
                arguments: JSON.stringify(argumentObject),
              },
            };
          });
      }

      if (parsed && typeof parsed.answer === 'string') {
        finalContent = parsed.answer;
      } else if (parsed && typeof parsed.response === 'string') {
        finalContent = parsed.response;
      } else if (parsed && typeof parsed.content === 'string') {
        finalContent = parsed.content;
      }
    } catch (err) {
      console.log('Gemini plain text or malformed JSON:');
      console.log(geminiResponse);
      if (err instanceof Error) {
        console.log(err.message);
      }
    }

    const message = {
      role: 'assistant',
      content: finalContent,
      tool_calls: toolCalls,
    };

    if (toolCalls.length === 0) {
      const finalAnswer = finalContent || 'I was unable to generate a response. Please try rephrasing.';
      trace.push(`Iteration ${iteration + 1}: Final answer reached (no tool calls).`);

      if (farmerId) {
        void logAgentAction({
          farmerId,
          agent: 'agent-chat',
          actionType: 'query',
          input: question.slice(0, 400),
          output: finalAnswer.slice(0, 800),
          toolsUsed,
        });
      }

      return {
        success: true,
        data: { response: finalAnswer, toolsUsed, thinkingSteps },
        trace,
      };
    }

    messages.push({ ...message, role: 'assistant' });

    trace.push(`Iteration ${iteration + 1}: ${toolCalls.length} tool call(s) requested.`);

    const toolPromises = toolCalls.map(async (call: any) => {
      const toolName = call.function.name as FarmToolName;
      let toolArgs: Record<string, string> = {};

      try {
        const parsedArgs = typeof call.function.arguments === 'string'
          ? JSON.parse(call.function.arguments || '{}')
          : call.function.arguments;

        toolArgs = Object.fromEntries(
          Object.entries(parsedArgs || {}).map(([key, value]) => [key, String(value)])
        ) as Record<string, string>;
      } catch {
        toolArgs = {};
      }

      if (calledTools.has(toolName) && !MULTI_CALL_ALLOWED.has(toolName)) {
        trace.push(`  ⟳ Skipping duplicate call to ${toolName}`);
        return {
          role: 'tool',
          tool_call_id: call.id,
          content: `[Already retrieved — use the earlier ${toolName} result from above]`,
        };
      }
      calledTools.add(toolName);

      emit('tool_start', `🔧 Calling tool: ${toolName}...`);
      toolsUsed.push(toolName);
      trace.push(`  → Executing tool: ${toolName}(${JSON.stringify(toolArgs)})`);

      console.log('================================');
      console.log('TOOL SELECTED:', toolName);
      console.log('ARGUMENTS:', toolArgs);
      console.log('================================');

      let toolResult: string;
      try {
        toolResult = await executeTool(
          toolName,
          toolArgs,
          ctx,
          (msg) => emit('thinking', msg),
          (data) => onEvent?.({ type: 'tool_data', message: '', data })
        );
        emit('tool_done', `✅ ${toolResult.split('\n')[0]}`);
        trace.push(`  ← Tool result: ${toolResult.slice(0, 80)}...`);
      } catch (err) {
        toolResult = `Tool ${toolName} failed: ${err instanceof Error ? err.message : 'Unknown error'}`;
        trace.push(`  ← Tool failed: ${toolResult}`);
      }

      return {
        role: 'tool',
        tool_call_id: call.id,
        content: toolResult,
      };
    });

    const toolResults = await Promise.all(toolPromises);
    messages.push(...toolResults);
  }

  // Hit MAX_ITERATIONS without final answer
  trace.push('MAX_ITERATIONS reached without final answer.');
  return {
    success: true,
    data: {
      response: "I gathered a lot of information but ran out of time to synthesize it all. Here's what I found: please check your crop plan and profile pages for detailed information.",
      toolsUsed,
      thinkingSteps,
    },
    trace,
  };
}

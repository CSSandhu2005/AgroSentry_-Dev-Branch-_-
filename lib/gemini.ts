// src/lib/gemini.ts
import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
console.log('Gemini Key:', process.env.GEMINI_API_KEY);
const genai = new GoogleGenerativeAI(apiKey);

export function stripCodeFences(text: string): string {
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
}

export function withTimeout<T>(promise: Promise<T>, ms = 120_000): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

/**
 * HybridModel — Gemini-only wrapper used by the agent tools.
 */
class HybridModel {
  constructor(
    private systemInstruction: string,
    private isVision: boolean,
    private jsonMode: boolean,
    private geminiModelName: string
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async generateContent(contents: any) {
    const generationConfig: GenerationConfig = {
      topP: 0.8,
      responseMimeType: this.jsonMode ? 'application/json' : 'text/plain',
    };

    const model = genai.getGenerativeModel({
      model: this.geminiModelName,
      systemInstruction: this.systemInstruction,
      generationConfig,
    });

    return await model.generateContent(contents);
  }
}

export function getJsonModel(
  systemInstruction: string,
  options: { temperature?: number; maxTokens?: number; modelName?: string } = {}
) {
  const { modelName = 'gemini-2.5-flash' } = options;
  return new HybridModel(systemInstruction, false, true, modelName);
}

export function getVisionModel(systemInstruction: string) {
  return new HybridModel(systemInstruction, true, true, 'gemini-2.5-flash');
}

export function getGeminiModel(modelName = 'gemini-2.5-flash') {
  return new HybridModel('', false, false, modelName);
}

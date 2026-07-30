// src/lib/agents/disease-agent.ts
// DiseaseDiagnosisAgent — handles plant disease identification via vision or text symptoms

import { getVisionModel, withTimeout } from "@/lib/gemini";
import { dbExecute } from "@/lib/fluxbase";
import { logAgentAction } from "./memory";
import { runReplannerAgent } from "./replanner-agent";
import type { ReplannerData } from "./replanner-agent";
import type { AgentContext, AgentResult } from "./types";

export interface DiseaseProduct {
  name: string;
  type: string; // e.g. "Fungicide", "Pesticide", "Bio-stimulant"
  dose: string; // e.g. "2ml/L water"
  searchQuery: string; // for Amazon search
}

export interface DiseaseData {
  diagnosis: string;
  confidence: string;
  severity: "Low" | "Medium" | "High";
  treatment: string;
  prevention: string;
  products: DiseaseProduct[];
  ai_powered: boolean;
  engine: string;
  replannerTriggered?: boolean;
  replanner_result?: AgentResult<ReplannerData>;
}

const SYSTEM_INSTRUCTION = `You are an AI Plant Pathologist Agent.
Analyze symptoms from images or text descriptions to diagnose crop diseases.
Provide clear, organic-first treatment plans where possible.
Be precise and cautionary about chemical usage.
Return JSON only.`;

export async function runDiseaseAgent(
  ctx: AgentContext,
  input: { symptoms?: string; imageBase64?: string; cropType?: string },
): Promise<AgentResult<DiseaseData>> {
  const trace: string[] = [];
  const { farmerId, farmerProfile } = ctx;

  trace.push("Step 1: Preparing disease diagnosis analysis...");

  // 3.1 Build the Farmer Context
  const profileText = farmerProfile
    ? `Farmer Profile:
- Farmer: ${farmerProfile.name || (farmerProfile as any).full_name || "Unknown"}
- Village: ${farmerProfile.village || "Unknown"}
- District: ${farmerProfile.district || "Unknown"}
- State: ${farmerProfile.state || "Unknown"}
- Land: ${farmerProfile.land_acres ?? "Unknown"} acres
- Soil: ${farmerProfile.soil_type || "Unknown"}
- Irrigation: ${farmerProfile.irrigation || "Unknown"}
- Primary Crops: ${
        Array.isArray(farmerProfile.primary_crops)
          ? farmerProfile.primary_crops.join(", ")
          : farmerProfile.primary_crops || "Unknown"
      }`
    : "Farmer profile not available.";

  // 3.2 Load Previous Disease History
  let historyText = "Previous Disease History:\nNone recorded.";

  if (farmerId) {
    try {
      const historyRows = await dbExecute(
        "SELECT diagnosis, severity, created_at FROM disease_detections WHERE farmer_id = $1 ORDER BY created_at DESC LIMIT 5",
        [farmerId]
      );
      if (historyRows && historyRows.length > 0) {
        const historyItems = historyRows
          .map((row) => `• ${row.diagnosis || "Unknown"} (${row.severity || "Unknown"})`)
          .join("\n");
        historyText = `Previous Disease History:\n${historyItems}`;
      }
    } catch (err) {
      console.warn("Could not fetch disease history:", err);
    }
  }

  // 3.3 Inject Both Into the Prompt
  const model = getVisionModel(SYSTEM_INSTRUCTION);
  const prompt = `${profileText}\n\n${historyText}\n\nCrop: ${input.cropType || "Unknown"}\nSymptoms: ${input.symptoms || "Visual only"}\n\nAnalyze the provided information and image to diagnose the disease. Return JSON only using this exact schema:\n{\n  "diagnosis": "Disease Name",\n  "confidence": "95%",\n  "severity": "Low | Medium | High",\n  "treatment": "Each step on a new line",\n  "prevention": "Each point on a new line",\n  "products": [\n    {\n      "name": "Product Name",\n      "type": "Fungicide",\n      "dose": "2 g/L water",\n      "searchQuery": "mancozeb fungicide india"\n    }\n  ],\n  "ai_powered": true,\n  "engine": "Gemini Vision"\n}\nProvide 2-4 relevant products that would help treat this disease. Include at least one organic/bio option if available.`;

  try {
    trace.push(
      `Step 2: Calling Vision AI for ${input.imageBase64 ? "image analysis" : "symptom analysis"}...`,
    );

    let result;
    if (input.imageBase64) {
      result = await withTimeout(
        model.generateContent([
          prompt,
          {
            inlineData: {
              data: input.imageBase64.split(",")[1] || input.imageBase64,
              mimeType: "image/jpeg",
            },
          },
        ]),
      );
    } else {
      result = await withTimeout(model.generateContent(prompt));
    }

    const raw = result.response
      .text()
      .replace(/```json\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    const parsed = JSON.parse(raw) as Partial<DiseaseData>;
    const data: DiseaseData = {
      diagnosis: parsed.diagnosis ?? "",
      confidence: parsed.confidence ?? "",
      severity: parsed.severity ?? "Medium",
      treatment: parsed.treatment ?? "",
      prevention: parsed.prevention ?? "",
      products: parsed.products ?? [],
      ai_powered: parsed.ai_powered ?? true,
      engine: parsed.engine ?? "Gemini Vision",
    };
    trace.push(`Step 2 ✓: Diagnosis complete: ${data.diagnosis}`);

    // Step 3: Save diagnosis to disease_detections table in PostgreSQL
    trace.push("Step 3: Saving diagnosis to database...");
    if (farmerId) {
      try {
        await dbExecute(
          `INSERT INTO disease_detections
            (farmer_id, plan_id, crop_name, diagnosis, confidence, severity, treatment, prevention, products, ai_engine)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            farmerId,
            ctx.planId || null,
            input.cropType || "Unknown",
            data.diagnosis,
            data.confidence,
            data.severity,
            data.treatment,
            data.prevention,
            JSON.stringify(data.products || []),
            data.engine || "Gemini Vision",
          ]
        );
        trace.push("Step 3 ✓: Diagnosis stored successfully.");
      } catch (dbErr) {
        const errorMsg = dbErr instanceof Error ? dbErr.message : String(dbErr);
        console.error("Failed to save diagnosis to disease_detections:", dbErr);
        trace.push(`Step 3 ✗: Failed to save diagnosis — ${errorMsg}`);
      }

      void logAgentAction({
        farmerId,
        agent: "disease",
        actionType: "diagnosis",
        input: `Crop: ${input.cropType || "Unknown"} | Symptoms: ${input.symptoms || "None"} | Image provided: ${!!input.imageBase64}`,
        output: `Diagnosis: ${data.diagnosis} (${data.confidence}). Treatment: ${data.treatment}`,
        toolsUsed: ["gemini-vision-ai"],
        metadata: {
          diagnosis: data.diagnosis,
          confidence: data.confidence,
          crop: input.cropType,
          severity: data.severity,
        },
      });
    } else {
      trace.push("Step 3 ⚠: No farmerId provided, skipping database persistence.");
    }

    // Step 4 & 5: Check Severity & Autonomously Trigger Dynamic Replanner if High
    if (data.severity === "High") {
      trace.push("Step 4: High severity disease detected!");
      trace.push("Step 5: Autonomously triggering Dynamic Replanner...");
      data.replannerTriggered = true;

      try {
        const replannerResult = await runReplannerAgent(ctx, {
          risk_level: "High",
          risk_probability: 90,
          suggestion: `High severity disease detected (${data.diagnosis}). Crop: ${input.cropType || "Unknown"}. Treatment: ${data.treatment}`,
          n: 0,
          p: 0,
          k: 0,
        });

        data.replanner_result = replannerResult;
        if (replannerResult.success) {
          trace.push("Step 5 ✓: Crop plan updated with emergency disease interventions.");
        } else {
          trace.push(`Step 5 ✗: Replanner failed — ${replannerResult.error || "Unknown error"}`);
        }

        if (replannerResult.trace) {
          trace.push(...replannerResult.trace.map((t) => `  [Replanner] ${t}`));
        }
      } catch (replanErr) {
        const errorMsg = replanErr instanceof Error ? replanErr.message : String(replanErr);
        console.error("Failed to trigger Dynamic Replanner:", replanErr);
        trace.push(`Step 5 ✗: Replanner failed — ${errorMsg}`);
      }
    } else {
      data.replannerTriggered = false;
      trace.push(`Step 4: Severity is ${data.severity} — no autonomous replanning required.`);
    }

    return {
      success: true,
      data,
      trace,
      triggered: data.replannerTriggered ? "replanner-agent" : undefined,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Diagnosis failed";
    trace.push(`Step 2 ✗: AI Analysis failed — ${errorMsg}`);
    return { success: false, error: errorMsg, trace };
  }
}

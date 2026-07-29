// src/lib/agents/intake-agent.ts
// IntakeAgent — handles farmer profile creation and initial context setup

import { dbExecute } from '@/lib/fluxbase';
import { saveMemory } from './context';
import type { AgentContext, AgentResult } from './types';

export interface IntakeData {
  farmerId: number;
}

export async function runIntakeAgent(
  ctx: AgentContext,
  data: {
    name: string;
    land_acres?: string | number;
    village?: string;
    district?: string;
    state?: string;
    location?: string;
    irrigation?: string;
    water?: string;
    soil_type?: string;
    primary_crops?: string | string[];
    economic_class?: string;
    preferred_lang?: string;
    goals?: string;
  }
): Promise<AgentResult<IntakeData>> {

  const trace: string[] = [];
  const { userId } = ctx;

  trace.push(`Step 1: Processing intake for user #${userId}...`);

  const acres =
    typeof data.land_acres === "string"
      ? parseFloat(data.land_acres) || 0
      : typeof data.land_acres === "number"
        ? data.land_acres
        : 0;

  const village = (data.village ?? data.location ?? "").toString().trim();
  const district = (data.district ?? "").toString().trim();
  const state = (data.state ?? "").toString().trim();
  const irrigation = (data.irrigation ?? data.water ?? "Medium").toString().trim();
  const soilType = (data.soil_type ?? "Black").toString().trim();
  const primaryCrops = Array.isArray(data.primary_crops)
    ? data.primary_crops
    : typeof data.primary_crops === "string" && data.primary_crops.trim()
      ? [data.primary_crops.trim()]
      : typeof data.goals === "string" && data.goals.trim()
        ? [data.goals.trim()]
        : [];
  const economicClass = (data.economic_class ?? "Smallholder").toString().trim();
  const preferredLang = (data.preferred_lang ?? "en").toString().trim();

  try {

    trace.push("Step 2: Saving farmer profile...");

    const rows = await dbExecute(
      `
      INSERT INTO farmer_profile
      (
        user_id,
        name,
        village,
        district,
        state,
        land_acres,
        soil_type,
        irrigation,
        primary_crops,
        economic_class,
        preferred_lang,
        profile_pct
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        60
      )
      RETURNING farmer_id
      `,
      [
        userId,
        data.name,
        village || null,
        district || null,
        state || null,
        acres,
        soilType || null,
        irrigation || null,
        JSON.stringify(primaryCrops),
        economicClass || null,
        preferredLang || null,
      ]
    );

    const farmerId = Number(rows[0].farmer_id);

    trace.push(`Step 2 ✓: Farmer profile created with ID #${farmerId}`);

    await saveMemory(
      farmerId,
      "intake",
      `Created farmer profile for ${data.name}`
    );

    return {
      success: true,
      data: { farmerId },
      trace,
    };

  } catch (err) {

    console.error(err);

    const msg =
      err instanceof Error ? err.message : "Intake Agent failed";

    return {
      success: false,
      error: msg,
      trace,
    };
  }
}

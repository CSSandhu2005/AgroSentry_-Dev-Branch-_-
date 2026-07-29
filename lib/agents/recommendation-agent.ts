import { getJsonModel, withTimeout } from '@/lib/gemini';
import { dbExecute } from '@/lib/fluxbase';
import { formatMemory, saveMemory } from './context';
import { logAgentAction } from './memory';
import type { AgentContext, AgentResult } from './types';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

interface CropItem { name: string; reason: string; care_tip: string; }
export interface RecommendationData {
  primary_crop: string;
  crops: CropItem[];
  overall_advice: string;
  ai_powered: boolean;
  engine?: string;
}

const SYSTEM_INSTRUCTION = `You are a Senior AI Agronomist with 20+ years advising Indian farmers.
You have access to this farmer's history and profile. Use it to give PERSONALIZED, CONTEXT-AWARE recommendations.
Never repeat the same crop if a better alternative exists given the farmer's history.
Respond ONLY with valid JSON. No markdown, no extra text.`;

const FALLBACKS: Record<string, string[]> = {
  Black: ['Cotton', 'Wheat', 'Soybean'],
  Alluvial: ['Rice', 'Sugarcane', 'Wheat'],
  Red: ['Groundnut', 'Millets', 'Pulses'],
  Laterite: ['Cashew', 'Coconut', 'Rice'],
  Sandy: ['Groundnut', 'Watermelon', 'Sweet Potato'],
  Clay: ['Rice', 'Sugarcane', 'Jute'],
};

export async function runRecommendationAgent(
  ctx: AgentContext,
  input: { soil_type: string; water_const: string; season: string; goal: string; n?: number; p?: number; k?: number; ph?: number; temp?: number; humidity?: number; rainfall?: number }
): Promise<AgentResult<RecommendationData>> {
  console.log('Recommendation agent started');
  const trace: string[] = [];
  const { farmerId, farmerProfile, conversationHistory } = ctx;

  trace.push('Step 1: Loading past crop recommendations from database...');
  const pastRecs = farmerId
    ? await dbExecute(
        'SELECT recommended_crops, created_at FROM crop_recommendations WHERE farmer_id = $1 ORDER BY created_at DESC LIMIT 3',
        [farmerId]
      )
    : [];
  trace.push(`Step 1 ✓: Found ${pastRecs.length} past recommendation(s).`);

  const profile = farmerProfile;
  const location = profile
    ? [profile.village, profile.district, profile.state].filter(Boolean).join(', ')
    : 'Not provided';
  const cropsText = profile
    ? (Array.isArray(profile.primary_crops)
        ? profile.primary_crops.join(', ')
        : profile.primary_crops || 'Maximum yield and profit')
    : 'Maximum yield and profit';
  const profileText = profile
    ? `Name: ${profile.name}, Land: ${profile.land_acres ?? '?'} acres, Village/District/State: ${location || 'Not provided'}, Irrigation: ${profile.irrigation || 'Unknown'}, Crops: ${cropsText}`
    : 'Profile not available.';

  const previousRecommendations = pastRecs.length
    ? pastRecs
        .map((r) => JSON.stringify(r.recommended_crops))
        .join('\n')
    : 'None';

  trace.push('Step 2: Feeding manual N, P, K parameters directly into offline Random Forest Machine Learning Model...');
  try {
    const pyScript = path.join(process.cwd(), 'ml_predict.py');
    const cmd = `py "${pyScript}" ${input.n ?? 50} ${input.p ?? 50} ${input.k ?? 50} ${input.temp ?? 25} ${input.humidity ?? 60} ${input.ph ?? 6.5} ${input.rainfall ?? 100}`;
    
    const { stdout, stderr } = await execAsync(cmd);
    if (stderr && stderr.toLowerCase().includes('error')) throw new Error(stderr);
    
    const mlCrops = stdout.trim().split(',').filter(c => c);
    if (mlCrops.length === 0) throw new Error("ML script returned empty prediction");
    
    trace.push(`Step 3 ✓: Random Forest model shortlisted top 5 mathematically optimal crops: ${mlCrops.join(', ')}`);

    trace.push('Step 4: Using Agronomist AI to pick the BEST crop from the ML shortlist for this specific season and soil...');
    const filterPrompt = `
Farmer Profile:

${profileText}

Previous Recommendations:

${previousRecommendations}

Recent Conversation:

${formatMemory(conversationHistory)}

Machine Learning shortlisted:

${mlCrops.join(', ')}

Current Season:
${input.season}

Current Soil:
${input.soil_type}

Water:
${input.water_const}

Choose the single best crop from the ML shortlist that fits the farmer profile, previous recommendations, conversation context, season, soil, and water availability.
Return JSON ONLY:
{
  "best_ml_crop": "the exact name of the chosen crop",
  "reason": "1 sentence explaining why this ML crop is perfect for this season/soil",
  "care_tip": "1 sentence care tip",
  "second_best_ml_crop": "the exact name of the runner up from the ML list"
}`;

    const filterModel = getJsonModel(SYSTEM_INSTRUCTION, { temperature: 0.1 });
    const filterResult = await withTimeout(filterModel.generateContent(filterPrompt));
    const filterData = JSON.parse(filterResult.response.text().replace(/```json\s*|\s*```/g, ''));

    const finalCrop = filterData.best_ml_crop || mlCrops[0];
    const finalCropTitle = finalCrop.charAt(0).toUpperCase() + finalCrop.slice(1);
    const secondCrop = filterData.second_best_ml_crop || mlCrops[1];

    const finalData: RecommendationData = {
      primary_crop: finalCropTitle,
      crops: [
        { name: finalCropTitle, reason: filterData.reason || `Chosen by Random Forest ML model based on input parameters (N:${input.n}, pH:${input.ph}).`, care_tip: filterData.care_tip || `Requires optimal ${input.water_const} irrigation.` },
        { name: secondCrop.charAt(0).toUpperCase() + secondCrop.slice(1), reason: "Runner-up predicted by the ML model.", care_tip: "Good alternative if the primary crop seed is unavailable." }
      ],
      overall_advice: `Based on a mathematical Machine Learning analysis of your soil profile, the top mathematically viable crops were ${mlCrops.join(', ')}. Our AI Agronomist analyzed this shortlist against your "${input.season}" season requirements and identified ${finalCropTitle} as the absolute perfect match!`,
      ai_powered: true,
      engine: 'Random Forest ML + Hybrid Filtering'
    };

    trace.push('Step 4: Saving recommendation to database...');
    if (farmerId) {
      try {
        console.log('Saving recommendation...');
        console.log(finalData);
        const rows = await dbExecute(
          `INSERT INTO crop_recommendations
          (
            farmer_id,
            recommended_crops,
            season,
            soil_type,
            engine
          )
          VALUES ($1, $2, $3, $4, $5)`,
          [
            farmerId,
            JSON.stringify(finalData.crops),
            input.season,
            input.soil_type,
            finalData.engine,
          ]
        );
        console.log(rows);
        await logAgentAction({
          farmerId,
          agent: 'recommendation',
          actionType: 'ml_recommendation',
          input: `Soil:${input.soil_type} Season:${input.season} N:${input.n} P:${input.p} K:${input.k} pH:${input.ph}`,
          output: `Primary: ${finalData.primary_crop}. ${finalData.overall_advice.slice(0, 200)}`,
          toolsUsed: ['random-forest-ml', 'gemini-filter'],
          metadata: { primary_crop: finalData.primary_crop, crops: finalData.crops.map(c=>c.name), engine: finalData.engine, soil_type: input.soil_type, season: input.season },
        });
      } catch (error) {
        console.error('RecommendationAgent persistence error:', error);
      }
    }

    return { success: true, data: finalData, trace };
  } catch (err) {
    trace.push(`Step 3 ✗: ML pipeline failed — ${err instanceof Error ? err.message : err}. Using fallback.`);
    console.error('RecommendationAgent ML error:', err);
  }

  // ── Fallback ──
  const soil = input.soil_type.split(' ')[0] || 'Black';
  const recs = FALLBACKS[soil] ?? FALLBACKS.Black;
  return {
    success: true,
    data: {
      primary_crop: recs[0],
      crops: recs.map((c) => ({ name: c, reason: `Well-suited for ${input.soil_type} soil.`, care_tip: 'Consult local experts.' })),
      overall_advice: `For ${input.soil_type} soil in ${input.season}, ${recs[0]} is a safe primary choice.`,
      ai_powered: false,
    },
    trace,
  };
}

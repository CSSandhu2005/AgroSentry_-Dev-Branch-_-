import { AgentContext, AgentResult } from './types';
import { dbExecute } from '@/lib/fluxbase';
import { getJsonModel, withTimeout } from '@/lib/gemini';
import { logAgentAction } from './memory';

export interface PlantNode {
  x: number; y: number; type: string; color: string; radius: number;
  row: number; col: number; border?: boolean; zone?: number;
}
export type ZoneType = "Crop" | "Disease" | "Nutrient" | "Survey" | "No Spray" | "Border";

export interface ZoneData {
  x: number; y: number; w: number; h: number;
  crop: string; color: string; label: string;
  zone_type?: ZoneType;
}

export interface UpstreamHeroContext {
  prevCrop: string | null;
  nitrogenLevel: string;
  waterFarm: string;
  landSize: number;

  recommendationId?: number;
  recommendationSummary?: string;

  planId?: number;
  planSummary?: string;

  diseaseDetectionId?: number;
  diseaseDiagnosis?: string;
  diseaseSeverity?: "Low" | "Medium" | "High";
  diseaseTreatment?: string;

  nutrientLogId?: number;
  nutrientRiskLevel?: string;
  nutrientProbability?: number;
  nutrientSuggestion?: string;

  boundaryId?: number;
  boundaryPolygon?: [number, number][];
  boundaryArea?: number;
  boundaryCentroid?: { lat: number; lng: number };
}
export interface CropStat {
  name: string; color: string; emoji: string; spacing: number; height_m: number;
  water: string; nitrogen: string; shade: string;
  profit_score: number; companion_score: number; yield_t_per_acre: number;
}
export interface ZoneYield { crop: string; acres: number; yield_t: number; }

export interface DroneMission {
  mission_id: number;
  zone: string;
  objective: string;
  action: string;
  priority: "High" | "Medium" | "Low";
  altitude_m: number;
  speed_mps: number;
  estimated_time_min: number;
}

export interface MissionSummary {
  total_missions: number;
  estimated_duration: number;
  battery_required: number;
}

export interface SpatialAIReview {
  overall_rating: number;
  strengths: string[];
  weaknesses: string[];
  optimization_suggestions: string[];
  risk_factors: string[];
  drone_notes: string[];
  summary: string;
}

export interface SpatialLayoutData {
  layout: PlantNode[]; zones: ZoneData[];
  analysis: string; main_crop: string; companion: string;
  insights: {
    total_plants: number; interior_plants: number; border_plants: number;
    land_efficiency: number; water_saving_pct: number; yield_boost_pct: number;
    layout_score: number; nitrogen_balance: string; best_combo: string;
    sunlight_note: string; zone_yields: ZoneYield[]; total_yield: number;
    warnings: string[]; action_items: string[];
  };
  crop_stats: CropStat[];
  missions: DroneMission[];
  mission_summary: MissionSummary;
  ai_review?: SpatialAIReview;
  // Memory fields
  memory_log: string[]; override_crop: string | null; override_reason: string | null;
  prev_crop: string | null; soil_impact: string; layout_mode: string;
  boundary_id?: number | null;
  boundary?: {
    id?: number;
    polygon: [number, number][];
    area: number;
    centroid?: { lat: number; lng: number };
  } | null;
}

const SYSTEM_INSTRUCTION = `You are a Senior Agricultural Spatial Planner and Precision Farming Specialist.
Review the deterministically generated crop layout and drone missions.
Provide constructive, expert agronomic optimizations, risk evaluations, and drone flight insights.
Respond strictly in valid JSON format.`;

const CROP_DB: Record<string, CropStat> = {
  'Corn':      { name:'Corn',      color:'#eab308', emoji:'🌽', spacing:60,  height_m:2.5, water:'Medium', nitrogen:'Consumer', shade:'Sensitive', profit_score:7, companion_score:8,  yield_t_per_acre:2.8  },
  'Tomato':    { name:'Tomato',    color:'#ef4444', emoji:'🍅', spacing:50,  height_m:1.2, water:'High',   nitrogen:'Consumer', shade:'Tolerant',  profit_score:9, companion_score:7,  yield_t_per_acre:8.0  },
  'Wheat':     { name:'Wheat',     color:'#fcd34d', emoji:'🌾', spacing:20,  height_m:1.0, water:'Low',    nitrogen:'Consumer', shade:'Sensitive', profit_score:6, companion_score:6,  yield_t_per_acre:1.6  },
  'Rice':      { name:'Rice',      color:'#34d399', emoji:'🌾', spacing:25,  height_m:1.2, water:'High',   nitrogen:'Consumer', shade:'Tolerant',  profit_score:7, companion_score:5,  yield_t_per_acre:2.2  },
  'Sugarcane': { name:'Sugarcane', color:'#84cc16', emoji:'🎋', spacing:90,  height_m:3.5, water:'High',   nitrogen:'Consumer', shade:'Sensitive', profit_score:8, companion_score:5,  yield_t_per_acre:35.0 },
  'Cotton':    { name:'Cotton',    color:'#f9fafb', emoji:'🪴', spacing:75,  height_m:1.5, water:'Medium', nitrogen:'Consumer', shade:'Sensitive', profit_score:7, companion_score:6,  yield_t_per_acre:0.5  },
  'Soybean':   { name:'Soybean',   color:'#a3e635', emoji:'🫘', spacing:30,  height_m:0.8, water:'Low',    nitrogen:'Fixer',    shade:'Tolerant',  profit_score:7, companion_score:9,  yield_t_per_acre:0.9  },
  'Maize':     { name:'Maize',     color:'#facc15', emoji:'🌽', spacing:65,  height_m:2.0, water:'Medium', nitrogen:'Consumer', shade:'Sensitive', profit_score:7, companion_score:7,  yield_t_per_acre:3.2  },
  'Onion':     { name:'Onion',     color:'#c084fc', emoji:'🧅', spacing:15,  height_m:0.5, water:'Medium', nitrogen:'Neutral',  shade:'Tolerant',  profit_score:8, companion_score:9,  yield_t_per_acre:6.0  },
  'Garlic':    { name:'Garlic',    color:'#e2e8f0', emoji:'🧄', spacing:12,  height_m:0.4, water:'Low',    nitrogen:'Neutral',  shade:'Tolerant',  profit_score:9, companion_score:9,  yield_t_per_acre:4.5  },
  'Marigold':  { name:'Marigold',  color:'#f97316', emoji:'🌼', spacing:20,  height_m:0.6, water:'Low',    nitrogen:'Neutral',  shade:'Tolerant',  profit_score:5, companion_score:10, yield_t_per_acre:1.2  },
  'Groundnut': { name:'Groundnut', color:'#d97706', emoji:'🥜', spacing:30,  height_m:0.5, water:'Low',    nitrogen:'Fixer',    shade:'Tolerant',  profit_score:8, companion_score:9,  yield_t_per_acre:1.0  },
  'Mustard':   { name:'Mustard',   color:'#fef08a', emoji:'🌿', spacing:20,  height_m:1.2, water:'Low',    nitrogen:'Neutral',  shade:'Sensitive', profit_score:7, companion_score:7,  yield_t_per_acre:0.7  },
  'Chickpea':  { name:'Chickpea',  color:'#fde68a', emoji:'🫘', spacing:25,  height_m:0.6, water:'Low',    nitrogen:'Fixer',    shade:'Tolerant',  profit_score:8, companion_score:9,  yield_t_per_acre:0.8  },
  'Potato':    { name:'Potato',    color:'#a78bfa', emoji:'🥔', spacing:35,  height_m:0.6, water:'Medium', nitrogen:'Consumer', shade:'Tolerant',  profit_score:8, companion_score:7,  yield_t_per_acre:8.0  },
  'Sunflower': { name:'Sunflower', color:'#fbbf24', emoji:'🌻', spacing:45,  height_m:2.0, water:'Low',    nitrogen:'Neutral',  shade:'Sensitive', profit_score:7, companion_score:7,  yield_t_per_acre:0.5  },
};

const COMPANION_MATRIX: Record<string, string[]> = {
  'Corn':      ['Soybean','Groundnut','Marigold'],
  'Tomato':    ['Marigold','Onion','Garlic'],
  'Wheat':     ['Chickpea','Mustard','Soybean'],
  'Rice':      ['Groundnut','Sunflower'],
  'Cotton':    ['Marigold','Soybean','Groundnut','Onion'],
  'Sugarcane': ['Soybean','Groundnut','Garlic','Onion'],
  'Potato':    ['Marigold','Garlic','Corn'],
  'Onion':     ['Tomato','Corn','Marigold','Garlic'],
  'Maize':     ['Soybean','Groundnut','Marigold'],
  'Garlic':    ['Marigold','Onion','Tomato'],
  'Mustard':   ['Chickpea','Soybean','Wheat'],
  'Chickpea':  ['Mustard','Soybean','Wheat'],
  'Sunflower': ['Maize','Groundnut','Soybean'],
  'Groundnut': ['Corn','Maize','Soybean','Sunflower'],
  'Soybean':   ['Corn','Maize','Groundnut','Sunflower'],
};

const N_FIXERS = new Set(['Chickpea','Soybean','Groundnut']);
const HIGH_WATER = new Set(['Rice','Sugarcane','Tomato']);
const DRY_FALLBACKS = ['Wheat','Chickpea','Groundnut','Mustard','Soybean'];

function hexLayout(crop: CropStat, zone: { x:number;y:number;w:number;h:number }, zoneIdx=0): PlantNode[] {
  const nodes: PlantNode[] = [];
  const sp = crop.spacing;
  let row = 0;
  for (let y = zone.y + sp*0.5; y < zone.y+zone.h-sp*0.4; y += Math.floor(sp*0.866)) {
    const xShift = (row%2)*(sp/2);
    let col = 0;
    for (let x = zone.x+xShift+sp*0.5; x < zone.x+zone.w-sp*0.4; x += sp) {
      nodes.push({ x: Math.round(x,), y: Math.round(y), type: crop.name, color: crop.color, radius: Math.max(4, sp*0.32), row, col, zone: zoneIdx });
      col++;
    }
    row++;
  }
  return nodes;
}

function generateDroneMissions(
  zones: ZoneData[],
  mainCrop: CropStat,
  companionCrop: CropStat,
  hasBorder: boolean,
  landSize: number,
  upstreamMem?: UpstreamHeroContext
): { missions: DroneMission[]; summary: MissionSummary } {
  const rawMissions: DroneMission[] = [];
  let tempId = 1;

  // 1. High Severity / Medium Disease Intervention Mission
  if (upstreamMem?.diseaseDiagnosis && (upstreamMem.diseaseSeverity === 'High' || upstreamMem.diseaseSeverity === 'Medium')) {
    const isHigh = upstreamMem.diseaseSeverity === 'High';
    rawMissions.push({
      mission_id: tempId++,
      zone: `Disease Treatment Zone (${upstreamMem.diseaseDiagnosis})`,
      objective: `Targeted Spray: ${upstreamMem.diseaseDiagnosis}`,
      action: `Fungicide Application: ${upstreamMem.diseaseTreatment?.slice(0, 50) || 'Foliar spray'}`,
      priority: isHigh ? "High" : "Medium",
      altitude_m: 3.5,
      speed_mps: 2.0,
      estimated_time_min: Math.max(3, Math.round((landSize * 3) * 10) / 10),
    });
  }

  // 2. High Nutrient Deficiency Correction Mission
  if (upstreamMem?.nutrientRiskLevel === 'High' || upstreamMem?.nutrientRiskLevel === 'Medium') {
    const isHigh = upstreamMem.nutrientRiskLevel === 'High';
    rawMissions.push({
      mission_id: tempId++,
      zone: `Nutrient Deficiency Zone`,
      objective: `Variable Rate Fertilizer Application`,
      action: `Nutrient Spray: ${upstreamMem.nutrientSuggestion?.slice(0, 50) || 'Balanced NPK spray'}`,
      priority: isHigh ? "High" : "Medium",
      altitude_m: 4.0,
      speed_mps: 3.0,
      estimated_time_min: Math.max(4, Math.round((landSize * 3.5) * 10) / 10),
    });
  }

  // 3. Zone-based Survey Missions
  zones.forEach((z, idx) => {
    const isMain = z.crop === mainCrop.name;
    const crop = isMain ? mainCrop : companionCrop;

    const action = isMain
      ? "Multi-Spectral Canopy & Growth Scouting"
      : "Intercrop Health & Bio-Pest Inspection";
    const priority: "High" | "Medium" | "Low" = isMain ? "Medium" : "Low";

    const altitude = Math.max(5, Math.round((crop.height_m * 2 + 5) * 10) / 10);
    const speed = isMain ? 4.5 : 3.5;
    const estTime = Math.max(3, Math.round((landSize * 4 + idx * 2) * 10) / 10);

    rawMissions.push({
      mission_id: tempId++,
      zone: z.label || `Zone ${idx + 1} (${z.crop})`,
      objective: `${z.crop} ${isMain ? "Primary Zone Survey" : "Companion Zone Inspection"}`,
      action,
      priority,
      altitude_m: altitude,
      speed_mps: speed,
      estimated_time_min: estTime,
    });
  });

  // 4. Perimeter Border Mission
  if (hasBorder) {
    rawMissions.push({
      mission_id: tempId++,
      zone: "Perimeter / Border",
      objective: "Marigold Pest & Border Perimeter Patrol",
      action: "Thermal & Pest Barrier Scouting",
      priority: "Low",
      altitude_m: 4.0,
      speed_mps: 2.5,
      estimated_time_min: Math.max(2, Math.round((landSize * 2) * 10) / 10),
    });
  }

  // Sort by priority (High -> Medium -> Low)
  const priorityWeight: Record<string, number> = { High: 1, Medium: 2, Low: 3 };
  rawMissions.sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);

  // Re-index mission_id sequentially
  const missions = rawMissions.map((m, idx) => ({ ...m, mission_id: idx + 1 }));

  const totalTime = missions.reduce((sum, m) => sum + m.estimated_time_min, 0);
  const batteryPct = Math.min(100, Math.round(totalTime * 2.2 + 5));

  const summary: MissionSummary = {
    total_missions: missions.length,
    estimated_duration: Math.round(totalTime * 10) / 10,
    battery_required: batteryPct,
  };

  return { missions, summary };
}

async function fetchFarmerMemory(farmerId: number): Promise<UpstreamHeroContext> {
  const mem: UpstreamHeroContext = {
    prevCrop: null,
    nitrogenLevel: 'Medium',
    waterFarm: 'Medium',
    landSize: 1.0,
  };

  try {
    const [profileRows, planRows, recRows, diseaseRows, nutrientRows, boundaryRows] = await Promise.all([
      dbExecute('SELECT irrigation, land_acres FROM farmer_profile WHERE farmer_id=$1 LIMIT 1', [farmerId]),
      dbExecute('SELECT plan_id, crop_name, sowing_schedule, irrigation_plan, fertilizer_schedule FROM crop_plans WHERE farmer_id=$1 ORDER BY created_at DESC LIMIT 1', [farmerId]),
      dbExecute('SELECT id, recommended_crops FROM crop_recommendations WHERE farmer_id=$1 ORDER BY created_at DESC LIMIT 1', [farmerId]),
      dbExecute('SELECT detection_id, diagnosis, severity, treatment FROM disease_detections WHERE farmer_id=$1 ORDER BY created_at DESC LIMIT 1', [farmerId]),
      dbExecute('SELECT id, risk_level, risk_probability, suggested_action FROM nutrient_risk_log WHERE farmer_id=$1 ORDER BY created_at DESC LIMIT 1', [farmerId]),
      dbExecute('SELECT id, polygon_json, area_acres, centroid_lat, centroid_lng FROM field_boundaries WHERE farmer_id=$1 ORDER BY updated_at DESC LIMIT 1', [farmerId]),
    ]);

    if (profileRows[0]) {
      mem.waterFarm = String(profileRows[0].irrigation || 'Medium').trim();
      mem.landSize = parseFloat(String(profileRows[0].land_acres || '1')) || 1;
    }

    if (planRows[0]) {
      mem.planId = Number(planRows[0].plan_id);
      mem.prevCrop = String(planRows[0].crop_name || '').trim();
      mem.planSummary = `Crop: ${planRows[0].crop_name} | Sowing: ${planRows[0].sowing_schedule || 'Standard'}`;
    }

    if (recRows[0]) {
      mem.recommendationId = Number(recRows[0].id ?? recRows[0].rec_id);
      mem.recommendationSummary = String(recRows[0].recommended_crops || '');
      const r = mem.recommendationSummary.toLowerCase();
      if (['chickpea','soybean','groundnut','lentil'].some(n => r.includes(n))) mem.nitrogenLevel = 'Low';
      else if (['sugarcane','rice','cotton'].some(n => r.includes(n))) mem.nitrogenLevel = 'High';
    }

    if (diseaseRows[0]) {
      mem.diseaseDetectionId = Number(diseaseRows[0].detection_id);
      mem.diseaseDiagnosis = String(diseaseRows[0].diagnosis || '');
      mem.diseaseSeverity = (diseaseRows[0].severity as "Low" | "Medium" | "High") || "Medium";
      mem.diseaseTreatment = String(diseaseRows[0].treatment || '');
    }

    if (nutrientRows[0]) {
      mem.nutrientLogId = Number(nutrientRows[0].id ?? nutrientRows[0].log_id);
      mem.nutrientRiskLevel = String(nutrientRows[0].risk_level || 'Low');
      mem.nutrientProbability = Number(nutrientRows[0].risk_probability || 0);
      mem.nutrientSuggestion = String(nutrientRows[0].suggested_action || '');
      if (mem.nutrientRiskLevel === 'High') mem.nitrogenLevel = 'Low';
    }

    if (boundaryRows[0]) {
      mem.boundaryId = Number(boundaryRows[0].id);
      let poly = boundaryRows[0].polygon_json;
      if (typeof poly === 'string') {
        try { poly = JSON.parse(poly); } catch {}
      }
      mem.boundaryPolygon = Array.isArray(poly) ? poly : [];
      if (boundaryRows[0].area_acres) {
        mem.boundaryArea = parseFloat(String(boundaryRows[0].area_acres)) || undefined;
        if (mem.boundaryArea) mem.landSize = mem.boundaryArea;
      }
      mem.boundaryCentroid = {
        lat: boundaryRows[0].centroid_lat ? parseFloat(String(boundaryRows[0].centroid_lat)) : 0,
        lng: boundaryRows[0].centroid_lng ? parseFloat(String(boundaryRows[0].centroid_lng)) : 0,
      };
    }
  } catch (err) {
    console.warn('[SpatialAgent] Error fetching upstream hero context:', err);
  }

  return mem;
}

function runDecisionRules(cropKey: string, mem: Awaited<ReturnType<typeof fetchFarmerMemory>>) {
  let finalCrop = cropKey;
  let companionOverride: string|null = null;
  const memLog: string[] = [];
  const warnings: string[] = [];
  let soilImpact = 'neutral';
  let overrideCrop: string|null = null;
  let overrideReason: string|null = null;

  if (mem.boundaryId && mem.boundaryPolygon && mem.boundaryPolygon.length >= 3) {
    memLog.push(`✅ Step 0: Loaded saved field boundary (ID: ${mem.boundaryId}, ${mem.boundaryArea || mem.landSize} acres, ${mem.boundaryPolygon.length} boundary points). Generating spatial twin inside field boundary.`);
  } else {
    memLog.push(`ℹ️ Step 0: No field boundary found — generating spatial layout using default rectangular grid.`);
  }

  memLog.push(`✅ Step 1: Previous season crop: '${mem.prevCrop || 'None (first season)'}'.`);
  memLog.push(`✅ Step 2: Soil nitrogen inferred as '${mem.nitrogenLevel}' from crop history.`);
  memLog.push(`✅ Step 3: Farm water: '${mem.waterFarm}'. Crop '${cropKey}' needs '${CROP_DB[cropKey]?.water || 'Medium'}'.`);

  // Rotation rule
  if (mem.prevCrop && mem.prevCrop.toLowerCase() === cropKey.toLowerCase()) {
    warnings.push(`⚠️ Crop Rotation: '${mem.prevCrop}' was grown last season. Repeating depletes soil.`);
    const fixers = (COMPANION_MATRIX[cropKey]||[]).filter(c=>N_FIXERS.has(c));
    companionOverride = fixers.length ? fixers.sort((a,b)=>(CROP_DB[b]?.companion_score||0)-(CROP_DB[a]?.companion_score||0))[0] : 'Chickpea';
    memLog.push(`⚠️ Step 4 (Rotation): Companion forced to '${companionOverride}' (N-fixer) to restore soil.`);
  }

  // Nitrogen rule
  if (mem.nitrogenLevel === 'Low' && !N_FIXERS.has(companionOverride||'')) {
    const fixers = (COMPANION_MATRIX[finalCrop]||[]).filter(c=>N_FIXERS.has(c));
    companionOverride = fixers.length ? fixers[0] : 'Chickpea';
    memLog.push(`✅ Step 5 (Nitrogen): Soil N is Low → companion '${companionOverride}' to fix nitrogen.`);
    soilImpact = 'improves';
  }

  // Water mismatch rule
  if (mem.waterFarm === 'Low' && HIGH_WATER.has(cropKey)) {
    const alt = DRY_FALLBACKS.find(c=>c in CROP_DB && c !== cropKey) || 'Wheat';
    overrideReason = `Farm water is Low but '${cropKey}' needs High water. Switched to '${alt}'.`;
    warnings.push(`⚠️ Water Mismatch: ${overrideReason}`);
    memLog.push(`⚠️ Step 6 (Water): ${overrideReason}`);
    finalCrop = alt; overrideCrop = alt; companionOverride = null;
  }

  // Soil impact
  if (soilImpact === 'neutral') {
    const fd = CROP_DB[finalCrop]; const cd = CROP_DB[companionOverride||''];
    if (fd?.nitrogen==='Fixer' || cd?.nitrogen==='Fixer' || N_FIXERS.has(companionOverride||'')) soilImpact='improves';
    else if (fd?.nitrogen==='Consumer') soilImpact='degrades';
  }

  memLog.push(`✅ Step 7 (Output): Crop='${finalCrop}', Companion='${companionOverride||'auto'}', Soil='${soilImpact}'.`);
  return { finalCrop, companionOverride, memLog, warnings, soilImpact, overrideCrop, overrideReason };
}

export async function runSpatialAgent(
  ctx: AgentContext,
  input: { width:number; height:number; main_crop:string; companion_crops?:string[]; land_acres?:number; layout_mode?:string }
): Promise<AgentResult<SpatialLayoutData>> {
  const { farmerId, farmerProfile } = ctx;
  const W = input.width || 1000, H = input.height || 440;
  const landSize = input.land_acres || 1;

  // Normalize crop key
  const aliases: Record<string,string> = { tomatoes:'Tomato',tomato:'Tomato',corn:'Corn',maize:'Maize',wheat:'Wheat',rice:'Rice',sugarcane:'Sugarcane',cotton:'Cotton',soybean:'Soybean',soybeans:'Soybean',onion:'Onion',onions:'Onion',garlic:'Garlic',potato:'Potato',potatoes:'Potato',sunflower:'Sunflower',mustard:'Mustard',chickpea:'Chickpea',groundnut:'Groundnut',peanut:'Groundnut',marigold:'Marigold' };
  const rawCrop = (input.main_crop||'').trim();
  const requestedKey = aliases[rawCrop.toLowerCase()] || (rawCrop in CROP_DB ? rawCrop : 'Corn');

  // Memory + decision
  const mem = farmerId ? await fetchFarmerMemory(farmerId) : { prevCrop:null, nitrogenLevel:'Medium', waterFarm:'Medium', landSize:1 };
  const decision = runDecisionRules(requestedKey, mem);

  decision.memLog.unshift(
    `✅ Step 0: Loaded cross-agent context from database (Rec #${mem.recommendationId || 'none'}, Plan #${mem.planId || 'none'}, Disease #${mem.diseaseDetectionId || 'none'}, Nutrient #${mem.nutrientLogId || 'none'}).`
  );

  const mainKey = decision.finalCrop;
  const mainData = CROP_DB[mainKey];

  // Companion selection
  const companions = (COMPANION_MATRIX[mainKey]||[]).filter(c=>c in CROP_DB);
  let companionKey = decision.companionOverride || (companions.length ? companions.sort((a,b)=>(CROP_DB[b].companion_score||0)-(CROP_DB[a].companion_score||0))[0] : 'Marigold');
  if (!(companionKey in CROP_DB)) companionKey = 'Marigold';
  const companionData = CROP_DB[companionKey];

  // Layout mode
  const mode = (input.layout_mode || 'Strip').toLowerCase();
  let zones: ZoneData[] = [];
  let cropOrder = [mainData, companionData];

  // Sunlight orientation: taller crop → first zone (north/west)
  const sunlightSwapped = companionData.height_m > mainData.height_m;
  if (sunlightSwapped) cropOrder = [companionData, mainData];
  const sunlightNote = sunlightSwapped
    ? `${companionData.name} (${companionData.height_m}m) placed North/West — prevents shading ${mainData.name}.`
    : `${mainData.name} placed in primary zone. Monitor shading if companion is taller.`;

  if (mode === 'row') {
    const totalW = (1/mainData.spacing)+(1/companionData.spacing);
    const hMain = Math.floor(H*(1/mainData.spacing)/totalW);
    zones = [
      { x:0,y:0,    w:W,h:hMain,   crop:cropOrder[0].name, color:cropOrder[0].color, label:`Zone 1 – ${cropOrder[0].name} (Row)`, zone_type: "Crop" },
      { x:0,y:hMain,w:W,h:H-hMain, crop:cropOrder[1].name, color:cropOrder[1].color, label:`Zone 2 – ${cropOrder[1].name} (Row)`, zone_type: "Crop" },
    ];
  } else if (mode === 'grid') {
    zones = [
      { x:0,y:0,w:W,h:H, crop:mainData.name,      color:mainData.color,      label:`Zone 1 – ${mainData.name} (Grid)`, zone_type: "Crop" },
      { x:0,y:0,w:W,h:H, crop:companionData.name,  color:companionData.color, label:`Zone 2 – ${companionData.name} (Grid)`, zone_type: "Crop" },
    ];
  } else {
    // Strip (default/auto)
    const totalW = (1/cropOrder[0].spacing)+(1/cropOrder[1].spacing);
    const wMain = Math.floor(W*(1/cropOrder[0].spacing)/totalW);
    zones = [
      { x:0,    y:0,w:wMain,  h:H, crop:cropOrder[0].name, color:cropOrder[0].color, label:`Zone 1 – ${cropOrder[0].name} (Strip)`, zone_type: "Crop" },
      { x:wMain,y:0,w:W-wMain,h:H, crop:cropOrder[1].name, color:cropOrder[1].color, label:`Zone 2 – ${cropOrder[1].name} (Strip)`, zone_type: "Crop" },
    ];
  }

  // Upstream Disease Overlay Zone
  if (mem.diseaseDiagnosis) {
    zones.push({
      x: 0, y: 0, w: Math.floor(W * 0.35), h: Math.floor(H * 0.35),
      crop: mainData.name, color: "#ef4444",
      label: `Disease Treatment Zone (${mem.diseaseDiagnosis})`,
      zone_type: "Disease"
    });
    decision.memLog.push(`⚠️ Step 7.1: Created Disease Treatment Zone for '${mem.diseaseDiagnosis}' (${mem.diseaseSeverity || 'Medium'} severity).`);
  }

  // Upstream Nutrient Overlay Zone
  if (mem.nutrientRiskLevel === 'High' || mem.nutrientRiskLevel === 'Medium') {
    zones.push({
      x: Math.floor(W * 0.65), y: Math.floor(H * 0.65), w: Math.floor(W * 0.35), h: Math.floor(H * 0.35),
      crop: mainData.name, color: "#f59e0b",
      label: `Nutrient Management Zone (${mem.nutrientRiskLevel} Risk)`,
      zone_type: "Nutrient"
    });
    decision.memLog.push(`⚠️ Step 7.2: Created Nutrient Deficiency Zone (${mem.nutrientRiskLevel} risk level).`);
  }

  // Generate interior nodes
  let interiorNodes: PlantNode[] = [];
  if (mode === 'grid') {
    let row = 0;
    for (let y = mainData.spacing*0.5; y < H-mainData.spacing*0.4; y += Math.floor(mainData.spacing*0.866)) {
      const curCrop = row%2===0 ? mainData : companionData;
      const sp = curCrop.spacing;
      let col=0;
      for (let x = (row%2)*(sp/2)+sp*0.5; x < W-sp*0.4; x+=sp) {
        interiorNodes.push({ x:Math.round(x), y:Math.round(y), type:curCrop.name, color:curCrop.color, radius:Math.max(4,sp*0.32), row, col, zone: row%2===0?1:2 });
        col++;
      }
      row++;
    }
  } else {
    cropOrder.forEach((crop, i) => interiorNodes.push(...hexLayout(crop, zones[i], i+1)));
  }

  // Marigold border ring
  const borderNodes: PlantNode[] = [];
  if (mainKey !== 'Marigold' && companionKey !== 'Marigold') {
    const bd = CROP_DB['Marigold'], bsp = bd.spacing, M = 8;
    for (let x=bsp*0.5; x<W; x+=bsp) {
      borderNodes.push({ x:Math.round(x),y:M,       type:'Marigold',color:bd.color,radius:Math.max(4,bsp*0.3),row:-1,col:-1,border:true,zone:0 });
      borderNodes.push({ x:Math.round(x),y:H-M,     type:'Marigold',color:bd.color,radius:Math.max(4,bsp*0.3),row:-1,col:-1,border:true,zone:0 });
    }
    for (let y=bsp; y<H-M; y+=bsp) {
      borderNodes.push({ x:M,    y:Math.round(y), type:'Marigold',color:bd.color,radius:Math.max(4,bsp*0.3),row:-1,col:-1,border:true,zone:0 });
      borderNodes.push({ x:W-M, y:Math.round(y), type:'Marigold',color:bd.color,radius:Math.max(4,bsp*0.3),row:-1,col:-1,border:true,zone:0 });
    }
  }

  const fullLayout = [...borderNodes, ...interiorNodes];

  // Insights
  const allCrops = [mainData, companionData];
  const fixerCount = allCrops.filter(c=>c.nitrogen==='Fixer').length;
  const nitrogenBalance = fixerCount>0 ? `${fixerCount} nitrogen-fixing crop(s) present — fertilizer not needed` : 'No N-fixer — add a legume or apply 40kg/acre urea';
  const avgW: Record<string,number> = { Low:1,Medium:2,High:3 };
  const waterEfficiency = Math.max(0, Math.round((1 - allCrops.reduce((s,c)=>s+avgW[c.water],0)/(allCrops.length*3))*30));
  const compScore = companionData.companion_score;
  const landEff = Math.min(95, 70 + compScore*2 + (fixerCount>0?8:0) + (borderNodes.length>0?5:0));
  const yieldBoost = Math.min(40, compScore*3 + (fixerCount>0?8:0));

  // Zone yields
  const zoneYields: ZoneYield[] = cropOrder.map((crop,i)=>{
    const acres = mode==='grid' ? landSize*0.5 : mode==='row'
      ? (zones[i].h/H)*landSize : (zones[i].w/W)*landSize;
    return { crop:crop.name, acres:Math.round(acres*100)/100, yield_t:Math.round(crop.yield_t_per_acre*acres*100)/100 };
  });
  if (borderNodes.length) {
    const borderYield = Math.round(CROP_DB['Marigold'].yield_t_per_acre*0.05*100)/100;
    zoneYields.push({ crop:'Marigold (border)', acres:0.05, yield_t:borderYield });
  }
  const totalYield = Math.round(zoneYields.reduce((s,z)=>s+z.yield_t,0)*100)/100;

  const warnings = [...decision.warnings];
  if (allCrops.some(c=>c.water==='High') && allCrops.some(c=>c.water==='Low'))
    warnings.push('⚠️ Mixed water needs — use zone-specific drip irrigation.');
  if (mainData.shade==='Sensitive' && companionData.height_m>mainData.height_m)
    warnings.push(`⚠️ ${mainData.name} is shade-sensitive — keep ${companionData.name} on north side.`);

  // Layout quality score
  const scoreCompanion = Math.min(50, compScore*5);
  const scoreNitrogen  = fixerCount>0 ? 20 : 0;
  const scoreWater     = warnings.some(w=>w.includes('water'))? 5 : 15;
  const scoreBorder    = borderNodes.length>0 ? 15 : 0;
  const layoutScore    = Math.min(100, scoreCompanion+scoreNitrogen+scoreWater+scoreBorder);

  const analysis = `**Spatial Twin Generated** — ${interiorNodes.length} interior plants + ${borderNodes.length} border Marigolds across a **${mode.charAt(0).toUpperCase()+mode.slice(1)} layout**.\n\n**Primary:** ${mainData.name} (${mainData.spacing}cm spacing, ${mainData.height_m}m) paired with **${companionData.name}** (${companionData.spacing}cm).\n\n**Sunlight:** ${sunlightNote}\n\nLand efficiency **${landEff}%** · Yield boost **${yieldBoost}%** · Layout score **${layoutScore}/100** · Est. yield **${totalYield}t**.`;

  const insights = {
    total_plants: fullLayout.length,
    interior_plants: interiorNodes.length,
    border_plants: borderNodes.length,
    land_efficiency: landEff,
    water_saving_pct: waterEfficiency,
    yield_boost_pct: yieldBoost,
    layout_score: layoutScore,
    nitrogen_balance: nitrogenBalance,
    best_combo: (COMPANION_MATRIX[mainKey] || []).slice(0, 3).join(', ') || 'Marigold, Legumes',
    sunlight_note: sunlightNote,
    zone_yields: zoneYields,
    total_yield: totalYield,
    warnings,
    action_items: [
      `🌱 Plant ${mainData.name} with ${mainData.spacing}cm spacing in Zone 1`,
      `🌿 Intercrop ${companionData.name} in Zone 2 (${companionData.spacing}cm)`,
      borderNodes.length ? '🌼 Marigold border active — natural pest repellent' : 'Consider adding Marigold border',
      `💧 Irrigation: ${mainData.water} for ${mainData.name}, ${companionData.water} for ${companionData.name}`,
      `🔬 ${nitrogenBalance}`,
      `📦 Est. yield: ${totalYield}t from ${landSize} acre(s)`,
    ],
  };

  // Generate Drone Missions
  const droneMissionData = generateDroneMissions(
    zones,
    mainData,
    companionData,
    borderNodes.length > 0,
    landSize,
    mem
  );
  const missions = droneMissionData.missions;
  const missionSummary = droneMissionData.summary;

  decision.memLog.push(
    `✅ Step 8: Generated ${missions.length} unified autonomous drone missions (${missionSummary.estimated_duration} min flight time, ${missionSummary.battery_required}% battery required).`
  );

  // ── Gemini AI Spatial Plan Review (Multi-Agent Cross Validation) ──
  let aiReview: SpatialAIReview;
  try {
    const aiModel = getJsonModel(SYSTEM_INSTRUCTION, { temperature: 0.2, maxTokens: 800 });
    const aiPrompt = `Farmer Profile
--------------
Location: ${[farmerProfile?.village, farmerProfile?.district, farmerProfile?.state].filter(Boolean).join(', ') || 'India'}
Soil: ${farmerProfile?.soil_type || 'Not provided'}
Irrigation: ${farmerProfile?.irrigation || 'Not provided'}
Land: ${landSize} acre(s)

Upstream Hero Agent Context
---------------------------
Crop Recommendation: ${mem.recommendationSummary || 'None'}
Active Crop Plan: ${mem.planSummary || 'None'}
Recent Disease Detection: ${mem.diseaseDiagnosis ? `${mem.diseaseDiagnosis} (${mem.diseaseSeverity} severity) — ${mem.diseaseTreatment}` : 'None'}
Nutrient Assessment: ${mem.nutrientRiskLevel ? `${mem.nutrientRiskLevel} risk (${mem.nutrientProbability}%) — ${mem.nutrientSuggestion}` : 'None'}

Generated Spatial Plan
----------------------
Main Crop: ${mainData.name} (${mainData.spacing}cm spacing)
Companion Crop: ${companionData.name} (${companionData.spacing}cm spacing)
Layout Mode: ${mode}
Total Plants: ${fullLayout.length} (${interiorNodes.length} interior + ${borderNodes.length} border Marigolds)
Estimated Yield: ${totalYield} tonnes
Layout Score: ${layoutScore}/100
Nitrogen Balance: ${nitrogenBalance}
Soil Impact: ${decision.soilImpact}
Warnings: ${warnings.join('; ') || 'None'}

Prioritized Unified Drone Missions (${missions.length} Total)
-------------------------------------------------
${missions.map(m => `[#${m.mission_id}] ${m.priority} Priority - ${m.zone}: ${m.objective} (${m.action})`).join('\n')}
Total Flight Time: ${missionSummary.estimated_duration} min
Battery Required: ${missionSummary.battery_required}%

Review this complete multi-agent agricultural strategy and respond strictly with JSON using this exact schema:
{
  "overall_rating": 9,
  "strengths": ["Key layout advantage 1", "Key advantage 2"],
  "weaknesses": ["Potential limitation or area to monitor"],
  "optimization_suggestions": ["Actionable optimization tip"],
  "risk_factors": ["Agronomic or environmental risk"],
  "drone_notes": ["Drone survey advice"],
  "summary": "Brief overall expert summary of the layout"
}`;

    const aiResult = await withTimeout(aiModel.generateContent(aiPrompt), 15_000);
    aiReview = JSON.parse(aiResult.response.text()) as SpatialAIReview;
    decision.memLog.push(
      `✅ Step 9: AI Multi-Agent Cross-Validation review completed (Rating: ${aiReview.overall_rating}/10).`
    );
  } catch (aiErr) {
    console.warn('Gemini Spatial AI Review fallback active:', aiErr);
    aiReview = {
      overall_rating: Math.min(10, Math.max(1, Math.round(layoutScore / 10))),
      strengths: [
        `Deterministic companion planting pairing ${mainData.name} with ${companionData.name}`,
        borderNodes.length > 0 ? "Marigold perimeter active for pest suppression" : "Optimal land efficiency",
      ],
      weaknesses: warnings.length > 0 ? warnings : ["Monitor nutrient competition in high density zones"],
      optimization_suggestions: [
        `Ensure zone-specific drip lines are calibrated for ${mainData.water} vs ${companionData.water} requirements`,
        "Schedule regular drone canopy monitoring during peak growth weeks",
      ],
      risk_factors: [
        "Monsoon waterlogging if drainage channels are not maintained",
      ],
      drone_notes: [
        `Conduct initial multi-spectral survey (${missionSummary.estimated_duration} min mission) after sowing`,
      ],
      summary: `Solid spatial layout optimizing ${mainData.name} yield with ${companionData.name} companion intercropping.`,
    };
    decision.memLog.push(`⚠️ Step 9: Gemini review timed out/failed — using fallback expert review.`);
  }

  decision.memLog.push(`✅ Step 10: Stored spatial plan layout, cross-agent relationships, and drone missions to database.`);

  // Persist to DB (spatial_plans table with foreign key relationships)
  if (farmerId) {
    try {
      await dbExecute(`ALTER TABLE spatial_plans ADD COLUMN IF NOT EXISTS boundary_id INT;`);
      await dbExecute(
        `INSERT INTO spatial_plans (
          farmer_id, plan_id, recommendation_id, disease_detection_id, nutrient_analysis_id, boundary_id,
          main_crop, companion_crop, layout_mode, land_size_acres,
          layout_json, zones_json, insights_json, crop_stats_json, memory_log_json,
          missions_json, ai_review_json, layout_score, total_yield, soil_impact
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
        [
          farmerId,
          mem.planId || ctx.planId || null,
          mem.recommendationId || null,
          mem.diseaseDetectionId || null,
          mem.nutrientLogId || null,
          mem.boundaryId || null,
          mainData.name,
          companionData.name,
          mode,
          landSize,
          JSON.stringify(fullLayout),
          JSON.stringify(zones),
          JSON.stringify(insights),
          JSON.stringify(allCrops),
          JSON.stringify(decision.memLog),
          JSON.stringify({ missions, summary: missionSummary }),
          JSON.stringify(aiReview),
          layoutScore,
          totalYield,
          decision.soilImpact,
        ]
      );
    } catch (dbErr) {
      console.error('Failed to save spatial plan to spatial_plans table:', dbErr);
    }

    void logAgentAction({
      farmerId,
      agent: 'spatial',
      actionType: 'spatial_twin',
      input: `Crop: ${mainData.name} | Companion: ${companionData.name} | Mode: ${mode} | Land: ${landSize}ac`,
      output: `Score: ${layoutScore}. Yield: ${totalYield}t. ${interiorNodes.length} plants + ${borderNodes.length} borders. Missions: ${missions.length}. AI Rating: ${aiReview.overall_rating}/10.`,
      toolsUsed: ['hex-layout-engine', 'rules-engine', 'drone-mission-generator', 'gemini-spatial-reviewer'],
      metadata: {
        layout_mode: mode,
        layout_score: layoutScore,
        total_yield: totalYield,
        land_efficiency: landEff,
        yield_boost: yieldBoost,
        missions_count: missions.length,
        ai_rating: aiReview.overall_rating,
        recommendation_id: mem.recommendationId,
        plan_id: mem.planId,
        disease_detection_id: mem.diseaseDetectionId,
        nutrient_analysis_id: mem.nutrientLogId,
        boundary_id: mem.boundaryId,
      },
    });
  }

  return {
    success: true,
    data: {
      layout: fullLayout,
      zones,
      analysis,
      main_crop: mainData.name,
      companion: companionData.name,
      insights,
      crop_stats: allCrops,
      missions,
      mission_summary: missionSummary,
      ai_review: aiReview,
      memory_log: decision.memLog,
      override_crop: decision.overrideCrop,
      override_reason: decision.overrideReason,
      prev_crop: mem.prevCrop,
      soil_impact: decision.soilImpact,
      layout_mode: mode,
      boundary_id: mem.boundaryId || null,
      boundary: mem.boundaryPolygon ? {
        id: mem.boundaryId,
        polygon: mem.boundaryPolygon,
        area: mem.boundaryArea || landSize,
        centroid: mem.boundaryCentroid,
      } : null,
    },
    trace: decision.memLog,
  };
}

export { CROP_DB };

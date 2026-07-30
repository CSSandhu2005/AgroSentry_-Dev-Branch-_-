// src/lib/agents/dashboard-agent.ts
// DashboardAgent — Synthesizes & orchestrates outputs from all AgroSentry Hero Agents

import { dbExecute } from '@/lib/fluxbase';
import { getJsonModel, withTimeout } from '@/lib/gemini';
import type { AgentContext, AgentResult } from './types';

// ── Types & Contracts ──────────────────────────────────────────

export interface HeroAgentSummary<T = Record<string, unknown>> {
  available: boolean;
  status: string;
  updatedAt: string | null;
  summary: T | null;
}

export interface FarmOverview {
  farmerId: number;
  name: string;
  village: string;
  district: string;
  state: string;
  landSize: number;
  soilType: string;
  irrigation: string;
}

export interface DashboardMetrics {
  farmHealthScore: number; // 0–100 derived score
  expectedYield: number;
  layoutScore: number;
  landEfficiency: number;
  waterSavingPct: number;
  missionCount: number;
}

export interface DashboardAlert {
  id: string;
  type: 'disease' | 'nutrient' | 'spatial' | 'boundary';
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  message: string;
}

export interface DroneOverview {
  missionCount: number;
  estimatedDurationMin: number;
  batteryRequiredPct: number;
  missions: Array<{
    mission_id: number;
    zone: string;
    objective: string;
    action: string;
    priority: 'High' | 'Medium' | 'Low';
    altitude_m: number;
    speed_mps: number;
    estimated_time_min: number;
  }>;
}

export interface RecentActivity {
  id: number;
  agent: string;
  actionType: string;
  input: string;
  output: string;
  createdAt: string;
  agent_name?: string;
  action_type?: string;
  timestamp?: string;
}

export interface HeroRecommendationData {
  id?: number;
  recommended_crops?: string;
  season?: string;
  confidence?: number;
}

export interface HeroCropPlanData {
  plan_id?: number;
  crop_name?: string;
  sowing_schedule?: string;
  irrigation_plan?: string;
  fertilizer_schedule?: string;
  status?: string;
}

export interface HeroDiseaseData {
  detection_id?: number;
  diagnosis?: string;
  severity?: string;
  treatment?: string;
}

export interface HeroNutrientData {
  id?: number;
  risk_level?: string;
  risk_probability?: number;
  suggested_action?: string;
}

export interface HeroSpatialTwinData {
  id?: number;
  main_crop?: string;
  companion_crop?: string;
  layout_mode?: string;
  layout_score?: number;
  total_yield?: number;
}

export interface HeroFieldBoundaryData {
  id?: number;
  area_acres?: number;
  centroid?: { lat: number; lng: number };
}

export interface HeroAgents {
  recommendation: HeroAgentSummary<HeroRecommendationData>;
  cropPlan: HeroAgentSummary<HeroCropPlanData>;
  disease: HeroAgentSummary<HeroDiseaseData>;
  nutrient: HeroAgentSummary<HeroNutrientData>;
  spatialTwin: HeroAgentSummary<HeroSpatialTwinData>;
  fieldBoundary: HeroAgentSummary<HeroFieldBoundaryData>;
}

export interface ExecutivePulse {
  greeting: string;
  pulse: string;
  summary: string;
  top_action_items: string[];
}

export interface DashboardResponse {
  overview: FarmOverview;
  metrics: DashboardMetrics;
  alerts: DashboardAlert[];
  heroAgents: HeroAgents;
  drone: DroneOverview;
  activity: RecentActivity[];
  executivePulse: ExecutivePulse;
}

// ── Phase 1: Context Data Loader ─────────────────────────────

interface RawContextData {
  profile: Record<string, unknown> | null;
  recommendation: Record<string, unknown> | null;
  plan: Record<string, unknown> | null;
  disease: Record<string, unknown> | null;
  nutrient: Record<string, unknown> | null;
  boundary: Record<string, unknown> | null;
  spatial: Record<string, unknown> | null;
  memory: Array<Record<string, unknown>>;
}

async function safeQuery(sql: string, params: any[] = []): Promise<any[]> {
  try {
    return await dbExecute(sql, params);
  } catch (err) {
    console.warn(`[SafeQuery] Notice: ${sql}`, err);
    return [];
  }
}

async function fetchDashboardContext(farmerId: number): Promise<RawContextData> {
  const [
    profileRows,
    recRows,
    planRows,
    diseaseRows,
    nutrientRows,
    boundaryRows,
    spatialRows,
    memoryRows,
  ] = await Promise.all([
    safeQuery('SELECT * FROM farmer_profile WHERE farmer_id = $1 LIMIT 1', [farmerId]),
    safeQuery('SELECT * FROM crop_recommendations WHERE farmer_id = $1 ORDER BY 1 DESC LIMIT 1', [farmerId]),
    safeQuery('SELECT * FROM crop_plans WHERE farmer_id = $1 ORDER BY 1 DESC LIMIT 1', [farmerId]),
    safeQuery('SELECT * FROM disease_detections WHERE farmer_id = $1 ORDER BY 1 DESC LIMIT 1', [farmerId]),
    safeQuery('SELECT * FROM nutrient_risk_log WHERE farmer_id = $1 ORDER BY 1 DESC LIMIT 1', [farmerId]),
    safeQuery('SELECT * FROM field_boundaries WHERE farmer_id = $1 ORDER BY 1 DESC LIMIT 1', [farmerId]),
    safeQuery('SELECT * FROM spatial_plans WHERE farmer_id = $1 ORDER BY 1 DESC LIMIT 1', [farmerId]),
    safeQuery('SELECT * FROM agent_memory WHERE farmer_id = $1 ORDER BY 1 DESC LIMIT 15', [farmerId]),
  ]);

  return {
    profile: profileRows[0] || null,
    recommendation: recRows[0] || null,
    plan: planRows[0] || null,
    disease: diseaseRows[0] || null,
    nutrient: nutrientRows[0] || null,
    boundary: boundaryRows[0] || null,
    spatial: spatialRows[0] || null,
    memory: memoryRows || [],
  };
}

// ── Helper Builders ───────────────────────────────────────────

function parseJsonField(val: unknown): any {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return val; }
  }
  return val;
}

function buildFarmOverview(raw: RawContextData, farmerId: number): FarmOverview {
  const p = raw.profile || {};
  return {
    farmerId,
    name: String(p.name || 'Farmer').trim(),
    village: String(p.village || 'Local Farm').trim(),
    district: String(p.district || '').trim(),
    state: String(p.state || 'India').trim(),
    landSize: parseFloat(String(p.land_acres || '1.0')) || 1.0,
    soilType: String(p.soil_type || 'Loam').trim(),
    irrigation: String(p.irrigation || 'Drip').trim(),
  };
}

function buildHeroAgentsSummary(raw: RawContextData): HeroAgents {
  // Recommendation
  const rec = raw.recommendation;
  const recSummary: HeroAgentSummary = rec ? {
    available: true,
    status: 'Completed',
    updatedAt: String(rec.created_at || rec.updated_at || ''),
    summary: {
      id: rec.id ?? rec.rec_id,
      recommended_crops: rec.recommended_crops,
      season: rec.season,
      confidence: rec.confidence_score ?? 85,
    },
  } : { available: false, status: 'Pending', updatedAt: null, summary: null };

  // Crop Plan
  const plan = raw.plan;
  const planSummary: HeroAgentSummary = plan ? {
    available: true,
    status: String(plan.status || 'Active'),
    updatedAt: String(plan.created_at || plan.updated_at || ''),
    summary: {
      plan_id: plan.plan_id,
      crop_name: plan.crop_name,
      sowing_schedule: plan.sowing_schedule,
      irrigation_plan: plan.irrigation_plan,
      fertilizer_schedule: plan.fertilizer_schedule,
    },
  } : { available: false, status: 'Pending', updatedAt: null, summary: null };

  // Disease
  const dis = raw.disease;
  const diseaseSummary: HeroAgentSummary = dis ? {
    available: true,
    status: String(dis.severity || 'Medium') === 'High' ? 'Action Required' : 'Monitored',
    updatedAt: String(dis.created_at || dis.updated_at || ''),
    summary: {
      detection_id: dis.detection_id,
      diagnosis: dis.diagnosis,
      severity: dis.severity,
      treatment: dis.treatment,
    },
  } : { available: false, status: 'Pending', updatedAt: null, summary: null };

  // Nutrient
  const nut = raw.nutrient;
  const nutrientSummary: HeroAgentSummary = nut ? {
    available: true,
    status: String(nut.risk_level || 'Low') === 'High' ? 'Risk Alert' : 'Normal',
    updatedAt: String(nut.logged_at || nut.created_at || ''),
    summary: {
      id: nut.id ?? nut.log_id,
      risk_level: nut.risk_level,
      risk_probability: nut.risk_probability,
      suggested_action: nut.suggested_action,
    },
  } : { available: false, status: 'Pending', updatedAt: null, summary: null };

  // Spatial Twin
  const sp = raw.spatial;
  const spatialSummary: HeroAgentSummary = sp ? {
    available: true,
    status: 'Active Twin',
    updatedAt: String(sp.created_at || sp.updated_at || ''),
    summary: {
      id: sp.id,
      main_crop: sp.main_crop,
      companion_crop: sp.companion_crop,
      layout_mode: sp.layout_mode,
      layout_score: sp.layout_score,
      total_yield: sp.total_yield,
    },
  } : { available: false, status: 'Pending', updatedAt: null, summary: null };

  // Field Boundary
  const fb = raw.boundary;
  const boundarySummary: HeroAgentSummary = fb ? {
    available: true,
    status: 'Boundary Saved',
    updatedAt: String(fb.updated_at || fb.created_at || ''),
    summary: {
      id: fb.id,
      area_acres: fb.area_acres,
      centroid: { lat: fb.centroid_lat, lng: fb.centroid_lng },
    },
  } : { available: false, status: 'Pending', updatedAt: null, summary: null };

  return {
    recommendation: recSummary,
    cropPlan: planSummary,
    disease: diseaseSummary,
    nutrient: nutrientSummary,
    spatialTwin: spatialSummary,
    fieldBoundary: boundarySummary,
  };
}

function buildDashboardMetrics(raw: RawContextData, heroAgents: HeroAgents): DashboardMetrics {
  const sp = raw.spatial;
  const insights = sp ? parseJsonField(sp.insights_json) || {} : {};
  const missionsObj = sp ? parseJsonField(sp.missions_json) || {} : {};

  const expectedYield = sp?.total_yield ? parseFloat(String(sp.total_yield)) : 0;
  const layoutScore = sp?.layout_score ? parseInt(String(sp.layout_score), 10) : 0;
  const landEfficiency = insights.land_efficiency ? parseInt(String(insights.land_efficiency), 10) : (sp ? 85 : 0);
  const waterSavingPct = insights.water_saving_pct ? parseInt(String(insights.water_saving_pct), 10) : (sp ? 25 : 0);
  const missionCount = Array.isArray(missionsObj.missions) ? missionsObj.missions.length : 0;

  // Derive Farm Health Score (0-100)
  let healthScore = 100;

  // Disease penalty
  if (heroAgents.disease.available && heroAgents.disease.summary) {
    const sev = String(heroAgents.disease.summary.severity || 'Low');
    if (sev === 'High') healthScore -= 30;
    else if (sev === 'Medium') healthScore -= 15;
  }

  // Nutrient penalty
  if (heroAgents.nutrient.available && heroAgents.nutrient.summary) {
    const risk = String(heroAgents.nutrient.summary.risk_level || 'Low');
    if (risk === 'High') healthScore -= 25;
    else if (risk === 'Medium') healthScore -= 10;
  }

  // Spatial bonus / penalty
  if (layoutScore > 0) {
    healthScore = Math.round((healthScore * 0.6) + (layoutScore * 0.4));
  }

  // Cap score 0..100
  const farmHealthScore = Math.max(10, Math.min(100, healthScore));

  return {
    farmHealthScore,
    expectedYield,
    layoutScore: layoutScore || (heroAgents.spatialTwin.available ? 88 : 0),
    landEfficiency,
    waterSavingPct,
    missionCount,
  };
}

function buildAlerts(raw: RawContextData, heroAgents: HeroAgents): DashboardAlert[] {
  const alerts: DashboardAlert[] = [];

  if (heroAgents.disease.available && heroAgents.disease.summary) {
    const d = heroAgents.disease.summary;
    const sev = String(d.severity || 'Medium') as 'High' | 'Medium' | 'Low';
    alerts.push({
      id: `dis-${d.detection_id || 1}`,
      type: 'disease',
      severity: sev,
      title: `Disease Alert: ${d.diagnosis || 'Pest/Pathogen'}`,
      message: `${d.treatment || 'Apply recommended treatment immediately.'}`,
    });
  }

  if (heroAgents.nutrient.available && heroAgents.nutrient.summary) {
    const n = heroAgents.nutrient.summary;
    const risk = String(n.risk_level || 'Low');
    if (risk === 'High' || risk === 'Medium') {
      alerts.push({
        id: `nut-${n.id || 1}`,
        type: 'nutrient',
        severity: risk as 'High' | 'Medium',
        title: `Nutrient Deficiency (${risk} Risk)`,
        message: `${n.suggested_action || 'Inspect soil nitrogen levels and adjust fertilizer.'}`,
      });
    }
  }

  if (!heroAgents.fieldBoundary.available) {
    alerts.push({
      id: 'boundary-missing',
      type: 'boundary',
      severity: 'Low',
      title: 'Field Boundary Not Drawn',
      message: 'Trace your field on the Satellite Map to generate spatial twin boundary clipping.',
    });
  }

  return alerts;
}

function buildDroneOverview(raw: RawContextData): DroneOverview {
  const sp = raw.spatial;
  if (!sp) {
    return { missionCount: 0, estimatedDurationMin: 0, batteryRequiredPct: 0, missions: [] };
  }

  const missionsData = parseJsonField(sp.missions_json) || {};
  const missions = Array.isArray(missionsData.missions) ? missionsData.missions : [];
  const summary = missionsData.summary || {};

  return {
    missionCount: missions.length,
    estimatedDurationMin: summary.estimated_duration || 0,
    batteryRequiredPct: summary.battery_required || 0,
    missions,
  };
}

function buildActivityTimeline(raw: RawContextData): RecentActivity[] {
  if (!Array.isArray(raw.memory)) return [];

  return raw.memory.map((m, idx) => ({
    id: Number(m.id || idx + 1),
    agent: String(m.agent || 'system'),
    actionType: String(m.action_type || 'update'),
    input: String(m.input_text || '').slice(0, 100),
    output: String(m.output_text || '').slice(0, 150),
    createdAt: String(m.created_at || ''),
  }));
}

// ── Executive Pulse (Gemini with 5s Timeout + Fallback) ───────

async function generateExecutivePulse(
  overview: FarmOverview,
  heroAgents: HeroAgents,
  metrics: DashboardMetrics,
  alerts: DashboardAlert[]
): Promise<ExecutivePulse> {
  const defaultPulse: ExecutivePulse = {
    greeting: `Welcome back, ${overview.name}!`,
    pulse: `Farm status is operational (Health Score: ${metrics.farmHealthScore}/100).`,
    summary: `Your farm in ${overview.village} (${overview.landSize} acres) is currently monitored by AgroSentry AI. ${
      heroAgents.spatialTwin.available
        ? `Active spatial layout: ${heroAgents.spatialTwin.summary?.main_crop} intercropped with ${heroAgents.spatialTwin.summary?.companion_crop}.`
        : 'No spatial twin plan active yet.'
    }`,
    top_action_items: alerts.length
      ? alerts.map((a) => `${a.title} — ${a.message}`)
      : [
          `Monitor irrigation schedule for ${overview.irrigation} setup.`,
          `Keep soil nutrient levels balanced.`,
        ],
  };

  try {
    const model = getJsonModel(
      `You are the Senior AI Farm Commander for AgroSentry. Synthesize a brief executive farm summary. Respond strictly in valid JSON.`
    );
    const prompt = `Farmer: ${overview.name} (${overview.village}, ${overview.landSize} acres)
Farm Health Score: ${metrics.farmHealthScore}/100
Active Crop Plan: ${heroAgents.cropPlan.available ? heroAgents.cropPlan.summary?.crop_name : 'None'}
Disease Status: ${heroAgents.disease.available ? heroAgents.disease.summary?.diagnosis : 'None'}
Nutrient Risk: ${heroAgents.nutrient.available ? heroAgents.nutrient.summary?.risk_level : 'Normal'}
Spatial Layout: ${heroAgents.spatialTwin.available ? `${heroAgents.spatialTwin.summary?.main_crop} + ${heroAgents.spatialTwin.summary?.companion_crop}` : 'None'}
Active Alerts (${alerts.length}): ${alerts.map((a) => a.title).join('; ')}

Return JSON:
{
  "greeting": "Warm 1-sentence greeting",
  "pulse": "1-sentence executive command status",
  "summary": "2-sentence overall agronomic summary",
  "top_action_items": ["Action 1", "Action 2"]
}`;

    const aiRes = await withTimeout(model.generateContent(prompt), 5000);
    const parsed = JSON.parse(aiRes.response.text()) as Partial<ExecutivePulse>;
    return {
      greeting: parsed.greeting || defaultPulse.greeting,
      pulse: parsed.pulse || defaultPulse.pulse,
      summary: parsed.summary || defaultPulse.summary,
      top_action_items: parsed.top_action_items || defaultPulse.top_action_items,
    };
  } catch (err) {
    console.warn('[DashboardAgent] Gemini Executive Pulse fallback used:', err);
    return defaultPulse;
  }
}

// ── Main Agent Function ───────────────────────────────────────

export async function runDashboardAgent(
  ctx: AgentContext
): Promise<AgentResult<DashboardResponse>> {
  const trace: string[] = ['Step 1: Initiating modular Dashboard Agent aggregation...'];
  const farmerId = ctx.farmerId || 5;

  try {
    // 1. Parallel Context Loading
    trace.push('Step 2: Fetching raw context across 8 database tables...');
    const rawData = await fetchDashboardContext(farmerId);

    // 2. Incremental Builder Pipeline
    trace.push('Step 3: Building Farm Overview...');
    const overview = buildFarmOverview(rawData, farmerId);

    trace.push('Step 4: Assembling Hero Agent Summaries with availability & timestamps...');
    const heroAgents = buildHeroAgentsSummary(rawData);

    trace.push('Step 5: Pre-calculating Dashboard Metrics & Farm Health Score...');
    const metrics = buildDashboardMetrics(rawData, heroAgents);

    trace.push('Step 6: Formulating Alerts...');
    const alerts = buildAlerts(rawData, heroAgents);

    trace.push('Step 7: Building Drone Overview...');
    const drone = buildDroneOverview(rawData);

    trace.push('Step 8: Building Recent Activity Timeline...');
    const activity = buildActivityTimeline(rawData);

    trace.push('Step 9: Generating Executive AI Pulse with fallback...');
    const executivePulse = await generateExecutivePulse(overview, heroAgents, metrics, alerts);

    trace.push('Step 10 ✓: Dashboard assembly complete.');

    return {
      success: true,
      data: {
        overview,
        metrics,
        alerts,
        heroAgents,
        drone,
        activity,
        executivePulse,
      },
      trace,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Dashboard Agent failed';
    trace.push(`Step X ❌: ${msg}`);
    return { success: false, error: msg, trace };
  }
}

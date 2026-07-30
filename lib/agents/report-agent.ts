// src/lib/agents/report-agent.ts
// ReportAgent — Consumes DashboardAgent to format a presentation-agnostic Farm Advisory Report

import { runDashboardAgent } from './dashboard-agent';
import { getJsonModel, withTimeout } from '@/lib/gemini';
import type { AgentContext, AgentResult } from './types';
import type { DashboardResponse } from './dashboard-agent';

// ── Presentation-Agnostic Response Contracts ──────────────────

export interface ReportMetadata {
  reportId: string;
  status: 'Draft' | 'Final';
  reportVersion: string;
  schemaVersion: string;
  generatedAt: string;
}

export interface ReportStatistics {
  heroAgentsCompleted: number;
  alertsCount: number;
  pendingAnalyses: number;
  generatedInMs: number;
}

export interface ReportConfidence {
  dataCompletenessPct: number; // Percentage of 6 Hero Agents with available data
  agronomicConfidencePct: number; // Overall confidence in recommendations
  description: string;
}

export interface StructuredExecutiveSummary {
  status: string;
  currentSituation: string;
  topRisks: string[];
  recommendedPriority: string;
  confidence: ReportConfidence;
}

export interface ActionPlanItem {
  id: string;
  task: string;
  category: 'Crop Care' | 'Plant Protection' | 'Soil & Nutrient' | 'Drone Mission' | 'Field Geometry';
  priority: 'High' | 'Medium' | 'Low';
  sourceAgent: string;
  status: 'Pending' | 'Completed';
}

export interface TechnicalAppendix {
  dashboardVersion: string;
  reportVersion: string;
  farmerId: number;
  recommendationId: number | null;
  planId: number | null;
  diseaseId: number | null;
  nutrientId: number | null;
  spatialId: number | null;
  boundaryId: number | null;
  missionCount: number;
  generatedAt: string;
}

export interface ReportResponse {
  metadata: ReportMetadata;
  statistics: ReportStatistics;
  confidence: ReportConfidence;
  overview: DashboardResponse['overview'];
  executiveSummary: StructuredExecutiveSummary;
  recommendation: DashboardResponse['heroAgents']['recommendation'];
  cropPlan: DashboardResponse['heroAgents']['cropPlan'];
  disease: DashboardResponse['heroAgents']['disease'];
  nutrient: DashboardResponse['heroAgents']['nutrient'];
  spatial: DashboardResponse['heroAgents']['spatialTwin'];
  fieldBoundary: DashboardResponse['heroAgents']['fieldBoundary'];
  drone: DashboardResponse['drone'];
  alerts: DashboardResponse['alerts'];
  actionPlan: ActionPlanItem[];
  disclaimer: string;
  appendix: TechnicalAppendix;
}

// ── Helpers ───────────────────────────────────────────────────

function generateReportId(farmerId: number): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `RPT-${year}${month}${day}-F${farmerId}`;
}

function buildDeterministicActionPlan(dash: DashboardResponse): ActionPlanItem[] {
  const items: ActionPlanItem[] = [];

  // 1. Disease action
  if (dash.heroAgents.disease.available && dash.heroAgents.disease.summary) {
    const d = dash.heroAgents.disease.summary;
    items.push({
      id: 'act-disease',
      task: `Apply treatment for ${d.diagnosis || 'Plant Disease'}: ${d.treatment || 'Recommended fungicide/pesticide'}`,
      category: 'Plant Protection',
      priority: d.severity === 'High' ? 'High' : 'Medium',
      sourceAgent: 'Disease Detection Agent',
      status: 'Pending',
    });
  }

  // 2. Nutrient action
  if (dash.heroAgents.nutrient.available && dash.heroAgents.nutrient.summary) {
    const n = dash.heroAgents.nutrient.summary;
    items.push({
      id: 'act-nutrient',
      task: `Address ${n.risk_level || 'Nutrient'} deficiency: ${n.suggested_action || 'Apply nitrogen booster'}`,
      category: 'Soil & Nutrient',
      priority: n.risk_level === 'High' ? 'High' : 'Medium',
      sourceAgent: 'Nutrient Risk Agent',
      status: 'Pending',
    });
  }

  // 3. Drone mission action
  if (dash.drone.missionCount > 0) {
    items.push({
      id: 'act-drone',
      task: `Execute ${dash.drone.missionCount} planned autonomous drone survey flights (${dash.drone.estimatedDurationMin} min total flight time)`,
      category: 'Drone Mission',
      priority: 'Medium',
      sourceAgent: 'Drone Flight Generator',
      status: 'Pending',
    });
  }

  // 4. Crop plan action
  if (dash.heroAgents.cropPlan.available && dash.heroAgents.cropPlan.summary) {
    const p = dash.heroAgents.cropPlan.summary;
    items.push({
      id: 'act-plan',
      task: `Follow active sowing & irrigation schedule for ${p.crop_name}`,
      category: 'Crop Care',
      priority: 'Low',
      sourceAgent: 'Crop Planning Agent',
      status: 'Completed',
    });
  }

  // 5. Field Boundary action
  if (!dash.heroAgents.fieldBoundary.available) {
    items.push({
      id: 'act-boundary',
      task: 'Trace field polygon on Satellite Map to calibrate spatial twin clipping',
      category: 'Field Geometry',
      priority: 'Low',
      sourceAgent: 'Satellite Geometry Agent',
      status: 'Pending',
    });
  }

  return items;
}

// ── Gemini Executive Summary (with timeout & agronomic fallback) ──

async function generateStructuredExecutiveSummary(
  dash: DashboardResponse,
  confidence: ReportConfidence
): Promise<StructuredExecutiveSummary> {
  const defaultSummary: StructuredExecutiveSummary = {
    status: dash.metrics.farmHealthScore >= 80 ? 'Stable — Optimal Vitals' : dash.metrics.farmHealthScore >= 50 ? 'Moderate Risk — Action Advised' : 'High Priority — Immediate Action Required',
    currentSituation: `Farm in ${dash.overview.village} (${dash.overview.landSize} acres) is operational under AgroSentry AI monitoring. ${
      dash.heroAgents.spatialTwin.available
        ? `Primary crop ${dash.heroAgents.spatialTwin.summary?.main_crop} intercropped with ${dash.heroAgents.spatialTwin.summary?.companion_crop}.`
        : 'No spatial twin plan initialized yet.'
    }`,
    topRisks: dash.alerts.length ? dash.alerts.map(a => a.title) : ['Routine soil moisture and nutrient monitoring recommended.'],
    recommendedPriority: dash.alerts.length ? dash.alerts[0].message : 'Maintain current drip irrigation schedule and regular crop scouting.',
    confidence,
  };

  try {
    const model = getJsonModel(
      `You are the Senior Farm Advisory Summarizer for AgroSentry. Synthesize farm data into a scannable executive summary. Respond strictly in valid JSON.`
    );
    const userPrompt = `Farmer: ${dash.overview.name} (${dash.overview.village}, ${dash.overview.landSize} acres)
Farm Health Score: ${dash.metrics.farmHealthScore}/100
Data Completeness: ${confidence.dataCompletenessPct}%
Active Plan: ${dash.heroAgents.cropPlan.available ? dash.heroAgents.cropPlan.summary?.crop_name : 'None'}
Disease Status: ${dash.heroAgents.disease.available ? dash.heroAgents.disease.summary?.diagnosis : 'None'}
Nutrient Risk: ${dash.heroAgents.nutrient.available ? dash.heroAgents.nutrient.summary?.risk_level : 'Normal'}
Spatial Layout: ${dash.heroAgents.spatialTwin.available ? `${dash.heroAgents.spatialTwin.summary?.main_crop} + ${dash.heroAgents.spatialTwin.summary?.companion_crop}` : 'None'}
Alerts (${dash.alerts.length}): ${dash.alerts.map(a => a.title).join('; ')}

Return ONLY JSON:
{
  "status": "1-sentence status badge title (e.g. Stable — Low Risk)",
  "currentSituation": "2-sentence overview of current field & crop situation",
  "topRisks": ["Risk 1", "Risk 2"],
  "recommendedPriority": "Single top priority recommendation for the farmer"
}`;

    const aiRes = await withTimeout(model.generateContent(userPrompt), 5000);
    const parsed = JSON.parse(aiRes.response.text());
    return {
      status: parsed.status || defaultSummary.status,
      currentSituation: parsed.currentSituation || defaultSummary.currentSituation,
      topRisks: Array.isArray(parsed.topRisks) && parsed.topRisks.length ? parsed.topRisks : defaultSummary.topRisks,
      recommendedPriority: parsed.recommendedPriority || defaultSummary.recommendedPriority,
      confidence,
    };
  } catch (err) {
    console.warn('[ReportAgent] Gemini executive summary fallback used:', err);
    return defaultSummary;
  }
}

// ── Main Agent Function ───────────────────────────────────────

export async function runReportAgent(
  ctx: AgentContext
): Promise<AgentResult<ReportResponse>> {
  const startTime = Date.now();
  const trace: string[] = ['Step 1: Commencing Report Agent execution...'];
  const farmerId = ctx.farmerId || 5;

  try {
    // 1. Consume Dashboard Agent as Single Source of Truth
    trace.push('Step 2: Consuming Dashboard Agent data...');
    const dashResult = await runDashboardAgent(ctx);

    if (!dashResult.success || !dashResult.data) {
      throw new Error(dashResult.error || 'Failed to retrieve underlying dashboard data');
    }

    const dash = dashResult.data;

    // 2. Measure Execution & Compute Statistics dynamically
    const generatedInMs = Date.now() - startTime;
    const heroList = [
      dash.heroAgents.recommendation,
      dash.heroAgents.cropPlan,
      dash.heroAgents.disease,
      dash.heroAgents.nutrient,
      dash.heroAgents.spatialTwin,
      dash.heroAgents.fieldBoundary,
    ];

    const heroAgentsCompleted = heroList.filter((h) => h.available).length;
    const pendingAnalyses = heroList.filter((h) => !h.available).length;
    const alertsCount = dash.alerts.length;

    const statistics: ReportStatistics = {
      heroAgentsCompleted,
      alertsCount,
      pendingAnalyses,
      generatedInMs,
    };

    // 3. Compute Explicit Confidence
    const dataCompletenessPct = Math.round((heroAgentsCompleted / 6) * 100);
    const agronomicConfidencePct = Math.min(100, Math.round(dataCompletenessPct * 0.7 + (dash.metrics.farmHealthScore * 0.3)));

    const confidence: ReportConfidence = {
      dataCompletenessPct,
      agronomicConfidencePct,
      description: `Data Completeness (${dataCompletenessPct}%) represents available agent analyses. Agronomic Confidence (${agronomicConfidencePct}%) measures advisory reliability based on data coverage.`,
    };

    // 4. Generate Metadata & Appendix
    const nowIso = new Date().toISOString();
    const metadata: ReportMetadata = {
      reportId: generateReportId(farmerId),
      status: 'Final',
      reportVersion: '1.0',
      schemaVersion: '1.0',
      generatedAt: nowIso,
    };

    const appendix: TechnicalAppendix = {
      dashboardVersion: '1.0',
      reportVersion: '1.0',
      farmerId,
      recommendationId: (dash.heroAgents.recommendation.summary?.id as number) || null,
      planId: (dash.heroAgents.cropPlan.summary?.plan_id as number) || null,
      diseaseId: (dash.heroAgents.disease.summary?.detection_id as number) || null,
      nutrientId: (dash.heroAgents.nutrient.summary?.id as number) || null,
      spatialId: (dash.heroAgents.spatialTwin.summary?.id as number) || null,
      boundaryId: (dash.heroAgents.fieldBoundary.summary?.id as number) || null,
      missionCount: dash.drone.missionCount,
      generatedAt: nowIso,
    };

    // 5. Build Action Plan & Executive Summary
    trace.push('Step 3: Building deterministic action plan checklist...');
    const actionPlan = buildDeterministicActionPlan(dash);

    trace.push('Step 4: Generating structured executive summary...');
    const executiveSummary = await generateStructuredExecutiveSummary(dash, confidence);

    const disclaimer =
      'This advisory is generated from the latest available farm analyses. It is intended to support decision-making and should be considered alongside local agronomic conditions and farmer judgment.';

    trace.push('Step 5 ✓: Report payload successfully assembled.');

    return {
      success: true,
      data: {
        metadata,
        statistics,
        confidence,
        overview: dash.overview,
        executiveSummary,
        recommendation: dash.heroAgents.recommendation,
        cropPlan: dash.heroAgents.cropPlan,
        disease: dash.heroAgents.disease,
        nutrient: dash.heroAgents.nutrient,
        spatial: dash.heroAgents.spatialTwin,
        fieldBoundary: dash.heroAgents.fieldBoundary,
        drone: dash.drone,
        alerts: dash.alerts,
        actionPlan,
        disclaimer,
        appendix,
      },
      trace,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Report Agent failed';
    trace.push(`Step X ❌: ${msg}`);
    return { success: false, error: msg, trace };
  }
}

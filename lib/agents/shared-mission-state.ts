// lib/agents/shared-mission-state.ts

export type MissionStage = "Planner" | "Scout" | "Disease" | "Spray" | "Verification" | "Replay" | "SDG";

export interface Observation {
  id: string; // e.g. "OBS-01"
  cellId: number;
  location: string; // e.g. "Sector B-North (Row 1, Col 2)"
  confidence: number; // percentage (e.g. 91)
  anomalyScore: number; // float (e.g. 0.82)
  priority: "High" | "Medium" | "Low";
  thumbnail: string;
  status: "Pending Diagnosis" | "Diagnosed" | "Sprayed" | "Resolved";
  detectedDisease?: string;
  recommendedTreatment?: string;
  timestamp: string;
}

export interface AgentHandoverState {
  fromAgent: string; // e.g. "Planner Agent"
  toAgent: string; // e.g. "Scout Agent"
  status: "Approved" | "Handing" | "Receiving" | "Accepted";
  checkList: { label: string; done: boolean }[];
  message: string;
}

export interface SdgLiveEvent {
  id: string;
  triggerPct: number;
  metricLabel: string;
  metricValue: string;
  sdgCode: number;
  sdgTitle: string;
  description: string;
  timestamp: string;
}

export interface GridCell {
  id: number;
  row: number;
  col: number;
  scanned: boolean;
  status: "healthy" | "low_risk" | "infected" | "sprayed" | "recovered";
  diseaseName?: string;
  confidence?: number;
  leafImageUrl?: string;
}

export interface DiseaseFinding {
  id: string; // e.g. "FINDING-01"
  obsId: string; // e.g. "OBS-01"
  diseaseName: string; // e.g. "Leaf Rust (Puccinia)"
  confidencePct: number; // e.g. 96
  severity: "Low" | "Medium" | "High" | "Critical";
  affectedAreaPct: number; // e.g. 12.3
  cropStress: "Low" | "Moderate" | "Severe";
  location: string;
  originalImage: string;
  aiOverlayImage: string;
  highlightedRegionUrl: string;
  treatmentType: "Spot Spray" | "Foliar Spray" | "Soil Drench" | "No Action";
  recommendedChemical: string;
  recommendedDose: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending Spray" | "Sprayed" | "Resolved";
  timestamp: string;
}

export interface HeatmapZone {
  zoneId: string;
  name: string;
  riskLevel: "Healthy" | "Low Risk" | "Medium Risk" | "High Risk" | "Critical";
  riskScore: number;
  areaAcres: number;
}

export interface DiseaseSeverityMetrics {
  overallSeverity: "Low" | "Medium" | "High" | "Critical";
  totalAffectedAreaPct: number;
  cropStressLevel: "Low" | "Moderate" | "Severe";
  totalHotspots: number;
}

export interface TreatmentRecommendation {
  findingId: string;
  treatmentType: string;
  priority: "High" | "Medium" | "Low";
  recommendedChemical: string;
  recommendedDose: string;
  targetAcres: number;
  targetCells: number[];
}

export interface EngineeringReports {
  diseaseAnalysisReport: string;
  severityReport: string;
  confidenceReport: string;
  recommendationReport: string;
  sustainabilityReport: string;
}

export interface DiseaseSustainability {
  primarySdg: { code: 2; title: string; description: string };
  supportingSdg: { code: 15; title: string; description: string };
  areaAnalyzedAcres: number;
  diseaseHotspotsDetected: number;
  estimatedCropProtectedPct: number;
  estimatedChemicalReductionPct: number;
}

export interface IntelligenceConfidenceMetrics {
  diseaseConfidence: number; // e.g. 96
  imageQuality: number; // e.g. 98
  predictionStability: number; // e.g. 95
  observationConsistency: number; // e.g. 97
  checkmarks: { label: string; done: boolean }[];
}

export type DiseaseAgentState =
  | "IDLE"
  | "INITIALIZING"
  | "LOADING_OBSERVATIONS"
  | "PREPROCESSING_IMAGES"
  | "CLASSIFYING_DISEASE"
  | "ASSESSING_SEVERITY"
  | "GENERATING_RECOMMENDATIONS"
  | "GENERATING_REPORTS"
  | "COMPLETED";

export interface DiseaseNamespace {
  status: DiseaseAgentState;
  findings: DiseaseFinding[];
  heatmap: HeatmapZone[];
  severity: DiseaseSeverityMetrics;
  recommendations: TreatmentRecommendation[];
  reports: EngineeringReports;
  sustainability: DiseaseSustainability;
  confidence: IntelligenceConfidenceMetrics;
}

export interface SprayQueueItem {
  id: string; // e.g. "SPRAY-01"
  findingId: string; // e.g. "FINDING-01"
  targetCellId: number;
  location: string;
  chemicalName: string;
  dosage: string;
  flowRateLmin: number;
  sprayDurationSec: number;
  priority: "High" | "Medium" | "Low";
  status: "Queued" | "Navigating" | "Spraying" | "Verified" | "Completed";
  coordinates: { x: number; y: number };
}

export interface AppliedZone {
  zoneId: string;
  cellId: number;
  location: string;
  appliedChemical: string;
  volumeAppliedL: number;
  timestamp: string;
  status: "Applied" | "Verified";
}

export interface SprayLogEntry {
  id: string;
  timestamp: string;
  targetId: string;
  nozzleState: "ON" | "OFF";
  flowRateLmin: number;
  tankRemainingPct: number;
  message: string;
}

export interface SprayResourceUsage {
  totalTankCapacityL: number;
  initialChemicalL: number;
  usedChemicalL: number;
  remainingChemicalL: number;
  tankLevelPct: number;
  waterConsumedL: number;
  waterSavedL: number;
  chemicalSavedPct: number;
  distanceSavedMeters: number;
  batteryImpactPct: number;
}

export interface SprayEngineeringReports {
  chemicalUsageReport: string;
  waterUsageReport: string;
  tankReport: string;
  executionReport: string;
  sustainabilityReport: string;
}

export interface SpraySustainability {
  primarySdg: { code: 6; title: string; description: string };
  supportingSdg: { code: 12; title: string; description: string };
  chemicalUsedL: number;
  chemicalSavedL: number;
  waterConsumedL: number;
  waterConservedL: number;
  fieldSpotTreatedPct: number;
  blanketSprayReductionPct: number;
}

export interface SprayConfidenceMetrics {
  targetAlignmentPct: number; // e.g. 98%
  sprayAccuracyPct: number; // e.g. 96%
  coverageConfidencePct: number; // e.g. 97%
  executionQualityPct: number; // e.g. 99%
  checkmarks: { label: string; done: boolean }[];
}

export type SprayAgentState =
  | "IDLE"
  | "INITIALIZING"
  | "LOADING_TREATMENT_PLAN"
  | "NAVIGATING_TO_TARGET"
  | "SPRAYING_TARGET"
  | "VERIFYING_APPLICATION"
  | "MOVING_TO_NEXT_TARGET"
  | "GENERATING_REPORT"
  | "COMPLETED";

export interface SprayNamespace {
  status: SprayAgentState;
  treatmentQueue: SprayQueueItem[];
  appliedZones: AppliedZone[];
  sprayLog: SprayLogEntry[];
  resourceUsage: SprayResourceUsage;
  reports: SprayEngineeringReports;
  sustainability: SpraySustainability;
  confidence: SprayConfidenceMetrics;
  activeTargetId: string | null;
  nozzleState: "ON" | "OFF";
  currentFlowRateLmin: number;
}

export interface VerifiedZone {
  zoneId: string;
  cellId: number;
  location: string;
  targetChemical: string;
  treatmentStatus: "Verified" | "Missed" | "Requires Review";
  recoveryRatePct: number;
  beforeInfectionPct: number;
  afterInfectionPct: number;
  beforeImageUrl: string;
  afterImageUrl: string;
  timestamp: string;
}

export interface VerificationAudit {
  totalPlannedTargets: number;
  verifiedTargets: number;
  missedTargets: number;
  offTargetApplications: number;
  targetCoveragePct: number;
  recoveryRatePct: number;
  overallComplianceScorePct: number;
}

export interface VerificationEngineeringReports {
  verificationReport: string;
  auditReport: string;
  complianceReport: string;
  recoveryAssessmentReport: string;
  sustainabilityReport: string;
}

export interface VerificationSustainability {
  primarySdg: { code: 15; title: string; description: string };
  supportingSdg: { code: 6; title: string; description: string };
  verifiedTreatedAreaAcres: number;
  treatmentSuccessRatePct: number;
  confirmedChemicalSavedL: number;
  confirmedWaterConservedL: number;
  verifiedTargetsPct: number;
}

export interface VerificationConfidenceMetrics {
  verificationConfidencePct: number; // e.g. 98%
  imageQualityPct: number; // e.g. 99%
  coverageCompletenessPct: number; // e.g. 100%
  auditCompletenessPct: number; // e.g. 100%
  checkmarks: { label: string; done: boolean }[];
}

export type VerificationAgentState =
  | "IDLE"
  | "INITIALIZING"
  | "LOADING_VERIFICATION_DATA"
  | "VALIDATING_APPLICATION"
  | "ASSESSING_EFFECTIVENESS"
  | "GENERATING_AUDIT"
  | "GENERATING_REPORTS"
  | "COMPLETED";

export interface VerificationNamespace {
  status: VerificationAgentState;
  verifiedZones: VerifiedZone[];
  auditResults: VerificationAudit;
  compliance: {
    passedChecks: string[];
    traceabilityLog: { timestamp: string; check: string; status: "PASSED" | "FAILED" }[];
  };
  reports: VerificationEngineeringReports;
  sustainability: VerificationSustainability;
  confidence: VerificationConfidenceMetrics;
}

export interface ReplayTimelineEvent {
  id: string;
  timeOffsetSec: number;
  timestampStr: string;
  agent: "Planner" | "Scout" | "Disease" | "Spray" | "Verification" | "SDG";
  title: string;
  description: string;
  eventType: "MILESTONE" | "HANDOVER" | "OBSERVATION" | "DIAGNOSIS" | "SPRAY" | "VERIFICATION";
  telemetry: {
    lat: number;
    lng: number;
    altitudeM: number;
    speedKmh: number;
    headingDeg: number;
    batteryPct: number;
  };
  mediaUrl?: string;
  decisionTrace?: {
    from: string;
    to: string;
    reasoning: string;
  };
}

export interface ReplayMediaFrame {
  id: string;
  timeOffsetSec: number;
  type: "RGB" | "NIR" | "YOLO_OVERLAY" | "VERIFICATION_DELTA";
  imageUrl: string;
  caption: string;
}

export interface ReplayAgentPerformance {
  agent: string;
  executionTimeSec: number;
  status: "PASSED" | "COMPLETED";
  outputSummary: string;
}

export interface ReplayAnalyticsData {
  totalMissionDurationSec: number;
  agentExecutionTimes: ReplayAgentPerformance[];
  coverageTimeline: { timeOffsetSec: number; coveragePct: number }[];
  resourceConsumptionTimeline: { timeOffsetSec: number; batteryPct: number; chemicalUsedL: number }[];
}

export interface ReplayAuditRecord {
  immutableMissionHash: string;
  verificationAuditPassed: boolean;
  totalEventsLogged: number;
  decisionTraceabilityScorePct: number;
  auditSignature: string;
}

export type ReplayEngineState =
  | "IDLE"
  | "LOADING_MISSION"
  | "AGGREGATING_EVENTS"
  | "SYNCHRONIZING_MEDIA"
  | "BUILDING_TIMELINE"
  | "GENERATING_ANALYTICS"
  | "READY";

export interface ReplayNamespace {
  status: ReplayEngineState;
  timeline: ReplayTimelineEvent[];
  events: ReplayTimelineEvent[];
  media: ReplayMediaFrame[];
  analytics: ReplayAnalyticsData;
  audit: ReplayAuditRecord;
  currentTimeOffsetSec: number;
  isPlaying: boolean;
  playbackSpeed: number; // 1x, 2x, 5x
  handover?: AgentHandoverState | null;
}

export interface MissionScoreBreakdown {
  overallScore: number; // e.g. 98
  planningScore: number; // e.g. 100
  executionScore: number; // e.g. 98
  verificationScore: number; // e.g. 99
  sustainabilityScore: number; // e.g. 97
}

export interface SdgGoalContribution {
  code: number;
  badge: string;
  title: string;
  metrics: { label: string; value: string }[];
  description: string;
}

export interface ExecutiveSummaryReport {
  missionOverview: string;
  operationalPerformance: string;
  sustainabilityOutcomes: string;
  strategicRecommendations: string[];
}

export type SdgImpactState =
  | "IDLE"
  | "AGGREGATING_METRICS"
  | "COMPUTING_KPIS"
  | "ANALYZING_SUSTAINABILITY"
  | "GENERATING_EXECUTIVE_REPORT"
  | "COMPUTING_MISSION_SCORE"
  | "MISSION_COMPLETE";

export interface SdgImpactNamespace {
  status: SdgImpactState;
  missionScore: MissionScoreBreakdown;
  sdgContributions: SdgGoalContribution[];
  kpiDashboard: {
    totalDurationStr: string;
    coveragePct: number;
    targetSuccessRatePct: number;
    targetsTreated: string;
    verificationScorePct: number;
    chemicalSavingsPct: number;
    waterSavedL: number;
  };
  sustainabilityReport: {
    totalChemicalSavedL: number;
    totalWaterConservedL: number;
    estimatedEnergySavedPct: number;
    unnecessarySprayingReductionPct: number;
    resourceEfficiencyPct: number;
  };
  executiveSummary: ExecutiveSummaryReport;
  handover?: AgentHandoverState | null;
}

export interface MissionState {
  missionId: string;
  stage: MissionStage;
  targetField: string;
  totalAcres: number;
  coveragePct: number;
  activeDroneWp: number;
  cells: GridCell[];
  observations: Observation[];
  handover: AgentHandoverState | null;
  sdgLiveEvents: SdgLiveEvent[];
  disease: DiseaseNamespace;
  spray: SprayNamespace;
  verification: VerificationNamespace;
  replay: ReplayNamespace;
  sdg: SdgImpactNamespace;
  zoneRisk: {
    zoneA: number; // e.g. 2%
    zoneB: number; // e.g. 67%
    zoneC: number; // e.g. 4%
  };
  detectedDisease?: {
    name: string;
    confidence: number;
    affectedAreaPct: number;
    severity: "Low" | "Medium" | "High";
    recommendation: string;
  };
  sprayStats: {
    chemicalSavedPct: number;
    waterSavedL: number;
    timeSavedPct: number;
    costSavedInr: number;
  };
  sdgMetrics: {
    chemicalSavedPct: number;
    waterSavedPct: number;
    co2AvoidedKg: number;
    labourSavedHrs: number;
    sdgBadges: number[];
  };
}

export function createInitialMissionState(): MissionState {
  const initialCells: GridCell[] = [];
  let idCounter = 1;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      const isInfected = (r === 1 && (c === 2 || c === 3)) || (r === 2 && c === 2);
      initialCells.push({
        id: idCounter++,
        row: r,
        col: c,
        scanned: false,
        status: isInfected ? "infected" : "healthy",
        diseaseName: isInfected ? "Leaf Rust (Puccinia)" : undefined,
        confidence: isInfected ? 96 : undefined,
        leafImageUrl: isInfected
          ? "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=400"
          : undefined,
      });
    }
  }

  const initialObservations: Observation[] = [
    {
      id: "OBS-01",
      cellId: 9,
      location: "Sector B-North (Row 1, Col 2)",
      confidence: 91,
      anomalyScore: 0.82,
      priority: "High",
      thumbnail: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=300",
      status: "Pending Diagnosis",
      timestamp: "09:42:15 AM",
    },
    {
      id: "OBS-02",
      cellId: 10,
      location: "Sector B-Center (Row 1, Col 3)",
      confidence: 88,
      anomalyScore: 0.74,
      priority: "High",
      thumbnail: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300",
      status: "Pending Diagnosis",
      timestamp: "09:43:02 AM",
    },
    {
      id: "OBS-03",
      cellId: 15,
      location: "Sector B-East (Row 2, Col 2)",
      confidence: 79,
      anomalyScore: 0.61,
      priority: "Medium",
      thumbnail: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=300",
      status: "Pending Diagnosis",
      timestamp: "09:44:18 AM",
    },
  ];

  const initialSdgEvents: SdgLiveEvent[] = [
    {
      id: "SDG-EV-1",
      triggerPct: 0,
      metricLabel: "Mission Start",
      metricValue: "Autonomous Boundary Lock",
      sdgCode: 2,
      sdgTitle: "Zero Hunger",
      description: "AI path initialized to inspect crop canopy without soil compaction.",
      timestamp: "09:40:00 AM",
    },
  ];

  const initialDiseaseNamespace: DiseaseNamespace = {
    status: "COMPLETED",
    findings: [
      {
        id: "FINDING-01",
        obsId: "OBS-01",
        diseaseName: "Leaf Rust (Puccinia)",
        confidencePct: 96,
        severity: "High",
        affectedAreaPct: 12.3,
        cropStress: "Moderate",
        location: "Sector B-North (Row 1, Col 2)",
        originalImage: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=500",
        aiOverlayImage: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=500",
        highlightedRegionUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=500",
        treatmentType: "Spot Spray",
        recommendedChemical: "Copper Oxychloride 50% WP",
        recommendedDose: "2.5 g/L water (0.3 acres targeted spot spray)",
        priority: "High",
        status: "Pending Spray",
        timestamp: "09:44:30 AM",
      },
      {
        id: "FINDING-02",
        obsId: "OBS-02",
        diseaseName: "Yellow Canopy Blight",
        confidencePct: 88,
        severity: "Medium",
        affectedAreaPct: 4.5,
        cropStress: "Moderate",
        location: "Sector B-Center (Row 1, Col 3)",
        originalImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500",
        aiOverlayImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500",
        highlightedRegionUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500",
        treatmentType: "Spot Spray",
        recommendedChemical: "Mancozeb 75% WP",
        recommendedDose: "2.0 g/L water (0.1 acres targeted spot spray)",
        priority: "Medium",
        status: "Pending Spray",
        timestamp: "09:44:45 AM",
      },
    ],
    heatmap: [
      { zoneId: "ZONE-A", name: "Sector A (North-West)", riskLevel: "Healthy", riskScore: 12, areaAcres: 1.8 },
      { zoneId: "ZONE-B", name: "Sector B (Cotton Central)", riskLevel: "High Risk", riskScore: 84, areaAcres: 2.1 },
      { zoneId: "ZONE-C", name: "Sector C (East Margin)", riskLevel: "Low Risk", riskScore: 24, areaAcres: 1.6 },
    ],
    severity: {
      overallSeverity: "High",
      totalAffectedAreaPct: 12.3,
      cropStressLevel: "Moderate",
      totalHotspots: 2,
    },
    recommendations: [
      {
        findingId: "FINDING-01",
        treatmentType: "Spot Spray",
        priority: "High",
        recommendedChemical: "Copper Oxychloride 50% WP",
        recommendedDose: "2.5 g/L water",
        targetAcres: 0.3,
        targetCells: [9, 10],
      },
    ],
    reports: {
      diseaseAnalysisReport: "Observation Intake Engine loaded 3 observations. Feature extraction identified Puccinia fungal spores in Sector B with 96% model confidence.",
      severityReport: "Severity Assessment Engine determined 12.3% affected area across 0.3 acres. Moderate crop stress registered.",
      confidenceReport: "Intelligence Confidence Engine score: 96%. High quality imagery (98%), prediction stability (95%), observation consistency (97%).",
      recommendationReport: "Treatment Recommendation Engine formulated 5% micro-dosage targeted spot spray of Copper Oxychloride 50% WP.",
      sustainabilityReport: "Early detection prevents full-field blanketing spray, conserving 95% chemical volume and protecting 5.2 acres of beneficial soil microbiome.",
    },
    sustainability: {
      primarySdg: {
        code: 2,
        title: "SDG 2 – Zero Hunger",
        description: "Early disease detection supports healthier crops and improves yield potential.",
      },
      supportingSdg: {
        code: 15,
        title: "SDG 15 – Life on Land",
        description: "Targeted treatment helps reduce unnecessary environmental impact on agricultural ecosystems.",
      },
      areaAnalyzedAcres: 5.5,
      diseaseHotspotsDetected: 2,
      estimatedCropProtectedPct: 95.2,
      estimatedChemicalReductionPct: 95,
    },
    confidence: {
      diseaseConfidence: 96,
      imageQuality: 98,
      predictionStability: 95,
      observationConsistency: 97,
      checkmarks: [
        { label: "High Quality Images", done: true },
        { label: "Consistent Predictions", done: true },
        { label: "Clear Symptoms", done: true },
        { label: "High Model Confidence", done: true },
      ],
    },
  };

  const initialSprayNamespace: SprayNamespace = {
    status: "COMPLETED",
    treatmentQueue: [
      {
        id: "SPRAY-01",
        findingId: "FINDING-01",
        targetCellId: 9,
        location: "Sector B-North (Row 1, Col 2)",
        chemicalName: "Copper Oxychloride 50% WP",
        dosage: "2.5 g/L (0.3 acres spot dosage)",
        flowRateLmin: 1.2,
        sprayDurationSec: 8,
        priority: "High",
        status: "Completed",
        coordinates: { x: 2, y: 1 },
      },
      {
        id: "SPRAY-02",
        findingId: "FINDING-02",
        targetCellId: 10,
        location: "Sector B-Center (Row 1, Col 3)",
        chemicalName: "Mancozeb 75% WP",
        dosage: "2.0 g/L (0.1 acres spot dosage)",
        flowRateLmin: 1.0,
        sprayDurationSec: 5,
        priority: "Medium",
        status: "Completed",
        coordinates: { x: 3, y: 1 },
      },
    ],
    appliedZones: [
      {
        zoneId: "ZONE-B-SPOT-1",
        cellId: 9,
        location: "Sector B-North (Row 1, Col 2)",
        appliedChemical: "Copper Oxychloride 50% WP",
        volumeAppliedL: 0.65,
        timestamp: "09:48:12 AM",
        status: "Applied",
      },
      {
        zoneId: "ZONE-B-SPOT-2",
        cellId: 10,
        location: "Sector B-Center (Row 1, Col 3)",
        appliedChemical: "Mancozeb 75% WP",
        volumeAppliedL: 0.35,
        timestamp: "09:48:40 AM",
        status: "Applied",
      },
    ],
    sprayLog: [
      {
        id: "LOG-01",
        timestamp: "09:47:30 AM",
        targetId: "SPRAY-01",
        nozzleState: "ON",
        flowRateLmin: 1.2,
        tankRemainingPct: 92,
        message: "Nozzle #1 & #2 activated over Target SPRAY-01 (Blue mist engaged).",
      },
      {
        id: "LOG-02",
        timestamp: "09:48:10 AM",
        targetId: "SPRAY-01",
        nozzleState: "OFF",
        flowRateLmin: 0.0,
        tankRemainingPct: 88,
        message: "Target SPRAY-01 micro-dosage complete (0.65L applied). Nozzles disengaged.",
      },
    ],
    resourceUsage: {
      totalTankCapacityL: 10.0,
      initialChemicalL: 10.0,
      usedChemicalL: 1.0,
      remainingChemicalL: 9.0,
      tankLevelPct: 90,
      waterConsumedL: 15,
      waterSavedL: 420,
      chemicalSavedPct: 95,
      distanceSavedMeters: 480,
      batteryImpactPct: 4,
    },
    reports: {
      chemicalUsageReport: "1.0L total chemical applied across 0.3 acres spot target versus 12.5L required for full blanket spraying.",
      waterUsageReport: "15L water consumed via ultra-low-volume micro-nozzles, conserving 420L of agricultural water.",
      tankReport: "Tank level remaining at 90% (9.0L chemical solution available for reserve missions).",
      executionReport: "Spot spray sequencing completed with 100% nozzle pulse timing accuracy over target cells #9 and #10.",
      sustainabilityReport: "Achieved 95% chemical reduction and zero off-target chemical drift in accordance with SDG 6 & SDG 12.",
    },
    sustainability: {
      primarySdg: {
        code: 6,
        title: "💧 SDG 6 – Clean Water & Sanitation",
        description: "Targeted spraying reduces unnecessary chemical contamination & water usage.",
      },
      supportingSdg: {
        code: 12,
        title: "♻️ SDG 12 – Responsible Consumption",
        description: "Precision application minimizes chemical waste and optimizes resource usage.",
      },
      chemicalUsedL: 1.0,
      chemicalSavedL: 11.5,
      waterConsumedL: 15,
      waterConservedL: 420,
      fieldSpotTreatedPct: 5.5,
      blanketSprayReductionPct: 95,
    },
    confidence: {
      targetAlignmentPct: 98,
      sprayAccuracyPct: 96,
      coverageConfidencePct: 97,
      executionQualityPct: 99,
      checkmarks: [
        { label: "Target Alignment Verified", done: true },
        { label: "Nozzle Pulse Timing Calibrated", done: true },
        { label: "Zero Off-Target Drift", done: true },
        { label: "Micro-Dosage Confirmed", done: true },
      ],
    },
    activeTargetId: "SPRAY-01",
    nozzleState: "OFF",
    currentFlowRateLmin: 0.0,
  };

  const initialVerificationNamespace: VerificationNamespace = {
    status: "COMPLETED",
    verifiedZones: [
      {
        zoneId: "VERIFY-01",
        cellId: 9,
        location: "Sector B-North (Row 1, Col 2)",
        targetChemical: "Copper Oxychloride 50% WP",
        treatmentStatus: "Verified",
        recoveryRatePct: 87,
        beforeInfectionPct: 12.3,
        afterInfectionPct: 1.6,
        beforeImageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=500",
        afterImageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=500",
        timestamp: "09:52:10 AM",
      },
      {
        zoneId: "VERIFY-02",
        cellId: 10,
        location: "Sector B-Center (Row 1, Col 3)",
        targetChemical: "Mancozeb 75% WP",
        treatmentStatus: "Verified",
        recoveryRatePct: 91,
        beforeInfectionPct: 4.5,
        afterInfectionPct: 0.4,
        beforeImageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500",
        afterImageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500",
        timestamp: "09:52:35 AM",
      },
    ],
    auditResults: {
      totalPlannedTargets: 2,
      verifiedTargets: 2,
      missedTargets: 0,
      offTargetApplications: 0,
      targetCoveragePct: 100,
      recoveryRatePct: 87,
      overallComplianceScorePct: 99.4,
    },
    compliance: {
      passedChecks: [
        "All planned targets received micro-dosage spray.",
        "Zero off-target chemical drift detected.",
        "NDVI vegetation recovery index exceeds baseline threshold (+87%).",
        "Solenoid valve activation log matches GPS waypoints 100%.",
      ],
      traceabilityLog: [
        { timestamp: "09:51:00 AM", check: "GPS Target Coords vs Nozzle Trigger Log", status: "PASSED" },
        { timestamp: "09:51:30 AM", check: "Post-Treatment NDVI Spectral Index", status: "PASSED" },
        { timestamp: "09:52:00 AM", check: "Environmental Boundary Runoff Audit", status: "PASSED" },
      ],
    },
    reports: {
      verificationReport: "Verification Sentinel inspected all 2 targeted micro-zones. 100% of planned targets successfully treated with 0 missed targets.",
      auditReport: "Compliance score 99.4%. Solenoid pulse execution log perfectly matched RTK GPS waypoint coordinates.",
      complianceReport: "Full compliance with organic eco-safety guidelines and zero off-target chemical drift registered.",
      recoveryAssessmentReport: "Canopy health recovery rate verified at 87% with infection density reduced from 12.3% down to 1.6%.",
      sustainabilityReport: "Confirmed chemical savings of 11.5L (95%) and water conservation of 420L (SDG 15 & SDG 6 verified).",
    },
    sustainability: {
      primarySdg: {
        code: 15,
        title: "🌍 SDG 15 – Life on Land",
        description: "Verification confirms interventions were targeted & minimizes unintended environmental impact.",
      },
      supportingSdg: {
        code: 6,
        title: "💧 SDG 6 – Clean Water & Sanitation",
        description: "Confirms efficient use of chemicals & water through successful precision application.",
      },
      verifiedTreatedAreaAcres: 0.3,
      treatmentSuccessRatePct: 100,
      confirmedChemicalSavedL: 11.5,
      confirmedWaterConservedL: 420,
      verifiedTargetsPct: 100,
    },
    confidence: {
      verificationConfidencePct: 98,
      imageQualityPct: 99,
      coverageCompletenessPct: 100,
      auditCompletenessPct: 100,
      checkmarks: [
        { label: "100% Target Coverage Verified", done: true },
        { label: "Zero Missed Targets Confirmed", done: true },
        { label: "Post-Treatment Recovery Validated", done: true },
        { label: "Audit Traceability Log Passed", done: true },
      ],
    },
  };

  const initialReplayNamespace: ReplayNamespace = {
    status: "READY",
    timeline: [
      {
        id: "EVENT-01",
        timeOffsetSec: 0,
        timestampStr: "09:40:00 AM",
        agent: "Planner",
        title: "Mission Path Approved",
        description: "Boustrophedon 24-waypoint flight path calculated for Sector B (5.5 Acres).",
        eventType: "MILESTONE",
        telemetry: { lat: 16.5062, lng: 80.648, altitudeM: 0, speedKmh: 0, headingDeg: 0, batteryPct: 100 },
        decisionTrace: { from: "Intake Request", to: "Flight Plan", reasoning: "Optimal coverage path with wind constraint solver." },
      },
      {
        id: "EVENT-02",
        timeOffsetSec: 120,
        timestampStr: "09:42:00 AM",
        agent: "Scout",
        title: "Handover to Scout Agent",
        description: "Scout Agent received flight plan package & launched grid sweep.",
        eventType: "HANDOVER",
        telemetry: { lat: 16.5065, lng: 80.6482, altitudeM: 18.5, speedKmh: 12.4, headingDeg: 45, batteryPct: 96 },
      },
      {
        id: "EVENT-03",
        timeOffsetSec: 250,
        timestampStr: "09:44:10 AM",
        agent: "Scout",
        title: "Observation OBS-01 Logged",
        description: "Multispectral canopy anomaly detected at Sector B-North (Confidence 91%, Anomaly 0.82).",
        eventType: "OBSERVATION",
        telemetry: { lat: 16.507, lng: 80.6488, altitudeM: 18.5, speedKmh: 10.2, headingDeg: 90, batteryPct: 91 },
        mediaUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=500",
      },
      {
        id: "EVENT-04",
        timeOffsetSec: 380,
        timestampStr: "09:46:20 AM",
        agent: "Disease",
        title: "YOLO Disease Diagnosis: Leaf Rust 96%",
        description: "Disease Agent processed OBS-01 image: Puccinia fungal spores identified in 0.3 acres.",
        eventType: "DIAGNOSIS",
        telemetry: { lat: 16.507, lng: 80.6488, altitudeM: 18.5, speedKmh: 0, headingDeg: 90, batteryPct: 88 },
        mediaUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=500",
        decisionTrace: { from: "OBS-01 Anomaly", to: "Leaf Rust (Puccinia)", reasoning: "High contrast yellow-brown pustule pattern matched 96% AI confidence." },
      },
      {
        id: "EVENT-05",
        timeOffsetSec: 510,
        timestampStr: "09:48:30 AM",
        agent: "Spray",
        title: "Targeted 5% Spot Spraying Executed",
        description: "Precision Spray Commander pulsed Nozzle #1 & #2 with Copper Oxychloride 50% WP.",
        eventType: "SPRAY",
        telemetry: { lat: 16.507, lng: 80.6488, altitudeM: 12.0, speedKmh: 4.5, headingDeg: 90, batteryPct: 84 },
        decisionTrace: { from: "Leaf Rust 96%", to: "Spot Spray Target SPRAY-01", reasoning: "Fungicide prescription limited to 0.3 acres infected spot (95% chemical saved)." },
      },
      {
        id: "EVENT-06",
        timeOffsetSec: 680,
        timestampStr: "09:51:20 AM",
        agent: "Verification",
        title: "Quality Assurance +87% Recovery Audit Passed",
        description: "Verification Sentinel confirmed 100% target coverage and zero off-target chemical drift.",
        eventType: "VERIFICATION",
        telemetry: { lat: 16.5062, lng: 80.648, altitudeM: 18.5, speedKmh: 14.0, headingDeg: 270, batteryPct: 78 },
        decisionTrace: { from: "Post-Flight Scan", to: "Verified Audit (99.4%)", reasoning: "Spectral NDVI delta confirmed 87% disease suppression." },
      },
    ],
    events: [],
    media: [
      { id: "M1", timeOffsetSec: 250, type: "RGB", imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=500", caption: "OBS-01 RGB Canopy Frame" },
      { id: "M2", timeOffsetSec: 380, type: "YOLO_OVERLAY", imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=500", caption: "Disease YOLO Bounding Box Overlay" },
      { id: "M3", timeOffsetSec: 680, type: "VERIFICATION_DELTA", imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=500", caption: "Post-Treatment Recovery Delta" },
    ],
    analytics: {
      totalMissionDurationSec: 765,
      agentExecutionTimes: [
        { agent: "Planner Agent", executionTimeSec: 120, status: "COMPLETED", outputSummary: "24-Waypoint Path Approved" },
        { agent: "Scout Agent", executionTimeSec: 260, status: "COMPLETED", outputSummary: "100% Grid Sweep, 3 Observations" },
        { agent: "Disease Agent", executionTimeSec: 130, status: "COMPLETED", outputSummary: "Leaf Rust 96% Diagnosed" },
        { agent: "Spray Commander", executionTimeSec: 130, status: "COMPLETED", outputSummary: "5% Spot Spray Executed" },
        { agent: "Verification Sentinel", executionTimeSec: 125, status: "COMPLETED", outputSummary: "99.4% Compliance Score" },
      ],
      coverageTimeline: [
        { timeOffsetSec: 0, coveragePct: 0 },
        { timeOffsetSec: 200, coveragePct: 46 },
        { timeOffsetSec: 380, coveragePct: 88 },
        { timeOffsetSec: 510, coveragePct: 100 },
      ],
      resourceConsumptionTimeline: [
        { timeOffsetSec: 0, batteryPct: 100, chemicalUsedL: 0.0 },
        { timeOffsetSec: 250, batteryPct: 91, chemicalUsedL: 0.0 },
        { timeOffsetSec: 510, batteryPct: 84, chemicalUsedL: 1.0 },
        { timeOffsetSec: 765, batteryPct: 78, chemicalUsedL: 1.0 },
      ],
    },
    audit: {
      immutableMissionHash: "0x8f9a2b4c6e1d3f5a7b9c0d2e4f6a8b0c1d3e5f7a9b0c2d4e6f8a0b2c4d6e8f0a",
      verificationAuditPassed: true,
      totalEventsLogged: 6,
      decisionTraceabilityScorePct: 100,
      auditSignature: "SHA256-AGROSENTRY-2026-MSN-042-VERIFIED",
    },
    currentTimeOffsetSec: 0,
    isPlaying: false,
    playbackSpeed: 1,
  };

  const initialSdgImpactNamespace: SdgImpactNamespace = {
    status: "MISSION_COMPLETE",
    missionScore: {
      overallScore: 98,
      planningScore: 100,
      executionScore: 98,
      verificationScore: 99,
      sustainabilityScore: 97,
    },
    sdgContributions: [
      {
        code: 2,
        badge: "🌾 SDG 2 – Zero Hunger",
        title: "Zero Hunger & Sustainable Agriculture",
        metrics: [
          { label: "Monitored Crop Area", value: "5.5 Acres" },
          { label: "Early Pathogen Detection", value: "96% AI Confidence" },
          { label: "Protected Crop Area", value: "95.2% Protected" },
        ],
        description: "Early detection of Puccinia leaf rust prevented catastrophic canopy damage and safeguarded yield output.",
      },
      {
        code: 6,
        badge: "💧 SDG 6 – Clean Water & Sanitation",
        title: "Clean Water & Sanitation",
        metrics: [
          { label: "Water Conserved", value: "420 Liters" },
          { label: "Water Savings Ratio", value: "84% Saved" },
          { label: "Groundwater Contamination", value: "Zero Runoff Risk" },
        ],
        description: "Replaced 500L traditional blanket dilution with 80L targeted micro-dosage spray.",
      },
      {
        code: 12,
        badge: "♻️ SDG 12 – Responsible Consumption",
        title: "Responsible Consumption & Production",
        metrics: [
          { label: "Chemical Saved", value: "11.5 Liters (95%)" },
          { label: "Spot Spraying Ratio", value: "5.5% Field Coverage" },
          { label: "Resource Efficiency", value: "98.5%" },
        ],
        description: "Fungicide application restricted exclusively to 0.3 acres of verified infection spots.",
      },
      {
        code: 13,
        badge: "🌍 SDG 13 – Climate Action",
        title: "Climate Action & Energy Efficiency",
        metrics: [
          { label: "Flight Energy Saved", value: "42%" },
          { label: "CO2 Emissions Avoided", value: "18.5 kg CO2e" },
          { label: "Boustrophedon Optimization", value: "24 Waypoints" },
        ],
        description: "Wind-optimized flight paths minimized battery consumption and eliminated unnecessary drone flight hours.",
      },
      {
        code: 15,
        badge: "🌱 SDG 15 – Life on Land",
        title: "Life on Land & Ecosystem Health",
        metrics: [
          { label: "Verified Recovery Rate", value: "+87% Recovery" },
          { label: "Off-Target Drift", value: "0% (Zero Drift)" },
          { label: "Soil Microbial Preservation", value: "High Safety" },
        ],
        description: "Targeted pulse nozzle spraying prevented chemical drift onto surrounding non-target flora and soil biota.",
      },
    ],
    kpiDashboard: {
      totalDurationStr: "12m 45s",
      coveragePct: 100,
      targetSuccessRatePct: 100,
      targetsTreated: "2 / 2 Micro-Zones",
      verificationScorePct: 99.4,
      chemicalSavingsPct: 95,
      waterSavedL: 420,
    },
    sustainabilityReport: {
      totalChemicalSavedL: 11.5,
      totalWaterConservedL: 420,
      estimatedEnergySavedPct: 42,
      unnecessarySprayingReductionPct: 95,
      resourceEfficiencyPct: 98.5,
    },
    executiveSummary: {
      missionOverview: "Mission MSN-2026-042 successfully completed the 7-stage autonomous lifecycle over Sector B (5.5 Acres Cotton Parcel).",
      operationalPerformance: "Scout flight covered 100% grid in 4.3 minutes; Disease Agent diagnosed Leaf Rust (96% confidence); Spray Commander executed 5% spot treatment; Verification Sentinel confirmed +87% canopy recovery.",
      sustainabilityOutcomes: "Achieved 95% chemical reduction (11.5L saved) and 420L water conservation, earning a 98/100 Overall Sustainability Mission Score.",
      strategicRecommendations: [
        "Schedule follow-up verification sweep in 7 days to monitor cell #9 recovery.",
        "Archive mission telemetry log to blackbox ledger for regional ESG compliance.",
        "Re-use current Boustrophedon flight template for neighboring Sector C parcel.",
      ],
    },
  };

  return {
    missionId: "MSN-2026-042",
    stage: "Scout",
    targetField: "Sector B — Cotton Parcel (5.5 Acres)",
    totalAcres: 5.5,
    coveragePct: 0,
    activeDroneWp: 1,
    cells: initialCells,
    observations: initialObservations,
    handover: {
      fromAgent: "Planner Agent",
      toAgent: "Scout Agent",
      status: "Accepted",
      checkList: [
        { label: "Flight Plan", done: true },
        { label: "Waypoints", done: true },
        { label: "Camera Profile", done: true },
        { label: "Mission Constraints", done: true },
      ],
      message: "Planner Agent handed over verified flight package to Scout Agent.",
    },
    sdgLiveEvents: initialSdgEvents,
    disease: initialDiseaseNamespace,
    spray: initialSprayNamespace,
    verification: initialVerificationNamespace,
    replay: initialReplayNamespace,
    sdg: initialSdgImpactNamespace,
    zoneRisk: { zoneA: 2, zoneB: 67, zoneC: 4 },
    detectedDisease: {
      name: "Leaf Rust (Puccinia)",
      confidence: 96,
      affectedAreaPct: 4.8,
      severity: "Medium",
      recommendation: "Apply Targeted Spray of Copper Oxychloride 50% WP (Spot dosage: 0.3 acres).",
    },
    sprayStats: {
      chemicalSavedPct: 95,
      waterSavedL: 420,
      timeSavedPct: 42,
      costSavedInr: 3450,
    },
    sdgMetrics: {
      chemicalSavedPct: 78,
      waterSavedPct: 64,
      co2AvoidedKg: 18,
      labourSavedHrs: 4,
      sdgBadges: [2, 6, 12, 13, 15],
    },
  };
}







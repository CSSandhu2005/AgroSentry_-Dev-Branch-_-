// lib/mission/types.ts
// Core Autonomous Mission Architecture — Single Source of Truth

export type MissionType =
  | 'DISEASE_SCAN'
  | 'PRECISION_SPRAY'
  | 'NUTRIENT_SURVEY'
  | 'WATER_STRESS'
  | 'CROP_AUDIT';

export type MissionStatus =
  | 'CREATED'
  | 'PLANNING'
  | 'APPROVED'
  | 'QUEUED'
  | 'EXECUTING'
  | 'SCANNING'
  | 'ANALYZING'
  | 'SPRAYING'
  | 'VERIFYING'
  | 'COMPLETED'
  | 'ARCHIVED';

export type MissionPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type LogSeverity = 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';

export type AgentSubsystem =
  | 'SYSTEM'
  | 'PLANNER'
  | 'SCOUT'
  | 'DISEASE'
  | 'SPRAY'
  | 'VERIFICATION'
  | 'SDG';

export interface StructuredMissionLog {
  id: string;
  timestamp: string;
  agent: AgentSubsystem;
  event: string;
  description: string;
  severity: LogSeverity;
}

export interface SDGObjective {
  code: number; // e.g. 2, 6, 12, 13, 15
  title: string;
  description: string;
  target?: string;
}

export interface SustainabilityContext {
  objectives: SDGObjective[];
  currentContributions: string[];
  metrics: {
    distanceSavedMeters?: number;
    batterySavedPct?: number;
    chemicalSavedPct?: number;
    waterSavedLiters?: number;
    co2AvoidedKg?: number;
    coveragePct?: number;
    efficiencyScore?: number;
  };
  achievedGoals: number[];
}

export interface PlannerDeliverables {
  boundaryReport: {
    acres: number;
    perimeterMeters: number;
    centroid: { x: number; y: number };
    isValid: boolean;
    pointCount: number;
  };
  coveragePlan: {
    sweepAngleRad: number;
    sweepAngleDeg: number;
    laneCount: number;
    coveragePct: number;
    isSpotSpray: boolean;
  };
  waypointSet: {
    totalWaypoints: number;
    altitudeMeters: number;
    takeoffPoint: { x: number; y: number };
    landingPoint: { x: number; y: number };
    waypointsSummary: string[];
  };
  batteryAnalysis: {
    estimatedTimeSec: number;
    estimatedTimeMin: number;
    batteryDrawPct: number;
    flightDistanceMeters: number;
    hoverEnergyPct: number;
    travelEnergyPct: number;
    batteryMarginPct: number;
  };
  feasibilityReport: {
    riskScore: number;
    feasibilityStatus: 'OPTIMAL' | 'ACCEPTABLE' | 'WARNING';
    windToleranceKmh: number;
    safetyBufferMeters: number;
    recommendation: string;
  };
  sustainabilityReport: {
    primarySdg: number;
    supportingSdgs: number[];
    distanceReductionMeters: number;
    batterySavedPct: number;
    co2AvoidedKg: number;
    coverageEfficiencyPct: number;
  };
}

export interface PlannerConfidence {
  score: number; // 0-100%
  breakdown: {
    boundaryValid: boolean;
    batteryMarginSafe: boolean;
    completeCoverage: boolean;
    noGeometryErrors: boolean;
    waypointsGenerated: boolean;
  };
}

export interface PlannerContext {
  status: 'PENDING' | 'CONFIGURED' | 'OPTIMIZED';
  boundaryPoints?: { x: number; y: number }[];
  waypointCount?: number;
  estimatedFlightTimeSec?: number;
  flightAltitudeMeters?: number;
  overlapPct?: number;
  sweepAngleRad?: number;
  confidenceScore?: number;
  confidence?: PlannerConfidence;
  deliverables?: PlannerDeliverables;
}

export interface ScoutContext {
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  scannedAreaAcres?: number;
  totalGridCells?: number;
  infectedCellsCount?: number;
  anomalyDetected?: boolean;
}

export interface DiseaseContext {
  status: 'PENDING' | 'ANALYZING' | 'DIAGNOSED';
  pathogenName?: string;
  confidencePct?: number;
  severity?: 'Low' | 'Medium' | 'High';
  affectedAreaPct?: number;
  recommendedTreatment?: string;
}

export interface SprayContext {
  status: 'PENDING' | 'PLANNING' | 'EXECUTING' | 'COMPLETED';
  spotTargetsCount?: number;
  chemicalVolumeLiters?: number;
  waterVolumeLiters?: number;
  spotSprayEfficiencyPct?: number;
}

export interface VerificationContext {
  status: 'PENDING' | 'VERIFYING' | 'VERIFIED';
  recoveryRatePct?: number;
  remainingInfectionPct?: number;
  verificationScanDate?: string;
}

export interface ReplayContext {
  status: 'UNAVAILABLE' | 'READY';
  totalSteps?: number;
}

export interface MissionContext {
  planner: PlannerContext;
  scout: ScoutContext;
  disease: DiseaseContext;
  spray: SprayContext;
  verification: VerificationContext;
  replay: ReplayContext;
  sustainability: SustainabilityContext;
}

export type AgentExecutionState =
  | 'IDLE'
  | 'INITIALIZING'
  | 'RUNNING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export interface AgentIdentity {
  name: string;
  version: string;
  missionId: string;
}

export interface AgentSustainabilityImpact {
  primarySdg: number;
  supportingSdgs: number[];
  missionContribution: string;
  measuredMetrics: Record<string, number | string>;
}

/**
 * 9-Part Autonomous Agent Engineering Contract
 * Every agent in AgroSentry (Planner, Scout, Disease, Spray, Verification) complies with this contract.
 */
export interface AgentContract {
  identity: AgentIdentity;
  purpose: string;
  inputs: Record<string, unknown>;
  processing: string[];
  outputs: Record<string, unknown>;
  deliverables: string[];
  visualization: {
    type: string;
    description: string;
    activeElements: string[];
  };
  sustainability: AgentSustainabilityImpact;
  state: AgentExecutionState;
  missionIntegrationTarget: string;
}

export interface AgentPayloadData {
  contract?: AgentContract;
  purpose: string;
  inputs: Record<string, unknown>;
  processing: string[];
  outputs: Record<string, unknown>;
  visualizationType: string;
  sustainabilityImpact: {
    sdgs: number[];
    metrics: Record<string, number | string>;
  };
}

export interface AgentNamespaces {
  planner?: AgentPayloadData;
  scout?: AgentPayloadData;
  disease?: AgentPayloadData;
  spray?: AgentPayloadData;
  verification?: AgentPayloadData;
  sdg?: AgentPayloadData;
}

export interface AutonomousMission {
  id: string; // e.g. AGS-2026-0001 (Immutable Mission ID)
  name: string;
  type: MissionType;
  status: MissionStatus;
  priority: MissionPriority;
  currentAgent: string; // e.g. 'System', 'Planner', 'Scout', 'Disease Intelligence', 'Spray Commander'
  healthScore: number; // 0-100%
  crop: string;
  farmer: {
    id: number;
    name: string;
  };
  field: {
    name: string;
    acres: number;
    location?: string;
  };
  droneId: string;
  objective: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  context: MissionContext;
  agents: AgentNamespaces;
  missionLogs: StructuredMissionLog[];
}

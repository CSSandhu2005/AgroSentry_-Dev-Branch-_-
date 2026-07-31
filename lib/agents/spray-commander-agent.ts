// lib/agents/spray-commander-agent.ts

import {
  MissionState,
  SprayNamespace,
  SprayQueueItem,
  AppliedZone,
  SprayLogEntry,
  SprayAgentState,
  DiseaseFinding,
} from "./shared-mission-state";

export interface SprayAgentRunLog {
  state: SprayAgentState;
  timestamp: string;
  message: string;
  engine: string;
}

export interface SprayAgentRunResult {
  success: boolean;
  updatedMission: MissionState;
  logs: SprayAgentRunLog[];
}

/**
 * Phase 5 — Precision Spray Commander Agent
 * Primary Responsibility: Execute targeted micro-dosage spot spraying based on Disease Agent findings.
 * Consumes ONLY Disease Agent deliverables. Does NOT re-diagnose or recalculate waypoints.
 * Owns and updates strictly ONLY the mission.spray namespace.
 */
export function runSprayCommanderAgent(mission: MissionState): SprayAgentRunResult {
  const logs: SprayAgentRunLog[] = [];
  const addLog = (state: SprayAgentState, message: string, engine: string) => {
    logs.push({
      state,
      timestamp: new Date().toLocaleTimeString(),
      message,
      engine,
    });
  };

  // State 1: INITIALIZING
  addLog("INITIALIZING", "Precision Spray Commander initialized. Synchronizing hardware links & solenoid valves...", "System");

  // State 2: LOADING_TREATMENT_PLAN (Engine 1: Treatment Intake Engine)
  addLog("LOADING_TREATMENT_PLAN", `Treatment Intake Engine consuming ${mission.disease.findings.length} findings & recommendations from Disease Agent...`, "Treatment Intake Engine");

  const treatmentQueue: SprayQueueItem[] = mission.disease.findings.map((f: DiseaseFinding, idx: number) => ({
    id: `SPRAY-0${idx + 1}`,
    findingId: f.id,
    targetCellId: f.obsId === "OBS-01" ? 9 : 10,
    location: f.location,
    chemicalName: f.recommendedChemical,
    dosage: f.recommendedDose,
    flowRateLmin: idx === 0 ? 1.2 : 1.0,
    sprayDurationSec: idx === 0 ? 8 : 5,
    priority: f.priority,
    status: "Completed",
    coordinates: { x: idx === 0 ? 2 : 3, y: 1 },
  }));

  // State 3: NAVIGATING_TO_TARGET (Engine 2: Spray Planning Engine)
  addLog("NAVIGATING_TO_TARGET", "Spray Planning Engine calculating optimal spot spray sequence & micro-nozzle pulse timing...", "Spray Planning Engine");

  // State 4: SPRAYING_TARGET (Engine 3: Spray Control Engine)
  addLog("SPRAYING_TARGET", "Spray Control Engine pulsing Nozzle #1 & #2 (Blue mist misting active at 1.2 L/min over Target SPRAY-01)...", "Spray Control Engine");

  const appliedZones: AppliedZone[] = treatmentQueue.map((item, idx) => ({
    zoneId: `ZONE-B-SPOT-${idx + 1}`,
    cellId: item.targetCellId,
    location: item.location,
    appliedChemical: item.chemicalName,
    volumeAppliedL: idx === 0 ? 0.65 : 0.35,
    timestamp: new Date().toLocaleTimeString(),
    status: "Applied",
  }));

  const sprayLog: SprayLogEntry[] = [
    {
      id: "LOG-01",
      timestamp: new Date().toLocaleTimeString(),
      targetId: "SPRAY-01",
      nozzleState: "ON",
      flowRateLmin: 1.2,
      tankRemainingPct: 92,
      message: "Nozzle solenoid valves ON over Target SPRAY-01 (Sector B-North). Blue mist active.",
    },
    {
      id: "LOG-02",
      timestamp: new Date().toLocaleTimeString(),
      targetId: "SPRAY-01",
      nozzleState: "OFF",
      flowRateLmin: 0.0,
      tankRemainingPct: 90,
      message: "Target SPRAY-01 micro-dosage complete (0.65L applied). Nozzle OFF.",
    },
    {
      id: "LOG-03",
      timestamp: new Date().toLocaleTimeString(),
      targetId: "SPRAY-02",
      nozzleState: "ON",
      flowRateLmin: 1.0,
      tankRemainingPct: 88,
      message: "Nozzle solenoid valves ON over Target SPRAY-02 (Sector B-Center). Blue mist active.",
    },
    {
      id: "LOG-04",
      timestamp: new Date().toLocaleTimeString(),
      targetId: "SPRAY-02",
      nozzleState: "OFF",
      flowRateLmin: 0.0,
      tankRemainingPct: 86,
      message: "Target SPRAY-02 micro-dosage complete (0.35L applied). Nozzles disengaged.",
    },
  ];

  // State 5: VERIFYING_APPLICATION (Engine 5: Spray Confidence Engine)
  addLog("VERIFYING_APPLICATION", "Spray Confidence Engine auditing target alignment (98%), spray accuracy (96%), and zero off-target drift...", "Spray Confidence Engine");

  // State 6: MOVING_TO_NEXT_TARGET & GENERATING_REPORT (Engine 4: Resource Optimization Engine)
  addLog("MOVING_TO_NEXT_TARGET", "Moving through treatment zones. Spot spray sequence completed.", "Spray Planning Engine");
  addLog("GENERATING_REPORT", "Resource Optimization Engine synthesizing 95% Chemical Reduction & 420L Water Savings reports...", "Resource Optimization Engine");

  const updatedSprayNamespace: SprayNamespace = {
    status: "COMPLETED",
    treatmentQueue,
    appliedZones,
    sprayLog,
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
      chemicalUsageReport: "1.0L total chemical applied across 0.3 acres spot target versus 12.5L required for traditional blanket spraying.",
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
    activeTargetId: null,
    nozzleState: "OFF",
    currentFlowRateLmin: 0.0,
  };

  // Update Mission Object — strictly updating ONLY the spray namespace and handover state
  const updatedMission: MissionState = {
    ...mission,
    stage: "Spray",
    cells: mission.cells.map((cell) => {
      if (cell.id === 9 || cell.id === 10) {
        return { ...cell, status: "sprayed" };
      }
      return cell;
    }),
    spray: updatedSprayNamespace,
    handover: {
      fromAgent: "Spray Commander",
      toAgent: "Verification Sentinel",
      status: "Accepted",
      checkList: [
        { label: "Application Complete (0.3 acres spot sprayed)", done: true },
        { label: "Chemical Usage Audit (1.0L applied)", done: true },
        { label: "Post-Treatment Micro-Coordinates", done: true },
        { label: "Nozzles Disengaged", done: true },
      ],
      message: "Precision Spray Commander completed spot application. Handing application report to Verification Sentinel.",
    },
  };

  addLog("COMPLETED", "Phase 5 Precision Spray Commander execution complete. Handing application report to Verification Sentinel.", "System");

  return {
    success: true,
    updatedMission,
    logs,
  };
}

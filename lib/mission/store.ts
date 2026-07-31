// lib/mission/store.ts
// Mission Store & Single Source of Truth Manager

import {
  AutonomousMission,
  MissionType,
  MissionPriority,
  MissionStatus,
  StructuredMissionLog,
  SDGObjective,
} from './types';

const STORAGE_KEY = 'agrosentry_autonomous_missions_v1';

/** Helper to generate initial sustainability objectives based on mission intent */
export function getInitialSDGObjectives(type: MissionType): SDGObjective[] {
  const baseObjectives: SDGObjective[] = [
    {
      code: 13,
      title: 'SDG 13: Climate Action',
      description: 'Optimize autonomous drone flight efficiency to minimize energy footprint.',
      target: '13.2 Integrate climate change measures into national policies and planning',
    },
  ];

  if (type === 'DISEASE_SCAN' || type === 'CROP_AUDIT') {
    baseObjectives.unshift({
      code: 2,
      title: 'SDG 2: Zero Hunger',
      description: 'Early pathogen diagnosis to protect crop yields and secure food production.',
      target: '2.4 Ensure sustainable food production systems',
    });
  }

  if (type === 'PRECISION_SPRAY' || type === 'WATER_STRESS') {
    baseObjectives.push({
      code: 12,
      title: 'SDG 12: Responsible Consumption',
      description: 'Targeted spot spraying to reduce chemical run-off and pesticide usage.',
      target: '12.4 Environmentally sound management of chemicals',
    });
    baseObjectives.push({
      code: 6,
      title: 'SDG 6: Clean Water',
      description: 'Reduce water volume for chemical dilution through ultra-low volume nozzle precision.',
      target: '6.4 Substantially increase water-use efficiency',
    });
  }

  if (type === 'NUTRIENT_SURVEY') {
    baseObjectives.push({
      code: 15,
      title: 'SDG 15: Life on Land',
      description: 'Prevent soil degradation through balanced N-P-K micro-dosing.',
      target: '15.3 Combat desertification and restore degraded land and soil',
    });
  }

  return baseObjectives;
}

/** Initial seed missions to ensure rich application state on launch */
export const INITIAL_SEED_MISSIONS: AutonomousMission[] = [
  {
    id: 'AGS-2026-0001',
    name: 'Sector B — Cotton Disease Scan & Spot Treatment',
    type: 'DISEASE_SCAN',
    status: 'CREATED',
    priority: 'HIGH',
    currentAgent: 'System',
    healthScore: 98,
    crop: 'Cotton (Bt Variety)',
    farmer: { id: 101, name: 'Chiranjeev Sandhu' },
    field: { name: 'Cotton Field A (Parcel 4)', acres: 5.5, location: 'Punjab, India' },
    droneId: 'AgroDrone-01 (Hexacopter RTK)',
    objective: 'Perform high-resolution multispectral scan of Sector B to identify Leaf Rust hotspots.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    context: {
      planner: { status: 'PENDING' },
      scout: { status: 'PENDING' },
      disease: { status: 'PENDING' },
      spray: { status: 'PENDING' },
      verification: { status: 'PENDING' },
      replay: { status: 'UNAVAILABLE' },
      sustainability: {
        objectives: getInitialSDGObjectives('DISEASE_SCAN'),
        currentContributions: [
          'Mission created with intent to protect crop yield (SDG 2).',
          'Autonomous flight path queued to minimize flight duration & CO2 (SDG 13).',
        ],
        metrics: {
          coveragePct: 0,
          efficiencyScore: 98,
        },
        achievedGoals: [2, 13],
      },
    },
    agents: {},
    missionLogs: [
      {
        id: 'log-001-1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        agent: 'SYSTEM',
        event: 'MISSION_CREATED',
        description: 'Mission AGS-2026-0001 created via Autonomous Operations Console.',
        severity: 'INFO',
      },
    ],
  },
  {
    id: 'AGS-2026-0002',
    name: 'North Orchard — Precision Water Stress Survey',
    type: 'WATER_STRESS',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    currentAgent: 'Verification Sentinel',
    healthScore: 100,
    crop: 'Citrus / Orange',
    farmer: { id: 101, name: 'Chiranjeev Sandhu' },
    field: { name: 'North Orchard Block 2', acres: 8.2, location: 'Punjab, India' },
    droneId: 'AgroDrone-02 (Fixed-Wing Scout)',
    objective: 'Map thermal canopy transpiration to detect early drip irrigation blockage.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    startedAt: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2 + 5400000).toISOString(),
    context: {
      planner: { status: 'OPTIMIZED', waypointCount: 42, estimatedFlightTimeSec: 920 },
      scout: { status: 'COMPLETED', scannedAreaAcres: 8.2, totalGridCells: 24, anomalyDetected: false },
      disease: { status: 'PENDING' },
      spray: { status: 'COMPLETED', waterVolumeLiters: 180, spotSprayEfficiencyPct: 92 },
      verification: { status: 'VERIFIED', recoveryRatePct: 95, remainingInfectionPct: 0 },
      replay: { status: 'READY', totalSteps: 8 },
      sustainability: {
        objectives: getInitialSDGObjectives('WATER_STRESS'),
        currentContributions: [
          'Saved 420L water through targeted micro-drip inspection (SDG 6).',
          'Eliminated 92% chemical drift through precision nozzles (SDG 12).',
          'Avoided 18.4kg CO2 emissions vs ground tractor (SDG 13).',
        ],
        metrics: {
          distanceSavedMeters: 1450,
          batterySavedPct: 18,
          chemicalSavedPct: 92,
          waterSavedLiters: 420,
          co2AvoidedKg: 18.4,
          coveragePct: 100,
          efficiencyScore: 97,
        },
        achievedGoals: [6, 12, 13],
      },
    },
    agents: {},
    missionLogs: [
      {
        id: 'log-002-1',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        agent: 'SYSTEM',
        event: 'MISSION_CREATED',
        description: 'Mission AGS-2026-0002 initialized.',
        severity: 'INFO',
      },
      {
        id: 'log-002-2',
        timestamp: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
        agent: 'PLANNER',
        event: 'WAYPOINTS_GENERATED',
        description: 'Boustrophedon path planner generated 42 waypoints at 18.5m altitude.',
        severity: 'SUCCESS',
      },
      {
        id: 'log-002-3',
        timestamp: new Date(Date.now() - 86400000 * 2 + 5400000).toISOString(),
        agent: 'VERIFICATION',
        event: 'MISSION_VERIFIED',
        description: 'Thermal inspection verified clean irrigation flow. Mission archived.',
        severity: 'SUCCESS',
      },
    ],
  },
];

/** Fetch all stored missions (synchronizing with localStorage on client) */
export function getMissions(): AutonomousMission[] {
  if (typeof window === 'undefined') return INITIAL_SEED_MISSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_MISSIONS));
      return INITIAL_SEED_MISSIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load missions from localStorage:', err);
    return INITIAL_SEED_MISSIONS;
  }
}

/** Get a single mission by immutable ID */
export function getMissionById(id: string): AutonomousMission | undefined {
  const missions = getMissions();
  return missions.find((m) => m.id === id);
}

/** Generate unique immutable mission ID: AGS-2026-XXXX */
export function generateMissionId(): string {
  const missions = getMissions();
  const year = new Date().getFullYear();
  let maxSeq = 0;
  missions.forEach((m) => {
    const parts = m.id.split('-');
    if (parts.length === 3) {
      const seq = parseInt(parts[2], 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  });
  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `AGS-${year}-${nextSeq}`;
}

/** Create a new Autonomous Mission and save to store */
export function createMission(params: {
  name: string;
  type: MissionType;
  priority: MissionPriority;
  field: { name: string; acres: number; location?: string };
  droneId: string;
  objective: string;
  crop?: string;
  farmer?: { id: number; name: string };
}): AutonomousMission {
  const id = generateMissionId();
  const now = new Date().toISOString();
  const objectives = getInitialSDGObjectives(params.type);

  const newMission: AutonomousMission = {
    id,
    name: params.name,
    type: params.type,
    status: 'CREATED',
    priority: params.priority,
    currentAgent: 'System',
    healthScore: 98,
    crop: params.crop || 'Cotton',
    farmer: params.farmer || { id: 101, name: 'Chiranjeev Sandhu' },
    field: params.field,
    droneId: params.droneId,
    objective: params.objective,
    createdAt: now,
    context: {
      planner: { status: 'PENDING' },
      scout: { status: 'PENDING' },
      disease: { status: 'PENDING' },
      spray: { status: 'PENDING' },
      verification: { status: 'PENDING' },
      replay: { status: 'UNAVAILABLE' },
      sustainability: {
        objectives,
        currentContributions: [
          `Mission ${id} initialized for ${params.field.name} (${params.field.acres} acres).`,
          `Targeting ${objectives.map((o) => `SDG ${o.code}`).join(', ')} sustainability objectives.`,
        ],
        metrics: {
          coveragePct: 0,
          efficiencyScore: 98,
        },
        achievedGoals: objectives.map((o) => o.code),
      },
    },
    agents: {},
    missionLogs: [
      {
        id: `log-${Date.now()}`,
        timestamp: now,
        agent: 'SYSTEM',
        event: 'MISSION_CREATED',
        description: `Autonomous mission ${id} created with status CREATED. Assigned to ${params.droneId}.`,
        severity: 'INFO',
      },
    ],
  };

  const currentMissions = getMissions();
  const updated = [newMission, ...currentMissions];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save mission:', e);
    }
  }

  return newMission;
}

/** Update status and append log to a mission */
export function updateMissionStatus(
  id: string,
  newStatus: MissionStatus,
  currentAgent?: string,
  logEntry?: { agent: StructuredMissionLog['agent']; event: string; description: string; severity?: StructuredMissionLog['severity'] }
): AutonomousMission | undefined {
  const missions = getMissions();
  const index = missions.findIndex((m) => m.id === id);
  if (index === -1) return undefined;

  const mission = missions[index];
  const now = new Date().toISOString();

  mission.status = newStatus;
  if (currentAgent) mission.currentAgent = currentAgent;
  if (newStatus === 'EXECUTING' || newStatus === 'SCANNING') {
    if (!mission.startedAt) mission.startedAt = now;
  }
  if (newStatus === 'COMPLETED' || newStatus === 'ARCHIVED') {
    mission.completedAt = now;
  }

  if (logEntry) {
    mission.missionLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now,
      agent: logEntry.agent,
      event: logEntry.event,
      description: logEntry.description,
      severity: logEntry.severity || 'INFO',
    });
  }

  missions[index] = mission;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
    } catch (e) {
      console.error('Failed to update mission status in localStorage:', e);
    }
  }

  return mission;
}

/** Append a custom log to a mission */
export function addMissionLog(
  id: string,
  agent: StructuredMissionLog['agent'],
  event: string,
  description: string,
  severity: StructuredMissionLog['severity'] = 'INFO'
): boolean {
  const missions = getMissions();
  const mission = missions.find((m) => m.id === id);
  if (!mission) return false;

  mission.missionLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    agent,
    event,
    description,
    severity,
  });

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
    } catch (e) {
      console.error('Failed to append log:', e);
    }
  }
  return true;
}

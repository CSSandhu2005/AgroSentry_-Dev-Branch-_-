// lib/agents/shared-mission-state.ts

export type MissionStage = "Scout" | "Disease" | "Spray" | "Verification" | "SDG";

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

export interface MissionState {
  missionId: string;
  stage: MissionStage;
  targetField: string;
  totalAcres: number;
  coveragePct: number;
  activeDroneWp: number;
  cells: GridCell[];
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
  verification: {
    recoveryRatePct: number;
    remainingDiseasePct: number;
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

  return {
    missionId: "MSN-2026-042",
    stage: "Scout",
    targetField: "Sector B — Cotton Parcel (5.5 Acres)",
    totalAcres: 5.5,
    coveragePct: 0,
    activeDroneWp: 1,
    cells: initialCells,
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
    verification: {
      recoveryRatePct: 87,
      remainingDiseasePct: 2,
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

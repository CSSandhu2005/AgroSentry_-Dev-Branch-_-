// lib/mission/mission.ts
import { Point2D, PolygonBoundary, DEFAULT_FIELD_POLYGON, calculatePolygonAreaAcres, calculatePolygonPerimeterMeters, calculateCentroid, calculateOptimalSweepAngle } from "./boundary";
import { Waypoint, PathPlannerConfig, PathPlannerResult, generateBoustrophedonPath } from "./path-planner";
import { BatteryTelemetry, calculateBatteryTelemetry } from "./battery";
import { TerrainData, DEFAULT_TERRAIN_DATA } from "./terrain";
import { ReplanningResult, simulateDynamicReplanning } from "./optimizer";
import { ReplayState, INITIAL_REPLAY_STATE } from "./replay";

export type StudioViewMode = "2D_SATELLITE" | "MISSION_ANALYSIS" | "3D_FARM_TWIN" | "MISSION_PREVIEW";

export interface UnifiedMission {
  id: string;
  title: string;
  createdAt: string;
  fieldBoundary: PolygonBoundary;
  plannerConfig: PathPlannerConfig;
  pathResult: PathPlannerResult;
  telemetry: BatteryTelemetry;
  terrain: TerrainData;
  replanning: ReplanningResult;
  replay: ReplayState;
  activeViewMode: StudioViewMode;
}

/** Construct a complete, reactive Unified Mission object */
export function buildUnifiedMission(
  polygon: Point2D[] = DEFAULT_FIELD_POLYGON,
  configOverrides?: Partial<PathPlannerConfig>,
  isDynamicReplanned = false
): UnifiedMission {
  const acres = calculatePolygonAreaAcres(polygon);
  const perimeter = calculatePolygonPerimeterMeters(polygon);
  const centroid = calculateCentroid(polygon);
  const sweepAngle = calculateOptimalSweepAngle(polygon);

  const boundary: PolygonBoundary = {
    id: "poly-sector-b",
    name: "Sector B — Cotton & Wheat Parcel",
    points: polygon,
    acres,
    perimeterMeters: perimeter,
    centroid,
    sweepAngleRad: sweepAngle,
  };

  const plannerConfig: PathPlannerConfig = {
    altitudeMeters: 18.5,
    frontOverlapPct: 80,
    sideOverlapPct: 70,
    cameraFovDeg: 84,
    fieldScaleMeters: 300,
    isSpotSprayMode: false,
    ...configOverrides,
  };

  const pathResult = generateBoustrophedonPath(
    polygon,
    plannerConfig,
    DEFAULT_TERRAIN_DATA.diseaseClouds.map((d) => ({ x: d.x, y: d.y }))
  );

  const telemetry = calculateBatteryTelemetry(
    plannerConfig.altitudeMeters,
    pathResult.estimatedTimeSeconds,
    acres,
    plannerConfig.isSpotSprayMode
  );

  const waypointsToUse = pathResult.waypoints;
  const replanning = isDynamicReplanned
    ? simulateDynamicReplanning(waypointsToUse, { x: 0.45, y: 0.45 })
    : {
        originalWaypoints: waypointsToUse,
        replannedWaypoints: waypointsToUse,
        isReplanned: false,
      };

  return {
    id: "MSN-2026-STUDIO-01",
    title: "Mission Planning Studio — Sector B",
    createdAt: new Date().toISOString(),
    fieldBoundary: boundary,
    plannerConfig,
    pathResult,
    telemetry,
    terrain: DEFAULT_TERRAIN_DATA,
    replanning,
    replay: INITIAL_REPLAY_STATE,
    activeViewMode: "2D_SATELLITE",
  };
}

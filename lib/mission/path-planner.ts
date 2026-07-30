// lib/mission/path-planner.ts
import { Point2D, isPointInPolygon, calculateOptimalSweepAngle } from "./boundary";

export interface Waypoint {
  id: number;
  x: number; // Normalized [0..1]
  y: number; // Normalized [0..1]
  altMeters: number;
  type: "TAKEOFF" | "SWEEP" | "SPOT_SPRAY" | "TURN" | "RTL" | "LAND";
  action?: "NONE" | "SPRAY_ON" | "SPRAY_OFF" | "CAMERA_CAPTURE";
  isSpotTarget?: boolean;
}

export interface PathPlannerConfig {
  altitudeMeters: number;     // e.g. 18.5m
  frontOverlapPct: number;    // e.g. 80%
  sideOverlapPct: number;     // e.g. 70%
  cameraFovDeg: number;       // e.g. 84 deg
  fieldScaleMeters: number;   // e.g. 300m
  isSpotSprayMode: boolean;   // Target infected zones only
}

export interface PathPlannerResult {
  waypoints: Waypoint[];
  totalDistanceMeters: number;
  estimatedTimeSeconds: number;
  turnCount: number;
  swathCount: number;
  algorithmName: "Boustrophedon (Lawnmower) Coverage Path Planning";
}

/** Pure Boustrophedon (Lawnmower) Coverage Path Planning Algorithm */
export function generateBoustrophedonPath(
  polygon: Point2D[],
  config: PathPlannerConfig,
  infectedHotspots: Point2D[] = []
): PathPlannerResult {
  if (polygon.length < 3) {
    return {
      waypoints: [],
      totalDistanceMeters: 0,
      estimatedTimeSeconds: 0,
      turnCount: 0,
      swathCount: 0,
      algorithmName: "Boustrophedon (Lawnmower) Coverage Path Planning",
    };
  }

  // 1. Calculate camera swath width on ground
  const fovRad = (config.cameraFovDeg * Math.PI) / 180;
  const cameraGroundSwath = 2 * config.altitudeMeters * Math.tan(fovRad / 2);
  const effectiveSpacingMeters = cameraGroundSwath * (1 - config.sideOverlapPct / 100);
  const normSpacing = effectiveSpacingMeters / config.fieldScaleMeters;

  // 2. Find bounding box of polygon
  let minX = 1, maxX = 0, minY = 1, maxY = 0;
  polygon.forEach((p) => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });

  const width = maxX - minX;
  const height = maxY - minY;
  const numSwaths = Math.max(3, Math.ceil(height / (normSpacing || 0.05)));
  const stepY = height / numSwaths;

  const rawWaypoints: Point2D[] = [];
  let turnCount = 0;

  // 3. Generate boustrophedon sweep lines (alternating left-to-right & right-to-left)
  for (let i = 0; i <= numSwaths; i++) {
    const curY = minY + i * stepY;
    const isEven = i % 2 === 0;

    // Find intersection x-coords of curY with polygon edges
    const xIntersects: number[] = [];
    for (let j = 0; j < polygon.length; j++) {
      const p1 = polygon[j];
      const p2 = polygon[(j + 1) % polygon.length];
      if ((p1.y <= curY && p2.y > curY) || (p2.y <= curY && p1.y > curY)) {
        const t = (curY - p1.y) / (p2.y - p1.y || 0.00001);
        const xVal = p1.x + t * (p2.x - p1.x);
        xIntersects.push(xVal);
      }
    }

    xIntersects.sort((a, b) => a - b);

    if (xIntersects.length >= 2) {
      const startX = xIntersects[0] + 0.02;
      const endX = xIntersects[xIntersects.length - 1] - 0.02;

      // Generate intermediate waypoints along the line
      const lineSteps = 5;
      const stepX = (endX - startX) / lineSteps;

      if (isEven) {
        for (let s = 0; s <= lineSteps; s++) {
          const pt = { x: startX + s * stepX, y: curY };
          if (isPointInPolygon(pt, polygon)) rawWaypoints.push(pt);
        }
      } else {
        for (let s = lineSteps; s >= 0; s--) {
          const pt = { x: startX + s * stepX, y: curY };
          if (isPointInPolygon(pt, polygon)) rawWaypoints.push(pt);
        }
      }
      turnCount++;
    }
  }

  // 4. If Spot Spray Mode, filter waypoints near infected hotspots
  let finalPoints = rawWaypoints;
  if (config.isSpotSprayMode && infectedHotspots.length > 0) {
    const spotRadiusNorm = 0.18; // ~30-50m radius
    finalPoints = rawWaypoints.filter((wp) =>
      infectedHotspots.some((spot) => {
        const dx = wp.x - spot.x;
        const dy = wp.y - spot.y;
        return Math.sqrt(dx * dx + dy * dy) <= spotRadiusNorm;
      })
    );
    // If spot filter produced too few, keep at least a compact loop
    if (finalPoints.length < 4) finalPoints = rawWaypoints.slice(0, 10);
  }

  // 5. Construct full Waypoint objects
  const waypoints: Waypoint[] = [];
  let wpId = 1;

  // Takeoff home
  const homePt = polygon[0] || { x: 0.1, y: 0.9 };
  waypoints.push({
    id: wpId++,
    x: homePt.x,
    y: homePt.y,
    altMeters: 0,
    type: "TAKEOFF",
    action: "NONE",
  });

  // Ascend to cruise altitude
  waypoints.push({
    id: wpId++,
    x: homePt.x,
    y: homePt.y,
    altMeters: config.altitudeMeters,
    type: "TAKEOFF",
    action: "CAMERA_CAPTURE",
  });

  // Path waypoints
  finalPoints.forEach((pt, idx) => {
    const isNearInfected = infectedHotspots.some((spot) => {
      const dx = pt.x - spot.x;
      const dy = pt.y - spot.y;
      return Math.sqrt(dx * dx + dy * dy) <= 0.15;
    });

    waypoints.push({
      id: wpId++,
      x: pt.x,
      y: pt.y,
      altMeters: config.altitudeMeters,
      type: isNearInfected ? "SPOT_SPRAY" : "SWEEP",
      action: isNearInfected ? "SPRAY_ON" : "CAMERA_CAPTURE",
      isSpotTarget: isNearInfected,
    });
  });

  // RTL & Land
  waypoints.push({
    id: wpId++,
    x: homePt.x,
    y: homePt.y,
    altMeters: config.altitudeMeters,
    type: "RTL",
    action: "SPRAY_OFF",
  });
  waypoints.push({
    id: wpId++,
    x: homePt.x,
    y: homePt.y,
    altMeters: 0,
    type: "LAND",
    action: "NONE",
  });

  // 6. Calculate total flight distance in meters
  let totalDistanceMeters = 0;
  for (let k = 0; k < waypoints.length - 1; k++) {
    const pA = waypoints[k];
    const pB = waypoints[k + 1];
    const dx = (pB.x - pA.x) * config.fieldScaleMeters;
    const dy = (pB.y - pA.y) * config.fieldScaleMeters;
    const dz = pB.altMeters - pA.altMeters;
    totalDistanceMeters += Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // Estimated speed = 5.5 m/s, turn penalty = 3s per turn
  const cruiseSpeed = 5.5;
  const flightTimeSec = Math.round(totalDistanceMeters / cruiseSpeed + turnCount * 3);

  return {
    waypoints,
    totalDistanceMeters: Math.round(totalDistanceMeters),
    estimatedTimeSeconds: flightTimeSec,
    turnCount,
    swathCount: numSwaths,
    algorithmName: "Boustrophedon (Lawnmower) Coverage Path Planning",
  };
}

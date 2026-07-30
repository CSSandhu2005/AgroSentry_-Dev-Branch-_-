// lib/mission/optimizer.ts
import { Waypoint } from "./path-planner";
import { Point2D } from "./boundary";
import { TerrainObstacle } from "./terrain";

export interface ReplanningResult {
  originalWaypoints: Waypoint[];
  replannedWaypoints: Waypoint[];
  isReplanned: boolean;
  activeObstacle?: TerrainObstacle;
  alertText?: string;
}

/** Simulate real-time dynamic obstacle avoidance & path re-routing */
export function simulateDynamicReplanning(
  waypoints: Waypoint[],
  obstaclePt: Point2D = { x: 0.45, y: 0.45 }
): ReplanningResult {
  if (waypoints.length < 4) {
    return {
      originalWaypoints: waypoints,
      replannedWaypoints: waypoints,
      isReplanned: false,
    };
  }

  const obstacle: TerrainObstacle = {
    id: "dyn-obs-1",
    type: "DYNAMIC_WIND",
    x: obstaclePt.x,
    y: obstaclePt.y,
    heightMeters: 14.0,
    radiusMeters: 18.0,
  };

  const replanned: Waypoint[] = [];
  const obstacleRadiusNorm = 0.12; // ~35m avoidance radius

  waypoints.forEach((wp) => {
    const dx = wp.x - obstacle.x;
    const dy = wp.y - obstacle.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < obstacleRadiusNorm) {
      // Re-route around obstacle edge (detour vector)
      const angle = Math.atan2(dy, dx);
      const pushDist = obstacleRadiusNorm * 1.35;
      const newX = obstacle.x + Math.cos(angle) * pushDist;
      const newY = obstacle.y + Math.sin(angle) * pushDist;

      replanned.push({
        ...wp,
        x: Math.max(0.05, Math.min(0.95, newX)),
        y: Math.max(0.05, Math.min(0.95, newY)),
        altMeters: wp.altMeters + 4.0, // Climb +4m over hazard
        type: "SWEEP",
        action: "CAMERA_CAPTURE",
      });
    } else {
      replanned.push({ ...wp });
    }
  });

  return {
    originalWaypoints: waypoints,
    replannedWaypoints: replanned,
    isReplanned: true,
    activeObstacle: obstacle,
    alertText: "⚡ Dynamic Re-planning Active: Avoided sudden obstacle / wind shear hazard. Safe detour trajectory generated.",
  };
}

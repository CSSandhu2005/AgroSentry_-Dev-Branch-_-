// lib/mission/replay.ts
import { Waypoint } from "./path-planner";

export type PlaybackPhase = "IDLE" | "COUNTDOWN" | "TAKEOFF" | "SWEEP" | "SPOT_SPRAY" | "RTL" | "LANDED";

export interface ReplayState {
  phase: PlaybackPhase;
  countdownSec: number;        // 3..2..1..
  activeWpIndex: number;
  currentProgressPct: number;  // 0..100
  dronePosition: { x: number; y: number; altMeters: number };
  headingDeg: number;
  speedMultiplier: number;     // 1x, 2x, 5x
  isPlaying: boolean;
  activeActionText: string;
}

export const INITIAL_REPLAY_STATE: ReplayState = {
  phase: "IDLE",
  countdownSec: 3,
  activeWpIndex: 0,
  currentProgressPct: 0,
  dronePosition: { x: 0.15, y: 0.15, altMeters: 0 },
  headingDeg: 0,
  speedMultiplier: 1,
  isPlaying: false,
  activeActionText: "Standby — Press Preview Mission to start takeoff sequence",
};

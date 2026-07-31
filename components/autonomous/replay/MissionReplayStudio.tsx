"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LiveDrone3DVisualizer } from "@/components/autonomous/mission-control/LiveDrone3DVisualizer";
import {
  createInitialMissionState,
  MissionState,
  ReplayTimelineEvent,
  ReplayEngineState,
} from "@/lib/agents/shared-mission-state";
import { runMissionReplayEngine } from "@/lib/agents/mission-replay-engine";
import {
  Bot,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Navigation,
  Activity,
  Layers,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  FastForward,
} from "lucide-react";

const REPLAY_STATE_STEPS: { id: ReplayEngineState; label: string }[] = [
  { id: "IDLE", label: "IDLE" },
  { id: "LOADING_MISSION", label: "LOADING MISSION" },
  { id: "AGGREGATING_EVENTS", label: "AGGREGATING EVENTS" },
  { id: "SYNCHRONIZING_MEDIA", label: "SYNCHRONIZING MEDIA" },
  { id: "BUILDING_TIMELINE", label: "BUILDING TIMELINE" },
  { id: "GENERATING_ANALYTICS", label: "ANALYTICS" },
  { id: "READY", label: "READY" },
];

export function MissionReplayStudio() {
  const [mission, setMission] = useState<MissionState>(createInitialMissionState());
  const [scrubberSec, setScrubberSec] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5>(1);
  const [activeTab, setActiveTab] = useState<"timeline" | "decisions" | "media" | "analytics">("timeline");

  const replayState = mission.replay;
  const maxSec = replayState.analytics.totalMissionDurationSec || 765;

  // Automated Scrubber Playback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setScrubberSec((prev) => {
        if (prev >= maxSec) {
          setIsPlaying(false);
          return maxSec;
        }
        return prev + 5 * playbackSpeed;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [isPlaying, maxSec, playbackSpeed]);

  // Find active event based on scrubber offset
  const activeEvent = [...replayState.timeline]
    .reverse()
    .find((e) => e.timeOffsetSec <= scrubberSec) || replayState.timeline[0];

  const formatMinSec = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = Math.floor(totalSec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleRunEngine = () => {
    const result = runMissionReplayEngine(mission);
    setMission(result.updatedMission);
    setScrubberSec(0);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Hero Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl bg-card border shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs">
              <Bot className="w-3.5 h-3.5 mr-1 text-indigo-400" />
              AGENT 6: MISSION REPLAY ENGINE
            </Badge>
            <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
              MISSION STAGE: REPLAY
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Chronological Mission Reconstruction & Replay
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-3xl">
            Reconstructs complete mission history from Planner, Scout, Disease, Spray, and Verification agents. Provides an interactive timeline scrubber, telemetry playback, and decision causality trace.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <Button
            onClick={handleRunEngine}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Rebuild Replay Timeline
          </Button>
          <Button
            variant="outline"
            onClick={() => setMission(createInitialMissionState())}
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset State
          </Button>
        </div>
      </div>

      {/* State Machine Stepper */}
      <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs border-b pb-2">
          <span className="font-bold uppercase tracking-wider text-muted-foreground">
            Replay Engine State Machine
          </span>
          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 text-[10px] font-mono">
            STATE: {replayState.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-1">
          {REPLAY_STATE_STEPS.map((step, idx) => {
            const currentIdx = REPLAY_STATE_STEPS.findIndex((s) => s.id === replayState.status);
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div
                key={step.id}
                className={`p-2 rounded-lg border text-center text-[9px] font-mono font-bold transition-all ${
                  isCurrent
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-500/30 animate-pulse"
                    : isDone
                    ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"
                    : "bg-slate-950/40 border-slate-800 text-slate-500"
                }`}
              >
                <div>{idx + 1}. {step.label}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Interactive Playback Scrubber Control Bar */}
      <Card className="p-5 border bg-card text-card-foreground shadow-md rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-3">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-4"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
              {isPlaying ? "PAUSE REPLAY" : "PLAY REPLAY"}
            </Button>
            <Button
              size="xs"
              variant="outline"
              onClick={() => setScrubberSec(0)}
              className="text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Rewind
            </Button>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg text-xs">
              <FastForward className="w-3 h-3 text-muted-foreground ml-1" />
              {([1, 2, 5] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    playbackSpeed === s ? "bg-indigo-600 text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}X
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-muted-foreground">TIMESTAMP:</span>
            <strong className="text-indigo-400 text-base">{formatMinSec(scrubberSec)}</strong>
            <span className="text-muted-foreground">/ {formatMinSec(maxSec)}</span>
          </div>
        </div>

        {/* Timeline Scrubber Range Input */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={maxSec}
            value={scrubberSec}
            onChange={(e) => setScrubberSec(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-2 bg-secondary rounded-lg"
          />

          {/* Timeline Event Markers */}
          <div className="relative h-6 w-full text-[10px] font-mono flex items-center justify-between text-muted-foreground pt-1">
            {replayState.timeline.map((evt) => {
              const pct = (evt.timeOffsetSec / maxSec) * 100;
              const isActive = evt.id === activeEvent.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => setScrubberSec(evt.timeOffsetSec)}
                  className={`absolute -translate-x-1/2 cursor-pointer px-1.5 py-0.5 rounded transition-all border ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-400 font-bold z-10 scale-110"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                  style={{ left: `${pct}%` }}
                >
                  {evt.agent}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Main 3D Drone Telemetry Replay & Active Event Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: 3D Visualizer & Synchronized Media Frame */}
        <div className="lg:col-span-2 space-y-6">
          <LiveDrone3DVisualizer
            isSpraying={activeEvent?.eventType === "SPRAY"}
            stage={activeEvent?.agent as any || "Scout"}
          />

          {/* Synchronized Media Viewer */}
          {activeEvent?.mediaUrl && (
            <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-semibold text-sm">Synchronized Replay Frame</h3>
                </div>
                <Badge variant="outline" className="text-xs font-mono text-purple-400 border-purple-500/30">
                  EVENT: {activeEvent.eventType}
                </Badge>
              </div>

              <div className="h-56 rounded-xl bg-slate-950 border overflow-hidden relative">
                <img
                  src={activeEvent.mediaUrl}
                  alt={activeEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-3 py-1 rounded font-mono border border-slate-800">
                  {activeEvent.title} — {activeEvent.timestampStr}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Active Event Telemetry & Decision Traceability */}
        <div className="space-y-6">
          <Card className="p-5 border bg-card shadow-sm rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-semibold text-sm flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-400" /> Active Event Telemetry
              </h3>
              <Badge className="bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                {activeEvent.agent.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="font-bold text-base text-foreground">{activeEvent.title}</div>
              <p className="text-muted-foreground leading-relaxed">{activeEvent.description}</p>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-muted-foreground text-[10px]">Altitude:</span>
                  <div className="font-bold text-slate-200">{activeEvent.telemetry.altitudeM} m</div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-muted-foreground text-[10px]">Speed:</span>
                  <div className="font-bold text-slate-200">{activeEvent.telemetry.speedKmh} km/h</div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-muted-foreground text-[10px]">Heading:</span>
                  <div className="font-bold text-slate-200">{activeEvent.telemetry.headingDeg}°</div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-muted-foreground text-[10px]">Battery:</span>
                  <div className="font-bold text-emerald-400">{activeEvent.telemetry.batteryPct}%</div>
                </div>
              </div>

              {/* Decision Traceability Box if present */}
              {activeEvent.decisionTrace && (
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1">
                  <div className="font-bold text-purple-300 text-[11px]">Decision Causality Trace:</div>
                  <div className="text-[10px] text-slate-300 font-mono">
                    {activeEvent.decisionTrace.from} &rarr; {activeEvent.decisionTrace.to}
                  </div>
                  <p className="text-[10px] text-muted-foreground pt-0.5">
                    Reasoning: {activeEvent.decisionTrace.reasoning}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Immutable Audit Certificate Box */}
          <Card className="p-4 border bg-slate-950 text-slate-200 shadow-sm rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-semibold text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Immutable Mission Audit
              </span>
              <Badge variant="outline" className="text-[9px] text-slate-400 border-slate-800 font-mono">SHA-256</Badge>
            </div>
            <div className="space-y-1 text-[11px] font-mono">
              <div className="text-slate-400 truncate">Hash: {replayState.audit.immutableMissionHash}</div>
              <div className="text-emerald-400 font-bold">Decision Traceability: {replayState.audit.decisionTraceabilityScorePct}%</div>
              <div className="text-slate-400">Signature: {replayState.audit.auditSignature}</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs View for Timeline Events, Decision Trace, Analytics */}
      <Tabs defaultValue="timeline" onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
        <TabsList className="bg-secondary/40 p-1 border">
          <TabsTrigger value="timeline" className="text-xs">Timeline Event Log</TabsTrigger>
          <TabsTrigger value="decisions" className="text-xs">Decision Traceability</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">Agent Execution Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-3">
            <h3 className="font-semibold text-sm border-b pb-2">Unified Chronological Event Timeline</h3>
            <div className="space-y-2">
              {replayState.timeline.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setScrubberSec(evt.timeOffsetSec)}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                    activeEvent.id === evt.id
                      ? "bg-indigo-950/30 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/30"
                      : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-muted-foreground text-[11px]">{evt.timestampStr}</span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {evt.agent}
                    </Badge>
                    <span className="font-semibold text-foreground">{evt.title}</span>
                  </div>
                  <div className="text-muted-foreground text-[11px] font-mono">{evt.eventType}</div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 border bg-card shadow-sm rounded-xl space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-indigo-400 border-b pb-2">
                Agent Execution Breakdown
              </h4>
              <div className="space-y-2 text-xs">
                {replayState.analytics.agentExecutionTimes.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded bg-secondary/40">
                    <span className="font-medium text-foreground">{item.agent}</span>
                    <span className="font-mono text-emerald-400 font-bold">{item.executionTimeSec}s</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 border bg-card shadow-sm rounded-xl space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-emerald-400 border-b pb-2">
                Resource & Battery Drain Timeline
              </h4>
              <div className="space-y-2 text-xs font-mono">
                {replayState.analytics.resourceConsumptionTimeline.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-muted-foreground">T+{item.timeOffsetSec}s</span>
                    <span className="text-emerald-400 font-bold">Battery: {item.batteryPct}%</span>
                    <span className="text-blue-400 font-bold">Chem: {item.chemicalUsedL}L</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, Play, Clock, ArrowRight, Bot } from "lucide-react";
import { MissionStage } from "@/lib/agents/shared-mission-state";

interface StageConfig {
  id: MissionStage;
  name: string;
  agent: string;
  icon: string;
  description: string;
}

const STAGES: StageConfig[] = [
  { id: "Planner", name: "Planner", agent: "Planner Agent", icon: "📋", description: "Flight Path & Constraint Solver" },
  { id: "Scout", name: "Scout", agent: "Scout Agent", icon: "🛰️", description: "Grid Sweep & Anomaly Observation" },
  { id: "Disease", name: "Disease", agent: "Disease Agent", icon: "🌿", description: "YOLO Fungal & Pest Diagnosis" },
  { id: "Spray", name: "Spray", agent: "Spray Commander", icon: "🚁", description: "5% Micro-Droplet Precision Spray" },
  { id: "Verification", name: "Verification", agent: "Verification Agent", icon: "✅", description: "Post-Treatment Recovery Scan" },
  { id: "Replay", name: "Replay", agent: "Replay Engine", icon: "🎥", description: "Blackbox Telemetry Playback" },
  { id: "SDG", name: "SDG", agent: "SDG Impact Engine", icon: "🌍", description: "Quantified Sustainability Score" },
];

interface AutonomousMissionPipelineHeaderProps {
  currentStage: MissionStage;
  onSelectStage?: (stage: MissionStage) => void;
  className?: string;
}

export function AutonomousMissionPipelineHeader({
  currentStage,
  onSelectStage,
  className = "",
}: AutonomousMissionPipelineHeaderProps) {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className={`p-4 rounded-2xl bg-card border shadow-sm space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight uppercase text-foreground">
              Autonomous Mission Pipeline
            </h2>
            <p className="text-[11px] text-muted-foreground">
              End-to-end agentic work handover & execution narrative
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-muted-foreground">ACTIVE EXECUTION:</span>
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 animate-pulse font-mono">
            STAGE {currentIndex >= 0 ? currentIndex + 1 : 1} OF 7 ({currentStage.toUpperCase()})
          </Badge>
        </div>
      </div>

      {/* Stepper Pipeline Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
        {STAGES.map((s, idx) => {
          const isCompleted = idx < currentIndex;
          const isRunning = idx === currentIndex;
          const isWaiting = idx > currentIndex;

          return (
            <button
              key={s.id}
              onClick={() => onSelectStage?.(s.id)}
              className={`relative p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[72px] group cursor-pointer ${
                isRunning
                  ? "bg-purple-950/40 border-purple-500/50 shadow-md ring-1 ring-purple-500/30"
                  : isCompleted
                  ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50"
                  : "bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/60"
              }`}
            >
              {/* Header row inside node */}
              <div className="flex items-center justify-between w-full">
                <span className="text-sm">{s.icon}</span>
                {isCompleted && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    ✓
                  </span>
                )}
                {isRunning && (
                  <Badge className="bg-purple-500 text-white text-[9px] px-1.5 py-0 h-4 font-bold animate-pulse">
                    RUNNING
                  </Badge>
                )}
                {isWaiting && (
                  <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 text-muted-foreground border-slate-700">
                    WAITING
                  </Badge>
                )}
              </div>

              {/* Stage label & agent */}
              <div className="mt-1">
                <div className={`text-xs font-semibold tracking-tight ${isRunning ? "text-purple-300" : isCompleted ? "text-emerald-400" : "text-foreground"}`}>
                  {s.name}
                </div>
                <div className="text-[9px] text-muted-foreground truncate">{s.agent}</div>
              </div>

              {/* Connecting indicator if not last */}
              {idx < STAGES.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/40">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

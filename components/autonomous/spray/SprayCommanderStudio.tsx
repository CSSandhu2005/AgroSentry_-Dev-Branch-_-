"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  createInitialMissionState,
  MissionState,
  SprayQueueItem,
  SprayAgentState,
} from "@/lib/agents/shared-mission-state";
import { runSprayCommanderAgent, SprayAgentRunLog } from "@/lib/agents/spray-commander-agent";
import {
  Bot,
  Droplets,
  ShieldCheck,
  Zap,
  Play,
  RotateCcw,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Leaf,
  Navigation,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const SPRAY_STATE_STEPS: { id: SprayAgentState; label: string }[] = [
  { id: "IDLE", label: "IDLE" },
  { id: "INITIALIZING", label: "INITIALIZING" },
  { id: "LOADING_TREATMENT_PLAN", label: "INTAKE PLAN" },
  { id: "NAVIGATING_TO_TARGET", label: "NAVIGATING" },
  { id: "SPRAYING_TARGET", label: "SPRAYING TARGET" },
  { id: "VERIFYING_APPLICATION", label: "VERIFYING" },
  { id: "MOVING_TO_NEXT_TARGET", label: "MOVING TARGET" },
  { id: "GENERATING_REPORT", label: "REPORTS" },
  { id: "COMPLETED", label: "COMPLETED" },
];

export function SprayCommanderStudio() {
  const [mission, setMission] = useState<MissionState>(createInitialMissionState());
  const [activeTab, setActiveTab] = useState<"operational" | "telemetry" | "reports" | "sdg">("operational");
  const [logs, setLogs] = useState<SprayAgentRunLog[]>([]);
  const [isSprayingSim, setIsSprayingSim] = useState(false);

  const sprayState = mission.spray;

  const handleRunSprayCommander = () => {
    setIsSprayingSim(true);
    const result = runSprayCommanderAgent(mission);
    setLogs(result.logs);
    setMission(result.updatedMission);
    setIsSprayingSim(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Hero Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl bg-card border shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
              <Bot className="w-3.5 h-3.5 mr-1 text-blue-400" />
              AGENT 4: PRECISION SPRAY COMMANDER
            </Badge>
            <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
              MISSION STAGE: SPRAYING
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Targeted 5% Spot Spraying Command Studio
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-3xl">
            Autonomous physical spray execution engine. Consumes Disease Agent findings to pulse blue mist nozzles only over verified infected cells, achieving 95% chemical reduction.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <Button
            onClick={handleRunSprayCommander}
            disabled={isSprayingSim}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5" /> Execute Spot Spraying
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
            Spray Commander State Machine
          </span>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 text-[10px] font-mono">
            STATE: {sprayState.status}
          </Badge>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5 pt-1">
          {SPRAY_STATE_STEPS.map((step, idx) => {
            const currentIdx = SPRAY_STATE_STEPS.findIndex((s) => s.id === sprayState.status);
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div
                key={step.id}
                className={`p-2 rounded-lg border text-center text-[9px] font-mono font-bold transition-all ${
                  isCurrent
                    ? "bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-500/30 animate-pulse"
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

      {/* Hardware Telemetry & Nozzle Gauges Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Nozzle State */}
        <Card className="p-4 border bg-card shadow-xs space-y-1 text-center">
          <div className="text-xs text-muted-foreground">Nozzle Valve State</div>
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <span className={`w-3 h-3 rounded-full ${sprayState.nozzleState === "ON" ? "bg-blue-500 animate-ping" : "bg-slate-600"}`} />
            <span className={`font-mono font-bold text-lg ${sprayState.nozzleState === "ON" ? "text-blue-400" : "text-slate-400"}`}>
              {sprayState.nozzleState === "ON" ? "NOZZLE ON" : "NOZZLE OFF"}
            </span>
          </div>
        </Card>

        {/* Flow Rate */}
        <Card className="p-4 border bg-card shadow-xs space-y-1 text-center">
          <div className="text-xs text-muted-foreground">Pulse Flow Rate</div>
          <div className="font-mono font-bold text-lg text-emerald-400 pt-1">
            {sprayState.currentFlowRateLmin > 0 ? `${sprayState.currentFlowRateLmin} L/min` : "1.2 L/min (Calibrated)"}
          </div>
        </Card>

        {/* Tank Level Gauge */}
        <Card className="p-4 border bg-card shadow-xs space-y-1 text-center">
          <div className="text-xs text-muted-foreground">Chemical Tank Level</div>
          <div className="font-mono font-bold text-lg text-blue-400 pt-1">
            {sprayState.resourceUsage.tankLevelPct}% ({sprayState.resourceUsage.remainingChemicalL}L / 10L)
          </div>
        </Card>

        {/* Chemical Saved */}
        <Card className="p-4 border bg-card shadow-xs space-y-1 text-center">
          <div className="text-xs text-muted-foreground">Chemical Reduction</div>
          <div className="font-mono font-bold text-lg text-emerald-400 pt-1">
            {sprayState.resourceUsage.chemicalSavedPct}% SAVED
          </div>
        </Card>
      </div>

      {/* Main Operational Tabs */}
      <Tabs defaultValue="operational" onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
        <TabsList className="bg-secondary/40 p-1 border">
          <TabsTrigger value="operational" className="text-xs">Spot Spray Grid Canvas</TabsTrigger>
          <TabsTrigger value="telemetry" className="text-xs">Spray Logs & Targets</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs">Engineering Reports</TabsTrigger>
          <TabsTrigger value="sdg" className="text-xs">SDG 6 & 12 Impact</TabsTrigger>
        </TabsList>

        {/* TAB 1: SPOT SPRAY GRID CANVAS & CONTRAST */}
        <TabsContent value="operational" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Targeted Spray Execution Canvas */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-semibold text-sm">Targeted 5% Spot Spraying Execution Grid</h3>
                    <p className="text-xs text-muted-foreground">
                      Nozzles spray blue mist ONLY over infected cells (`██`), skipping 94.5% healthy crop.
                    </p>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                    Blue Mist Micro-Pulse
                  </Badge>
                </div>

                <div className="grid grid-cols-6 gap-2 bg-slate-950 p-4 rounded-xl border relative shadow-inner">
                  {mission.cells.map((cell) => {
                    const isSprayed = cell.status === "sprayed" || cell.id === 9 || cell.id === 10;
                    return (
                      <div
                        key={cell.id}
                        className={`h-16 rounded-lg border flex flex-col items-center justify-center text-xs font-mono relative overflow-hidden transition-all ${
                          isSprayed
                            ? "bg-blue-500/30 border-blue-500 text-blue-300 ring-2 ring-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                            : "bg-emerald-500/10 border-slate-800 text-slate-500"
                        }`}
                      >
                        {isSprayed && (
                          <div className="absolute inset-0 bg-blue-500/20 animate-pulse flex items-center justify-center">
                            <Droplets className="w-5 h-5 text-blue-300 animate-bounce" />
                          </div>
                        )}
                        <span className="relative z-10 font-bold">{isSprayed ? "SPRAY 5%" : "NO SPRAY"}</span>
                        <span className="relative z-10 text-[9px] text-slate-400">Cell #{cell.id}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Live Savings Stats Bar */}
                <div className="grid grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-muted-foreground">Chemical Volume Saved</div>
                    <div className="font-bold text-emerald-400 text-base">11.5 Liters (95%)</div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="text-muted-foreground">Water Conserved</div>
                    <div className="font-bold text-blue-400 text-base">420 Liters</div>
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <div className="text-muted-foreground">Farmer Cost Saved</div>
                    <div className="font-bold text-indigo-400 text-base">₹3,450 / Mission</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Execution Queue & Handover */}
            <div className="space-y-4">
              <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-semibold text-sm flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-400" />
                    Treatment Execution Queue
                  </h3>
                  <Badge variant="outline" className="text-[10px]">2 Targets</Badge>
                </div>

                <div className="space-y-2 text-xs">
                  {sprayState.treatmentQueue.map((item) => (
                    <div key={item.id} className="p-2.5 rounded-lg border bg-slate-950/40 space-y-1">
                      <div className="flex justify-between font-mono font-bold">
                        <span className="text-blue-400">{item.id} (Cell #{item.targetCellId})</span>
                        <span className="text-emerald-400">{item.status}</span>
                      </div>
                      <div className="text-[11px] text-slate-300">{item.chemicalName}</div>
                      <div className="text-[10px] text-muted-foreground">{item.dosage}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t text-[11px] text-muted-foreground space-y-1">
                  <div className="font-semibold text-foreground">Handover Protocol:</div>
                  <p className="leading-snug">
                    Application report handed to Verification Sentinel for post-treatment recovery scan.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: SPRAY LOGS & TARGETS */}
        <TabsContent value="telemetry" className="space-y-4">
          <Card className="p-5 border bg-card shadow-sm rounded-xl space-y-3">
            <h3 className="font-semibold text-sm border-b pb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-400" /> Real-time Solenoid & Nozzle Telemetry Log
            </h3>
            <div className="space-y-2 font-mono text-xs max-h-72 overflow-y-auto">
              {sprayState.sprayLog.map((log) => (
                <div key={log.id} className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">{log.timestamp}</span>
                  <span className="text-purple-400 font-bold">{log.targetId}</span>
                  <Badge variant="outline" className={`text-[10px] ${log.nozzleState === "ON" ? "text-blue-400 border-blue-500/40" : "text-slate-500"}`}>
                    NOZZLE {log.nozzleState}
                  </Badge>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* TAB 3: ENGINEERING REPORTS */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 border-b pb-1">
                Chemical Usage Report
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {sprayState.reports.chemicalUsageReport}
              </p>
            </Card>

            <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-blue-400 border-b pb-1">
                Water Conservation Report
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {sprayState.reports.waterUsageReport}
              </p>
            </Card>

            <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 border-b pb-1">
                Tank Level & Capacity Report
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {sprayState.reports.tankReport}
              </p>
            </Card>

            <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-400 border-b pb-1">
                Execution & Pulse Timing Report
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {sprayState.reports.executionReport}
              </p>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 4: SDG 6 & 12 SUSTAINABILITY */}
        <TabsContent value="sdg" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 border bg-gradient-to-br from-blue-950/30 via-slate-900/40 to-slate-950 shadow-sm rounded-xl space-y-3">
              <div className="flex items-center space-x-2 border-b border-blue-500/20 pb-2">
                <Droplets className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-sm text-foreground">
                  {sprayState.sustainability.primarySdg.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {sprayState.sustainability.primarySdg.description}
              </p>
              <div className="pt-2 text-xl font-bold text-blue-400 font-mono">
                {sprayState.sustainability.waterConservedL} Liters Agricultural Water Conserved
              </div>
            </Card>

            <Card className="p-5 border bg-gradient-to-br from-emerald-950/30 via-slate-900/40 to-slate-950 shadow-sm rounded-xl space-y-3">
              <div className="flex items-center space-x-2 border-b border-emerald-500/20 pb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-sm text-foreground">
                  {sprayState.sustainability.supportingSdg.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {sprayState.sustainability.supportingSdg.description}
              </p>
              <div className="pt-2 text-xl font-bold text-emerald-400 font-mono">
                {sprayState.sustainability.blanketSprayReductionPct}% Chemical Waste Reduction
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

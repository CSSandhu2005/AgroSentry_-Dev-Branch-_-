"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  createInitialMissionState,
  MissionState,
  SdgImpactState,
} from "@/lib/agents/shared-mission-state";
import { runSdgImpactEngine, SdgEngineRunLog } from "@/lib/agents/sdg-impact-engine";
import {
  Bot,
  Award,
  Sparkles,
  CheckCircle2,
  Play,
  RotateCcw,
  Activity,
  Layers,
  FileText,
  Leaf,
  Droplets,
  Zap,
  Globe,
  TrendingUp,
  ShieldCheck,
  CheckSquare,
  ArrowRight,
  Archive,
} from "lucide-react";

const SDG_STATE_STEPS: { id: SdgImpactState; label: string }[] = [
  { id: "IDLE", label: "IDLE" },
  { id: "AGGREGATING_METRICS", label: "AGGREGATE METRICS" },
  { id: "COMPUTING_KPIS", label: "COMPUTE KPIS" },
  { id: "ANALYZING_SUSTAINABILITY", label: "SUSTAINABILITY" },
  { id: "GENERATING_EXECUTIVE_REPORT", label: "EXECUTIVE REPORT" },
  { id: "COMPUTING_MISSION_SCORE", label: "MISSION SCORE" },
  { id: "MISSION_COMPLETE", label: "MISSION COMPLETE" },
];

export function SdgImpactStudio() {
  const [mission, setMission] = useState<MissionState>(createInitialMissionState());
  const [activeTab, setActiveTab] = useState<"showcase" | "sdg_cards" | "kpis" | "executive">("showcase");
  const [logs, setLogs] = useState<SdgEngineRunLog[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const sdgState = mission.sdg;
  const score = sdgState.missionScore;

  const handleRunSdgEngine = () => {
    setIsExecuting(true);
    const result = runSdgImpactEngine(mission);
    setLogs(result.logs);
    setMission(result.updatedMission);
    setIsExecuting(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Hero Showcase Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-card to-slate-900 border shadow-md relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
              <Bot className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              AGENT 7: SDG IMPACT ENGINE (FINAL AGENT)
            </Badge>
            <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
              STAGE: MISSION_COMPLETE
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Executive Sustainability & Mission Showcase Studio
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-3xl">
            Aggregates measurable operational, engineering, and ESG impact generated across all 7 agents into a unified executive report, mission scorecard, and UN SDG alignment showcase.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <Button
            onClick={handleRunSdgEngine}
            disabled={isExecuting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Generate Executive SDG Report
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
            SDG Impact Engine State Machine
          </span>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-mono">
            STATE: {sdgState.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-1">
          {SDG_STATE_STEPS.map((step, idx) => {
            const currentIdx = SDG_STATE_STEPS.findIndex((s) => s.id === sdgState.status);
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div
                key={step.id}
                className={`p-2 rounded-lg border text-center text-[9px] font-mono font-bold transition-all ${
                  isCurrent
                    ? "bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/30 animate-pulse"
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

      {/* Showcase Highlight: Mission Scorecard & 4-Dimension Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Certified Mission Score Gauge */}
        <Card className="p-6 border bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 text-slate-100 shadow-md rounded-2xl flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <span className="font-semibold text-xs text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Award className="w-4 h-4 text-emerald-400" /> Certified Mission Score
            </span>
            <Badge className="bg-emerald-500 text-white font-mono text-xs">OFFICIAL</Badge>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="text-6xl md:text-7xl font-extrabold tracking-tight text-emerald-400 font-mono drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              {score.overallScore}
            </div>
            <div className="text-xs text-muted-foreground uppercase font-mono tracking-widest">
              OUT OF 100 POINTS
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono pt-2 border-t border-slate-800">
            <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400">1. Mission Planning:</span>
              <strong className="text-emerald-400">{score.planningScore} / 100</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400">2. Autonomous Execution:</span>
              <strong className="text-emerald-400">{score.executionScore} / 100</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400">3. Quality Verification:</span>
              <strong className="text-emerald-400">{score.verificationScore} / 100</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400">4. SDG Sustainability:</span>
              <strong className="text-emerald-400">{score.sustainabilityScore} / 100</strong>
            </div>
          </div>
        </Card>

        {/* Right 2 Columns: Mission KPI Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 border bg-card shadow-sm rounded-xl space-y-2 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-muted-foreground border-b pb-2">
              <span className="font-semibold uppercase tracking-wider text-foreground">Chemical Reduction</span>
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">95% SAVED</div>
              <div className="text-xs text-muted-foreground mt-1">
                {sdgState.sustainabilityReport.totalChemicalSavedL} Liters of chemical runoff avoided via 5% spot spraying.
              </div>
            </div>
            <Badge variant="outline" className="w-fit text-[10px] text-emerald-400 border-emerald-500/30">
              SDG 12 & SDG 15 VERIFIED
            </Badge>
          </Card>

          <Card className="p-5 border bg-card shadow-sm rounded-xl space-y-2 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-muted-foreground border-b pb-2">
              <span className="font-semibold uppercase tracking-wider text-foreground">Water Conservation</span>
              <Droplets className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-400 font-mono">420 LITERS</div>
              <div className="text-xs text-muted-foreground mt-1">
                84% reduction in agricultural water dilution vs blanket spraying.
              </div>
            </div>
            <Badge variant="outline" className="w-fit text-[10px] text-blue-400 border-blue-500/30">
              SDG 6 VERIFIED
            </Badge>
          </Card>

          <Card className="p-5 border bg-card shadow-sm rounded-xl space-y-2 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-muted-foreground border-b pb-2">
              <span className="font-semibold uppercase tracking-wider text-foreground">Vegetation Recovery</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-purple-400 font-mono">+87% RECOVERY</div>
              <div className="text-xs text-muted-foreground mt-1">
                Infection density reduced from 12.3% down to 1.6% post-treatment.
              </div>
            </div>
            <Badge variant="outline" className="w-fit text-[10px] text-purple-400 border-purple-500/30">
              SDG 2 & SDG 15 VERIFIED
            </Badge>
          </Card>

          <Card className="p-5 border bg-card shadow-sm rounded-xl space-y-2 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-muted-foreground border-b pb-2">
              <span className="font-semibold uppercase tracking-wider text-foreground">Flight Energy Saved</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-amber-400 font-mono">42% ENERGY</div>
              <div className="text-xs text-muted-foreground mt-1">
                18.5 kg CO2e emissions avoided via wind-optimized Boustrophedon paths.
              </div>
            </div>
            <Badge variant="outline" className="w-fit text-[10px] text-amber-400 border-amber-500/30">
              SDG 13 VERIFIED
            </Badge>
          </Card>
        </div>
      </div>

      {/* Interactive Tabs for SDG Contribution Cards & Executive Report */}
      <Tabs defaultValue="showcase" onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
        <TabsList className="bg-secondary/40 p-1 border">
          <TabsTrigger value="showcase" className="text-xs">UN SDG Contributions Showcase</TabsTrigger>
          <TabsTrigger value="executive" className="text-xs">Executive Summary & ESG Report</TabsTrigger>
          <TabsTrigger value="kpis" className="text-xs">Mission KPI Dashboard</TabsTrigger>
        </TabsList>

        {/* TAB 1: UN SDG CONTRIBUTIONS SHOWCASE */}
        <TabsContent value="showcase" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sdgState.sdgContributions.map((sdg) => (
              <Card key={sdg.code} className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-xs text-emerald-400">{sdg.badge}</span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      SDG #{sdg.code}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{sdg.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{sdg.description}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t text-xs font-mono">
                  {sdg.metrics.map((m, idx) => (
                    <div key={idx} className="flex justify-between p-1.5 rounded bg-slate-950/40">
                      <span className="text-slate-400 text-[11px]">{m.label}:</span>
                      <strong className="text-emerald-300 text-[11px]">{m.value}</strong>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 2: EXECUTIVE SUMMARY & ESG REPORT */}
        <TabsContent value="executive" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 border bg-card shadow-sm rounded-xl space-y-4">
              <h3 className="font-bold text-sm text-foreground border-b pb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" /> Stakeholder Executive Summary
              </h3>

              <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                <div>
                  <strong className="text-foreground">Mission Overview:</strong>
                  <p className="pt-0.5">{sdgState.executiveSummary.missionOverview}</p>
                </div>

                <div>
                  <strong className="text-foreground">Operational Performance:</strong>
                  <p className="pt-0.5">{sdgState.executiveSummary.operationalPerformance}</p>
                </div>

                <div>
                  <strong className="text-foreground">Sustainability & ESG Outcomes:</strong>
                  <p className="pt-0.5">{sdgState.executiveSummary.sustainabilityOutcomes}</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 border bg-card shadow-sm rounded-xl space-y-4">
              <h3 className="font-bold text-sm text-foreground border-b pb-2 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-purple-400" /> Strategic ESG Recommendations
              </h3>

              <div className="space-y-2 text-xs">
                {sdgState.executiveSummary.strategicRecommendations.map((rec: string, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg border bg-purple-950/20 border-purple-500/30 flex items-start gap-2 text-purple-200">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>

              {/* Handover & Archival Banner */}
              <div className="pt-3 border-t">
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between text-xs font-mono text-emerald-300">
                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4 text-emerald-400" />
                    <span>MISSION STATUS: ARCHIVED TO BLACKBOX</span>
                  </div>
                  <Badge className="bg-emerald-500 text-white text-[10px]">COMPLETE</Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: MISSION KPI DASHBOARD */}
        <TabsContent value="kpis" className="space-y-4">
          <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
            <h3 className="font-semibold text-sm border-b pb-2">Mission KPI Performance Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-muted-foreground text-[10px]">Total Duration:</span>
                <div className="font-bold text-base text-foreground">{sdgState.kpiDashboard.totalDurationStr}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-muted-foreground text-[10px]">Field Coverage:</span>
                <div className="font-bold text-base text-emerald-400">{sdgState.kpiDashboard.coveragePct}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-muted-foreground text-[10px]">Targets Treated:</span>
                <div className="font-bold text-base text-purple-400">{sdgState.kpiDashboard.targetsTreated}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-muted-foreground text-[10px]">Verification Score:</span>
                <div className="font-bold text-base text-blue-400">{sdgState.kpiDashboard.verificationScorePct}%</div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

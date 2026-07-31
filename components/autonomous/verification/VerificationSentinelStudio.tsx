"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  createInitialMissionState,
  MissionState,
  VerifiedZone,
  VerificationAgentState,
} from "@/lib/agents/shared-mission-state";
import { runVerificationSentinelAgent, VerificationAgentRunLog } from "@/lib/agents/verification-sentinel-agent";
import {
  Bot,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Activity,
  Layers,
  FileText,
  Leaf,
  Droplets,
  Eye,
  TrendingUp,
  Sliders,
  CheckSquare,
} from "lucide-react";

const VERIFY_STATE_STEPS: { id: VerificationAgentState; label: string }[] = [
  { id: "IDLE", label: "IDLE" },
  { id: "INITIALIZING", label: "INITIALIZING" },
  { id: "LOADING_VERIFICATION_DATA", label: "INTAKE DATA" },
  { id: "VALIDATING_APPLICATION", label: "VALIDATING TARGETS" },
  { id: "ASSESSING_EFFECTIVENESS", label: "EFFECTIVENESS" },
  { id: "GENERATING_AUDIT", label: "AUDIT LOG" },
  { id: "GENERATING_REPORTS", label: "REPORTS" },
  { id: "COMPLETED", label: "COMPLETED" },
];

export function VerificationSentinelStudio() {
  const [mission, setMission] = useState<MissionState>(createInitialMissionState());
  const [activeTab, setActiveTab] = useState<"overview" | "comparison" | "compliance" | "reports" | "sdg">("overview");
  const [sliderPos, setSliderPos] = useState(50);
  const [logs, setLogs] = useState<VerificationAgentRunLog[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const verifyState = mission.verification;

  const handleRunVerification = () => {
    setIsExecuting(true);
    const result = runVerificationSentinelAgent(mission);
    setLogs(result.logs);
    setMission(result.updatedMission);
    setIsExecuting(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Hero Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl bg-card border shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
              <Bot className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              AGENT 5: VERIFICATION SENTINEL
            </Badge>
            <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
              MISSION STAGE: VERIFYING
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Quality Assurance & Verification Sentinel Studio
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-3xl">
            Answers the core question: <em>"Did the mission achieve the intended result?"</em> Audits post-treatment recovery scans, cross-references solenoid logs against GPS waypoints, and verifies 100% target coverage.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <Button
            onClick={handleRunVerification}
            disabled={isExecuting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5" /> Run Verification Sentinel
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
            Verification Sentinel State Machine
          </span>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-mono">
            STATE: {verifyState.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 pt-1">
          {VERIFY_STATE_STEPS.map((step, idx) => {
            const currentIdx = VERIFY_STATE_STEPS.findIndex((s) => s.id === verifyState.status);
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

      {/* 5 Internal Engines Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-3.5 border bg-card shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">1. Verification Intake</span>
            <Badge variant="outline" className="text-[9px] text-emerald-400 border-emerald-500/30">Loaded</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Intake loaded {verifyState.verifiedZones.length} applied treatment zones & post-flight imagery.
          </p>
        </Card>

        <Card className="p-3.5 border bg-card shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">2. Validation</span>
            <Badge className="bg-emerald-500/20 text-emerald-300 text-[9px]">100% Targets</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            0 missed targets. 0 off-target chemical drift detected.
          </p>
        </Card>

        <Card className="p-3.5 border bg-card shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">3. Effectiveness</span>
            <Badge variant="outline" className="text-[9px] text-emerald-400 border-emerald-500/30">+87% Recovery</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Infection density reduced from 12.3% down to 1.6%.
          </p>
        </Card>

        <Card className="p-3.5 border bg-card shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">4. Audit & Compliance</span>
            <Badge variant="outline" className="text-[9px] text-purple-400 border-purple-500/30">99.4% Score</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Traceability log passed with full organic eco-compliance.
          </p>
        </Card>

        <Card className="p-3.5 border bg-card shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">5. Confidence Score</span>
            <Badge className="bg-emerald-500/20 text-emerald-300 text-[9px]">98% Score</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Image Quality 99%, Coverage 100%, Audit Completeness 100%.
          </p>
        </Card>
      </div>

      {/* Main Interactive Studio Tabs */}
      <Tabs defaultValue="overview" onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
        <TabsList className="bg-secondary/40 p-1 border">
          <TabsTrigger value="overview" className="text-xs">Verified Zones & Audit</TabsTrigger>
          <TabsTrigger value="comparison" className="text-xs">Before vs After Comparison</TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs">Compliance & Traceability Log</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs">Engineering Reports</TabsTrigger>
          <TabsTrigger value="sdg" className="text-xs">SDG 15 & 6 Sustainability</TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW & VERIFIED ZONES */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Verified Treatment Zones Grid */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-semibold text-sm">Verified Treatment Micro-Zones</h3>
                    <p className="text-xs text-muted-foreground">
                      Post-treatment recovery status cross-referenced against planned treatment targets.
                    </p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs font-mono">
                    100% VERIFIED TARGETS
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {verifyState.verifiedZones.map((zone) => (
                    <div key={zone.zoneId} className="p-4 rounded-xl border bg-slate-950/40 border-emerald-500/40 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-mono font-bold text-xs text-emerald-400">{zone.zoneId} (Cell #{zone.cellId})</span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                          ✓ {zone.treatmentStatus}
                        </Badge>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="text-slate-200 font-semibold">{zone.location}</div>
                        <div className="text-muted-foreground text-[11px]">Applied Chemical: {zone.targetChemical}</div>
                        
                        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                          <div className="p-2 rounded bg-red-950/20 border border-red-500/30">
                            <span className="text-muted-foreground text-[10px]">BEFORE:</span>
                            <div className="font-bold text-red-400">{zone.beforeInfectionPct}% Infection</div>
                          </div>
                          <div className="p-2 rounded bg-emerald-950/20 border border-emerald-500/30">
                            <span className="text-muted-foreground text-[10px]">AFTER:</span>
                            <div className="font-bold text-emerald-400">{zone.afterInfectionPct}% Infection</div>
                          </div>
                        </div>

                        <div className="pt-1 flex items-center justify-between text-xs font-mono font-bold">
                          <span className="text-muted-foreground">Recovery Delta:</span>
                          <span className="text-emerald-400">+{zone.recoveryRatePct}% Recovery</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column: Mission Audit Summary */}
            <div className="space-y-4">
              <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-semibold text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Mission Quality Audit
                  </h3>
                  <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                    99.4% SCORE
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded bg-secondary/40">
                    <span className="text-muted-foreground">Total Planned Targets:</span>
                    <span className="font-bold font-mono">{verifyState.auditResults.totalPlannedTargets}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-muted-foreground">Verified Treated Targets:</span>
                    <span className="font-bold font-mono text-emerald-400">{verifyState.auditResults.verifiedTargets}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-secondary/40">
                    <span className="text-muted-foreground">Missed Targets:</span>
                    <span className="font-bold font-mono text-emerald-400">0</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-secondary/40">
                    <span className="text-muted-foreground">Off-Target Applications:</span>
                    <span className="font-bold font-mono text-emerald-400">0</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-muted-foreground">Canopy Recovery Rate:</span>
                    <span className="font-bold font-mono text-emerald-400">87% Verified</span>
                  </div>
                </div>

                <div className="pt-2 border-t text-[11px] text-muted-foreground space-y-1">
                  <div className="font-semibold text-foreground">Handover Protocol:</div>
                  <p className="leading-snug">
                    Verification audit log handed cleanly to Mission Replay Engine for blackbox archiving.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: BEFORE VS AFTER COMPARISON */}
        <TabsContent value="comparison" className="space-y-4">
          <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-semibold text-sm">Post-Treatment Recovery Comparison Slider</h3>
                <p className="text-xs text-muted-foreground">
                  Interactive slider comparing initial pathogen infection against post-treatment vegetation recovery.
                </p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs font-mono">
                +87% RECOVERY AUDIT
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="relative w-full h-64 md:h-80 rounded-xl bg-slate-950 border overflow-hidden flex items-center justify-around p-4">
                <div className="space-y-1 text-center bg-slate-900/80 p-3 rounded-lg border border-red-500/30 backdrop-blur-xs">
                  <span className="text-red-400 font-bold text-base font-mono">BEFORE SPRAY</span>
                  <div className="text-red-400 text-xs">Infection: 12.3% (Leaf Rust)</div>
                </div>
                <div className="space-y-1 text-center bg-slate-900/80 p-3 rounded-lg border border-emerald-500/30 backdrop-blur-xs">
                  <span className="text-emerald-400 font-bold text-base font-mono">AFTER VERIFICATION</span>
                  <div className="text-emerald-400 text-xs">Recovery: 87% Verified</div>
                </div>

                <div
                  className="absolute top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_15px_#10b981] z-20 cursor-ew-resize"
                  style={{ left: `${sliderPos}%` }}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Before Treatment (Infected Canopy)</span>
                  <span>Interactive Comparison Slider ({sliderPos}%)</span>
                  <span>After Verification (Recovered Canopy)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 3: COMPLIANCE & TRACEABILITY LOG */}
        <TabsContent value="compliance" className="space-y-4">
          <Card className="p-5 border bg-card shadow-sm rounded-xl space-y-4">
            <h3 className="font-semibold text-sm border-b pb-2 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-400" /> Mission Audit & Compliance Checks
            </h3>

            <div className="space-y-2 text-xs">
              {verifyState.compliance.passedChecks.map((chk: string, idx: number) => (
                <div key={idx} className="p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/30 flex items-center justify-between text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{chk}</span>
                  </div>
                  <Badge className="bg-emerald-500 text-white text-[9px]">PASSED</Badge>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">Traceability Log</h4>
              <div className="space-y-1.5 font-mono text-xs">
                {verifyState.compliance.traceabilityLog.map((item: { timestamp: string; check: string; status: string }, idx: number) => (
                  <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between text-slate-300">
                    <span className="text-slate-500">{item.timestamp}</span>
                    <span>{item.check}</span>
                    <span className="text-emerald-400 font-bold">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 4: ENGINEERING REPORTS */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 border-b pb-1">
                Verification Summary Report
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {verifyState.reports.verificationReport}
              </p>
            </Card>

            <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 border-b pb-1">
                Mission Audit Report
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {verifyState.reports.auditReport}
              </p>
            </Card>

            <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-blue-400 border-b pb-1">
                Compliance Report
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {verifyState.reports.complianceReport}
              </p>
            </Card>

            <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-400 border-b pb-1">
                Recovery Assessment Report
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {verifyState.reports.recoveryAssessmentReport}
              </p>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 5: SDG 15 & 6 SUSTAINABILITY */}
        <TabsContent value="sdg" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 border bg-gradient-to-br from-emerald-950/30 via-slate-900/40 to-slate-950 shadow-sm rounded-xl space-y-3">
              <div className="flex items-center space-x-2 border-b border-emerald-500/20 pb-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-sm text-foreground">
                  {verifyState.sustainability.primarySdg.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {verifyState.sustainability.primarySdg.description}
              </p>
              <div className="pt-2 text-xl font-bold text-emerald-400 font-mono">
                {verifyState.sustainability.treatmentSuccessRatePct}% Treatment Success Rate
              </div>
            </Card>

            <Card className="p-5 border bg-gradient-to-br from-blue-950/30 via-slate-900/40 to-slate-950 shadow-sm rounded-xl space-y-3">
              <div className="flex items-center space-x-2 border-b border-blue-500/20 pb-2">
                <Droplets className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-sm text-foreground">
                  {verifyState.sustainability.supportingSdg.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {verifyState.sustainability.supportingSdg.description}
              </p>
              <div className="pt-2 text-xl font-bold text-blue-400 font-mono">
                {verifyState.sustainability.confirmedChemicalSavedL}L Chemical & {verifyState.sustainability.confirmedWaterConservedL}L Water Conserved
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

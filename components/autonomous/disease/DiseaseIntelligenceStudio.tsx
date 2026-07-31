"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  createInitialMissionState,
  MissionState,
  DiseaseFinding,
  HeatmapZone,
  DiseaseAgentState,
} from "@/lib/agents/shared-mission-state";
import { runDiseaseIntelligenceAgent, DiseaseAgentRunLog } from "@/lib/agents/disease-intelligence-agent";
import {
  Bot,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Layers,
  FileText,
  ShieldCheck,
  Leaf,
  ArrowRight,
  TrendingUp,
  Maximize2,
  Activity,
  Zap,
  RotateCcw,
  Play,
} from "lucide-react";

const STATE_MACHINE_STEPS: { id: DiseaseAgentState; label: string }[] = [
  { id: "IDLE", label: "IDLE" },
  { id: "INITIALIZING", label: "INITIALIZING" },
  { id: "LOADING_OBSERVATIONS", label: "LOADING OBSERVATIONS" },
  { id: "PREPROCESSING_IMAGES", label: "PREPROCESSING IMAGES" },
  { id: "CLASSIFYING_DISEASE", label: "CLASSIFYING DISEASE" },
  { id: "ASSESSING_SEVERITY", label: "ASSESSING SEVERITY" },
  { id: "GENERATING_RECOMMENDATIONS", label: "RECOMMENDATIONS" },
  { id: "GENERATING_REPORTS", label: "GENERATING REPORTS" },
  { id: "COMPLETED", label: "COMPLETED" },
];

export function DiseaseIntelligenceStudio() {
  const [mission, setMission] = useState<MissionState>(createInitialMissionState());
  const [activeTab, setActiveTab] = useState<"overview" | "heatmap" | "comparison" | "reports" | "sdg">("overview");
  const [selectedFinding, setSelectedFinding] = useState<DiseaseFinding | null>(
    mission.disease.findings[0] || null
  );
  const [imageMode, setImageMode] = useState<"original" | "ai_overlay" | "highlighted">("ai_overlay");
  const [logs, setLogs] = useState<DiseaseAgentRunLog[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const diseaseState = mission.disease;

  const handleRunAgent = () => {
    setIsExecuting(true);
    const result = runDiseaseIntelligenceAgent(mission);
    setLogs(result.logs);
    setMission(result.updatedMission);
    if (result.updatedMission.disease.findings[0]) {
      setSelectedFinding(result.updatedMission.disease.findings[0]);
    }
    setIsExecuting(false);
  };

  const getSeverityBadge = (severity: "Low" | "Medium" | "High" | "Critical") => {
    switch (severity) {
      case "Critical":
        return <Badge className="bg-red-600 text-white text-[10px]">CRITICAL</Badge>;
      case "High":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/40 text-[10px]">HIGH SEVERITY</Badge>;
      case "Medium":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 text-[10px]">MEDIUM SEVERITY</Badge>;
      case "Low":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">LOW SEVERITY</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Hero Header & Agent Identity Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl bg-card border shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
              <Bot className="w-3.5 h-3.5 mr-1 text-purple-400" />
              AGENT 3: DISEASE INTELLIGENCE AGENT
            </Badge>
            <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
              MISSION STAGE: ANALYZING
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Crop Pathogen Analysis & Intelligence Studio
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-3xl">
            Transforms observation markers into verified crop health findings. Runs 5 specialized internal engines without modifying flight paths or telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <Button
            onClick={handleRunAgent}
            disabled={isExecuting}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-md text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5" /> Run Disease Agent
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

      {/* Agent State Machine Stepper */}
      <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs border-b pb-2">
          <span className="font-bold uppercase tracking-wider text-muted-foreground">
            Agent State Machine Execution
          </span>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px] font-mono">
            STATE: {diseaseState.status}
          </Badge>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5 pt-1">
          {STATE_MACHINE_STEPS.map((step, idx) => {
            const currentIdx = STATE_MACHINE_STEPS.findIndex((s) => s.id === diseaseState.status);
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div
                key={step.id}
                className={`p-2 rounded-lg border text-center text-[9px] font-mono font-bold transition-all ${
                  isCurrent
                    ? "bg-purple-600 text-white border-purple-400 shadow-md ring-2 ring-purple-500/30 animate-pulse"
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

      {/* 5 Specialized Internal Engines Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Engine 1 */}
        <Card className="p-3.5 border bg-card shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">1. Observation Intake</span>
            <Badge variant="outline" className="text-[9px] text-emerald-400 border-emerald-500/30">Active</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Intake queue loaded {mission.observations.length} observation markers for prioritize analysis.
          </p>
        </Card>

        {/* Engine 2 */}
        <Card className="p-3.5 border bg-card shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">2. Classification</span>
            <Badge className="bg-purple-500/20 text-purple-300 text-[9px]">YOLO v8 Nano</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Leaf Rust (Puccinia) identified with 96% AI vision confidence.
          </p>
        </Card>

        {/* Engine 3 */}
        <Card className="p-3.5 border bg-card shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">3. Severity Assessment</span>
            <Badge variant="outline" className="text-[9px] text-red-400 border-red-500/30">High Severity</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Affected Area: 12.3% (0.3 Acres), Crop Stress: Moderate.
          </p>
        </Card>

        {/* Engine 4 */}
        <Card className="p-3.5 border bg-card shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">4. Treatment Rec.</span>
            <Badge variant="outline" className="text-[9px] text-blue-400 border-blue-500/30">Spot Spray</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Formulated Copper Oxychloride 50% WP 5% micro-dosage map.
          </p>
        </Card>

        {/* Engine 5 */}
        <Card className="p-3.5 border bg-card shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">5. Intelligence Conf.</span>
            <Badge className="bg-emerald-500/20 text-emerald-300 text-[9px]">96% Score</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Image Quality 98%, Prediction Stability 95%, Consistency 97%.
          </p>
        </Card>
      </div>

      {/* Main Interactive Studio View Tabs */}
      <Tabs defaultValue="overview" onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
        <TabsList className="bg-secondary/40 p-1 border">
          <TabsTrigger value="overview" className="text-xs">Finding Cards & Queue</TabsTrigger>
          <TabsTrigger value="heatmap" className="text-xs">Disease Heatmap</TabsTrigger>
          <TabsTrigger value="comparison" className="text-xs">Image Overlay Comparison</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs">Engineering Reports</TabsTrigger>
          <TabsTrigger value="sdg" className="text-xs">SDG 2 & 15 Sustainability</TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW & FINDINGS QUEUE */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Finding Cards List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Verified Crop Health Findings ({diseaseState.findings.length})
                </h3>
                <Badge variant="outline" className="font-mono text-xs">
                  NAMESPACE: mission.disease.findings
                </Badge>
              </div>

              <div className="space-y-4">
                {diseaseState.findings.map((finding: DiseaseFinding) => (
                  <Card
                    key={finding.id}
                    onClick={() => setSelectedFinding(finding)}
                    className={`p-4 border transition-all cursor-pointer space-y-3 ${
                      selectedFinding?.id === finding.id
                        ? "bg-purple-950/20 border-purple-500/60 shadow-md ring-1 ring-purple-500/30"
                        : "bg-card hover:bg-accent/40"
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-purple-400">{finding.id}</span>
                        <span className="text-xs text-muted-foreground font-mono">({finding.obsId})</span>
                        {getSeverityBadge(finding.severity)}
                      </div>
                      <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-xs font-mono">
                        CONFIDENCE: {finding.confidencePct}%
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                      <div className="h-24 rounded-lg bg-slate-900 border overflow-hidden relative">
                        <img
                          src={finding.originalImage}
                          alt={finding.diseaseName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-black/70 text-red-400 text-[9px] font-mono px-1.5 py-0.5 rounded">
                          HOTSPOT SCAN
                        </div>
                      </div>

                      <div className="sm:col-span-2 space-y-1.5 text-xs">
                        <div className="font-bold text-sm text-foreground">{finding.diseaseName}</div>
                        <div className="text-muted-foreground text-[11px]">Location: {finding.location}</div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div>
                            <span className="text-muted-foreground">Affected Area:</span>{" "}
                            <strong className="text-red-400">{finding.affectedAreaPct}%</strong>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Treatment:</span>{" "}
                            <strong className="text-blue-400">{finding.treatmentType}</strong>
                          </div>
                        </div>
                        <div className="p-2 rounded bg-slate-950/60 border border-slate-800 text-[11px]">
                          <span className="text-muted-foreground">Rec. Chemical:</span>{" "}
                          <span className="font-semibold text-slate-200">{finding.recommendedChemical}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Column: Findings Queue & Handover Status */}
            <div className="space-y-4">
              <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-semibold text-sm flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-400" />
                    Findings Queue
                  </h3>
                  <Badge variant="outline" className="text-[10px]">Robotics Pipeline</Badge>
                </div>

                <div className="space-y-2 text-xs">
                  {diseaseState.findings.map((f: DiseaseFinding) => (
                    <div key={f.id} className="p-2.5 rounded-lg border bg-slate-950/40 space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className="font-bold text-emerald-400">{f.obsId} &rarr; {f.diseaseName}</span>
                        <span className="text-purple-400 font-bold">{f.confidencePct}%</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Severity: {f.severity}</span>
                        <Badge variant="outline" className="text-[9px] text-amber-400 border-amber-500/30">
                          {f.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t text-[11px] text-muted-foreground space-y-1">
                  <div className="font-semibold text-foreground">Pipeline Handover Ready:</div>
                  <p className="leading-snug">
                    Findings queue handed cleanly to Spray Commander for targeted 5% spot spraying.
                  </p>
                </div>
              </Card>

              {/* Confidence Box */}
              <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-semibold text-sm text-foreground">Intelligence Confidence</h3>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-xs font-mono">96% SCORE</Badge>
                </div>

                <div className="space-y-2 text-xs">
                  {diseaseState.confidence.checkmarks.map((chk: { label: string; done: boolean }, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{chk.label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: DISEASE HEATMAP */}
        <TabsContent value="heatmap" className="space-y-4">
          <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-semibold text-sm">Field Infection & Risk Heatmap</h3>
                <p className="text-xs text-muted-foreground">
                  Multi-spectral infection risk distribution generated by Severity Assessment Engine.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500" /> Healthy</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/40 border border-amber-500" /> Low Risk</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/40 border border-red-500 animate-pulse" /> High Risk</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {diseaseState.heatmap.map((zone: HeatmapZone) => (
                <div
                  key={zone.zoneId}
                  className={`p-4 rounded-xl border space-y-2 ${
                    zone.riskLevel === "High Risk"
                      ? "bg-red-950/20 border-red-500/40 shadow-sm"
                      : zone.riskLevel === "Low Risk"
                      ? "bg-amber-950/20 border-amber-500/40"
                      : "bg-emerald-950/20 border-emerald-500/30"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-mono font-bold">
                    <span>{zone.name}</span>
                    <Badge variant="outline" className="text-[10px]">
                      Score: {zone.riskScore}/100
                    </Badge>
                  </div>
                  <div className="text-sm font-bold text-foreground">{zone.riskLevel}</div>
                  <div className="text-xs text-muted-foreground">Parcel Area: {zone.areaAcres} Acres</div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* TAB 3: IMAGE OVERLAY COMPARISON */}
        <TabsContent value="comparison" className="space-y-4">
          {selectedFinding && (
            <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-semibold text-sm">
                    Image Overlay Comparison — {selectedFinding.id} ({selectedFinding.diseaseName})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Original RGB/NIR image vs AI bounding box overlay vs highlighted infection region.
                  </p>
                </div>

                {/* Mode Selector */}
                <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg text-xs">
                  <button
                    onClick={() => setImageMode("original")}
                    className={`px-2.5 py-1 rounded text-xs transition-all ${
                      imageMode === "original" ? "bg-purple-600 text-white font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    Original
                  </button>
                  <button
                    onClick={() => setImageMode("ai_overlay")}
                    className={`px-2.5 py-1 rounded text-xs transition-all ${
                      imageMode === "ai_overlay" ? "bg-purple-600 text-white font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    AI Overlay
                  </button>
                  <button
                    onClick={() => setImageMode("highlighted")}
                    className={`px-2.5 py-1 rounded text-xs transition-all ${
                      imageMode === "highlighted" ? "bg-purple-600 text-white font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    Highlighted Disease
                  </button>
                </div>
              </div>

              <div className="relative h-64 md:h-80 rounded-xl bg-slate-950 border overflow-hidden flex items-center justify-center p-4">
                <img
                  src={selectedFinding.originalImage}
                  alt="Inspection comparison"
                  className="w-full h-full object-cover rounded-lg"
                />

                {/* Bounding box simulation if AI Overlay or Highlighted */}
                {imageMode !== "original" && (
                  <div className="absolute inset-12 border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] rounded-lg flex items-start p-2 bg-red-500/10">
                    <Badge className="bg-red-600 text-white font-mono text-xs">
                      YOLO CONFIDENCE: {selectedFinding.confidencePct}% — LEAF RUST
                    </Badge>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-secondary/40 border">
                  <div className="text-muted-foreground">Original Image</div>
                  <div className="font-semibold text-foreground">High-Resolution RGB + NIR Canopy</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/40 border">
                  <div className="text-muted-foreground">AI Overlay</div>
                  <div className="font-semibold text-purple-400">Puccinia Fungal Spore Bounding Box</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/40 border">
                  <div className="text-muted-foreground">Highlighted Region</div>
                  <div className="font-semibold text-red-400">0.3 Acres Affected Zone (5% Spot Spray Target)</div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* TAB 4: ENGINEERING REPORTS */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 border-b pb-1">
                Disease Analysis Report
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {diseaseState.reports.diseaseAnalysisReport}
              </p>
            </Card>

            <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-red-400 border-b pb-1">
                Severity Assessment Report
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {diseaseState.reports.severityReport}
              </p>
            </Card>

            <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 border-b pb-1">
                Intelligence Confidence Report
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {diseaseState.reports.confidenceReport}
              </p>
            </Card>

            <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-blue-400 border-b pb-1">
                Treatment Recommendation Report
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {diseaseState.reports.recommendationReport}
              </p>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 5: SDG 2 & 15 SUSTAINABILITY */}
        <TabsContent value="sdg" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 border bg-gradient-to-br from-emerald-950/30 via-slate-900/40 to-slate-950 shadow-sm rounded-xl space-y-3">
              <div className="flex items-center space-x-2 border-b border-emerald-500/20 pb-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-sm text-foreground">
                  {diseaseState.sustainability.primarySdg.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {diseaseState.sustainability.primarySdg.description}
              </p>
              <div className="pt-2 text-xl font-bold text-emerald-400 font-mono">
                {diseaseState.sustainability.estimatedCropProtectedPct}% Crop Yield Protected
              </div>
            </Card>

            <Card className="p-5 border bg-gradient-to-br from-blue-950/30 via-slate-900/40 to-slate-950 shadow-sm rounded-xl space-y-3">
              <div className="flex items-center space-x-2 border-b border-blue-500/20 pb-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-sm text-foreground">
                  {diseaseState.sustainability.supportingSdg.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {diseaseState.sustainability.supportingSdg.description}
              </p>
              <div className="pt-2 text-xl font-bold text-blue-400 font-mono">
                {diseaseState.sustainability.estimatedChemicalReductionPct}% Chemical Reduction
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

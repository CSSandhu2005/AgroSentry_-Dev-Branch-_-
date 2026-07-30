"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LiveDrone3DVisualizer } from "@/components/autonomous/mission-control/LiveDrone3DVisualizer";
import {
  createInitialMissionState,
  MissionStage,
  GridCell,
  MissionState,
} from "@/lib/agents/shared-mission-state";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Droplets,
  CloudOff,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  AlertTriangle,
  Leaf,
  Navigation,
} from "lucide-react";

export function UnifiedMissionPipelineCanvas() {
  const [mission, setMission] = useState<MissionState>(createInitialMissionState());
  const [activeStage, setActiveStage] = useState<MissionStage>("Scout");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);
  const [sliderPos, setSliderPos] = useState(50); // Before/After slider

  // Automated Grid Scanning Animation for Scout Stage
  useEffect(() => {
    if (activeStage !== "Scout" || !isScanning) return;

    const interval = setInterval(() => {
      setMission((prev) => {
        const nextUnscannedIndex = prev.cells.findIndex((c) => !c.scanned);
        if (nextUnscannedIndex === -1) {
          setIsScanning(false);
          return { ...prev, coveragePct: 100 };
        }

        const newCells = [...prev.cells];
        newCells[nextUnscannedIndex] = { ...newCells[nextUnscannedIndex], scanned: true };
        const scannedCount = newCells.filter((c) => c.scanned).length;
        const coveragePct = Math.round((scannedCount / newCells.length) * 100);

        return {
          ...prev,
          cells: newCells,
          coveragePct,
          activeDroneWp: nextUnscannedIndex + 1,
        };
      });
    }, 400);

    return () => clearInterval(interval);
  }, [activeStage, isScanning]);

  const stages: { stage: MissionStage; label: string; icon: string }[] = [
    { stage: "Scout", label: "1. Precision Scout", icon: "🛰️" },
    { stage: "Disease", label: "2. Disease Detection", icon: "🌿" },
    { stage: "Spray", label: "3. Targeted Spray", icon: "🚁" },
    { stage: "Verification", label: "4. Verification", icon: "✅" },
    { stage: "SDG", label: "5. SDG Impact", icon: "🌍" },
  ];

  const handleCellClick = (cell: GridCell) => {
    if (cell.status === "infected" || cell.status === "sprayed") {
      setSelectedCell(cell);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Telemetry 3D Drone Visualizer */}
      <LiveDrone3DVisualizer isSpraying={activeStage === "Spray"} stage={activeStage} />

      {/* 5-Stage Stepper Header */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border p-2 rounded-xl bg-card shadow-sm">
        {stages.map((s) => {
          const isActive = activeStage === s.stage;
          return (
            <button
              key={s.stage}
              onClick={() => setActiveStage(s.stage)}
              className={`p-2.5 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-semibold shadow-xs"
                  : "bg-secondary/40 text-muted-foreground hover:bg-accent"
              }`}
            >
              <span className="text-base">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* STAGE 1 — PRECISION SCOUT CANVAS */}
      {activeStage === "Scout" && (
        <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-semibold text-sm">Autonomous Scout Grid Scanning</h3>
              <p className="text-xs text-muted-foreground">
                Drone sweeps field grid; unscanned cells become green. Renders zone infection probability.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setIsScanning(!isScanning)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
              >
                {isScanning ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                {isScanning ? "Pause Scan" : "Run Scout Mission"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMission(createInitialMissionState())}
                className="text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Grid Canvas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span>COVERAGE: <strong className="text-emerald-500">{mission.coveragePct}%</strong></span>
              <span>ACTIVE WAYPOINT: <strong className="text-emerald-500">WP-{mission.activeDroneWp}</strong></span>
            </div>

            <div className="grid grid-cols-6 gap-2 bg-slate-950 p-4 rounded-xl border relative shadow-inner">
              {mission.cells.map((cell) => {
                const isDroneHere = cell.id === mission.activeDroneWp && isScanning;
                return (
                  <div
                    key={cell.id}
                    className={`h-16 rounded-lg border flex items-center justify-center relative transition-all duration-300 text-xs font-mono font-bold ${
                      !cell.scanned
                        ? "bg-slate-900 border-slate-800 text-slate-600"
                        : cell.status === "infected"
                        ? "bg-red-500/20 border-red-500/50 text-red-400"
                        : "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                    }`}
                  >
                    {isDroneHere && (
                      <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/30 rounded-lg animate-pulse">
                        <Navigation className="w-5 h-5 text-emerald-300 animate-spin" />
                      </div>
                    )}
                    <span>{cell.scanned ? (cell.status === "infected" ? "■ RED" : "■ SCAN") : "□"}</span>
                  </div>
                );
              })}
            </div>

            {/* Zone Infection Probability */}
            <div className="grid grid-cols-3 gap-3 text-xs pt-2">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-muted-foreground">Zone A Risk</div>
                <div className="font-bold text-emerald-500 text-sm">{mission.zoneRisk.zoneA}% (Low)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-muted-foreground">Zone B Risk</div>
                <div className="font-bold text-red-500 text-sm">{mission.zoneRisk.zoneB}% (Infected)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-muted-foreground">Zone C Risk</div>
                <div className="font-bold text-emerald-500 text-sm">{mission.zoneRisk.zoneC}% (Low)</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* STAGE 2 — DISEASE DETECTION & HOTSPOT POPUP */}
      {activeStage === "Disease" && (
        <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-semibold text-sm">Pathogen Diagnosis & Hotspot Analysis</h3>
              <p className="text-xs text-muted-foreground">
                Reuses Scout scan data. Click red heat spots to inspect leaf pathogen sample & advice.
              </p>
            </div>
            <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">
              Leaf Rust Detected
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 grid grid-cols-6 gap-2 bg-slate-950 p-4 rounded-xl border">
              {mission.cells.map((cell) => (
                <button
                  key={cell.id}
                  onClick={() => handleCellClick(cell)}
                  className={`h-16 rounded-lg border flex flex-col items-center justify-center text-xs font-mono transition-all ${
                    cell.status === "infected"
                      ? "bg-red-500/30 border-red-500 text-red-400 animate-pulse hover:scale-105 cursor-pointer"
                      : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400 opacity-60"
                  }`}
                >
                  <span>{cell.status === "infected" ? "🔥 HOT" : "✓ OK"}</span>
                  {cell.status === "infected" && <span className="text-[9px]">Click Leaf</span>}
                </button>
              ))}
            </div>

            {/* Disease Summary Side Panel */}
            <div className="p-4 rounded-xl bg-secondary/40 border space-y-3 text-xs">
              <div className="font-semibold border-b pb-2 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Pathogen Summary
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Detected Pathogen:</span>
                <div className="font-bold text-foreground">{mission.detectedDisease?.name}</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Confidence Score:</span>
                <div className="font-bold text-emerald-500">{mission.detectedDisease?.confidence}%</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Affected Farm Area:</span>
                <div className="font-bold text-red-500">{mission.detectedDisease?.affectedAreaPct}% (0.3 Acres)</div>
              </div>
              <Button
                onClick={() => setActiveStage("Spray")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs mt-2"
              >
                Proceed to Targeted Spray <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* STAGE 3 — TARGETED SPRAY COMMANDER */}
      {activeStage === "Spray" && (
        <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-semibold text-sm">Targeted 5% Spot Spraying Execution</h3>
              <p className="text-xs text-muted-foreground">
                Sprayer activates blue mist ONLY over infected cells (`██`), avoiding 94.5% non-target crop.
              </p>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 text-xs">
              Blue Mist Active
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 grid grid-cols-6 gap-2 bg-slate-950 p-4 rounded-xl border">
              {mission.cells.map((cell) => (
                <div
                  key={cell.id}
                  className={`h-16 rounded-lg border flex flex-col items-center justify-center text-xs font-mono relative overflow-hidden ${
                    cell.status === "infected"
                      ? "bg-blue-500/30 border-blue-500 text-blue-300 ring-2 ring-blue-400"
                      : "bg-emerald-500/10 border-slate-800 text-slate-500"
                  }`}
                >
                  {cell.status === "infected" && (
                    <div className="absolute inset-0 bg-blue-500/20 animate-pulse flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-blue-400 animate-bounce" />
                    </div>
                  )}
                  <span className="relative z-10">{cell.status === "infected" ? "SPRAY 5%" : "NO SPRAY"}</span>
                </div>
              ))}
            </div>

            {/* Live Savings Counter */}
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-3 text-xs">
              <h4 className="font-semibold text-emerald-500 text-sm border-b pb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Live Savings Ticker
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chemical Saved:</span>
                  <span className="font-bold text-emerald-500 text-base">{mission.sprayStats.chemicalSavedPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Water Saved:</span>
                  <span className="font-bold text-blue-500 text-base">{mission.sprayStats.waterSavedL} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flight Time Saved:</span>
                  <span className="font-bold text-indigo-500 text-base">{mission.sprayStats.timeSavedPct}%</span>
                </div>
              </div>
              <Button
                onClick={() => setActiveStage("Verification")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs mt-2"
              >
                Launch Verification Flight <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* STAGE 4 — VERIFICATION RETURN FLIGHT & BEFORE/AFTER SLIDER */}
      {activeStage === "Verification" && (
        <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-semibold text-sm">Post-Treatment Verification Flight</h3>
              <p className="text-xs text-muted-foreground">
                Drone sweeps sprayed zones. Use slider to compare initial infection against post-treatment recovery.
              </p>
            </div>
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
              87% Recovery Audit
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Interactive Before / After Slider View */}
            <div className="relative w-full h-48 rounded-xl bg-slate-950 border overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 flex items-center justify-around text-center text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-red-400 font-bold text-base">BEFORE SPRAY</span>
                  <div className="text-red-500">Infection: 4.8% (Leaf Rust)</div>
                </div>
                <div className="space-y-1">
                  <span className="text-emerald-400 font-bold text-base">AFTER VERIFICATION</span>
                  <div className="text-emerald-400">Recovery: 87% Verified</div>
                </div>
              </div>

              {/* Slider Line Divider */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981] z-20 cursor-ew-resize"
                style={{ left: `${sliderPos}%` }}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Before (Infected)</span>
                <span>Interactive Comparison Slider ({sliderPos}%)</span>
                <span>After (Recovered)</span>
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
      )}

      {/* STAGE 5 — SDG IMPACT ENGINE & PDF EXPORT */}
      {activeStage === "SDG" && (
        <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-semibold text-sm">SDG Impact Quantification Engine</h3>
              <p className="text-xs text-muted-foreground">
                Quantified sustainability achievements for SDGs 2, 6, 12, 13, and 15.
              </p>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 text-xs">
              SDG Score: 94/100
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="text-xs text-muted-foreground">Pesticide Saved</div>
              <div className="text-2xl font-bold text-emerald-500">{mission.sdgMetrics.chemicalSavedPct}%</div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1">
              <div className="text-xs text-muted-foreground">Water Saved</div>
              <div className="text-2xl font-bold text-blue-500">{mission.sdgMetrics.waterSavedPct}%</div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
              <div className="text-xs text-muted-foreground">CO₂ Avoided</div>
              <div className="text-2xl font-bold text-indigo-500">{mission.sdgMetrics.co2AvoidedKg} kg</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <div className="text-xs text-muted-foreground">Labour Saved</div>
              <div className="text-2xl font-bold text-amber-500">{mission.sdgMetrics.labourSavedHrs} Hours</div>
            </div>
          </div>

          {/* Glowing SDG Badges */}
          <div className="pt-2 border-t space-y-2 text-xs">
            <span className="font-semibold text-muted-foreground">Verified SDG Contributions:</span>
            <div className="flex flex-wrap gap-2">
              {mission.sdgMetrics.sdgBadges.map((sdg) => (
                <Badge
                  key={sdg}
                  className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)] text-xs px-3 py-1"
                >
                  ✨ SDG {sdg} Achieved
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* DIALOG POPUP FOR LEAF PATHOGEN INSPECTION */}
      <Dialog open={!!selectedCell} onOpenChange={() => setSelectedCell(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Eye className="w-5 h-5 text-red-500" />
              Hotspot Leaf Pathogen Scan (Cell #{selectedCell?.id})
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Multispectral leaf inspection data captured by Precision Scout Agent.
            </DialogDescription>
          </DialogHeader>

          {selectedCell && (
            <div className="space-y-4 text-xs">
              <div className="h-40 rounded-xl overflow-hidden border bg-muted relative">
                <img
                  src={selectedCell.leafImageUrl}
                  alt="Leaf Rust Sample"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/90 text-red-400 px-2 py-0.5 rounded font-mono text-[10px]">
                  CONFIDENCE: {selectedCell.confidence}%
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-foreground">Diagnosis: {selectedCell.diseaseName}</div>
                <p className="text-muted-foreground leading-relaxed">
                  Puccinia leaf rust infection identified on cotton canopy. Spot treatment recommended.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => setSelectedCell(null)} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                  Close Inspection
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

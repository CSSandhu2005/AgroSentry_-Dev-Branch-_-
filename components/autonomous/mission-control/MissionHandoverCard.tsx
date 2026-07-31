"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowDown, Bot, Sparkles, ShieldCheck } from "lucide-react";
import { MissionStage } from "@/lib/agents/shared-mission-state";

interface HandoverDetail {
  fromAgent: string;
  fromStatus: string;
  toAgent: string;
  toStatus: string;
  items: string[];
  finalStatus: string;
}

const HANDOVER_MAP: Record<string, HandoverDetail> = {
  "Planner->Scout": {
    fromAgent: "Planner Agent",
    fromStatus: "Mission Approved",
    toAgent: "Scout Agent",
    toStatus: "Receiving Mission...",
    items: [
      "Flight Plan (Boustrophedon Sweep)",
      "Waypoints (24 Grid Nodes)",
      "Camera Profile (RGB + NIR Multispectral)",
      "Mission Constraints (Wind < 15km/h, Battery > 30%)",
    ],
    finalStatus: "Mission Accepted",
  },
  "Scout->Disease": {
    fromAgent: "Scout Agent",
    fromStatus: "Sweep Complete (3 Observations Discovered)",
    toAgent: "Disease Agent",
    toStatus: "Receiving Observations...",
    items: [
      "Observation Queue (OBS-01, OBS-02, OBS-03)",
      "Multispectral NDVI Canopy Imagery",
      "High-Precision RTK Coordinates",
      "Field Infection Anomaly Scores",
    ],
    finalStatus: "Observation Queue Consumed",
  },
  "Disease->Spray": {
    fromAgent: "Disease Agent",
    fromStatus: "Pathogen Diagnosed (Leaf Rust 96%)",
    toAgent: "Spray Commander",
    toStatus: "Receiving Prescription Map...",
    items: [
      "Targeted Micro-Dosage Coordinates (0.3 acres)",
      "Chemical Dosage (Copper Oxychloride 50% WP)",
      "Nozzle Flow & Pressure Profile",
      "Eco-Boundary Drift Safety Limits",
    ],
    finalStatus: "Precision Sprayer Armed",
  },
  "Spray->Verification": {
    fromAgent: "Spray Commander",
    fromStatus: "5% Targeted Spray Complete (95% Savings)",
    toAgent: "Verification Agent",
    toStatus: "Receiving Inspection Protocol...",
    items: [
      "Post-Treatment Micro-Zone Coordinates",
      "Chemical Application Telemetry",
      "Recovery Delta Baseline",
      "Verification Pass Flight Plan",
    ],
    finalStatus: "Verification Scan Active",
  },
  "Verification->SDG": {
    fromAgent: "Verification Agent",
    fromStatus: "87% Recovery Rate Verified",
    toAgent: "SDG Impact Engine",
    toStatus: "Synthesizing Sustainability Metrics...",
    items: [
      "Resource Savings (420L Water Conserved)",
      "Chemical Reduction Ledger (95% Cut)",
      "CO2 Avoidance Audit (18.4 kg CO2e)",
      "SDG Objectives Audit (SDG 2, 6, 12, 13, 15)",
    ],
    finalStatus: "SDG Ledger Locked",
  },
};

interface MissionHandoverCardProps {
  currentStage: MissionStage;
  onDismiss?: () => void;
}

export function MissionHandoverCard({ currentStage, onDismiss }: MissionHandoverCardProps) {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [isAccepted, setIsAccepted] = useState(false);

  // Determine active handover based on current stage
  let key = "Planner->Scout";
  if (currentStage === "Disease") key = "Scout->Disease";
  if (currentStage === "Spray") key = "Disease->Spray";
  if (currentStage === "Verification") key = "Spray->Verification";
  if (currentStage === "SDG" || currentStage === "Replay") key = "Verification->SDG";

  const handover = HANDOVER_MAP[key] || HANDOVER_MAP["Planner->Scout"];

  // Simulate progressive checklist checkmarks
  useEffect(() => {
    setCheckedItems([]);
    setIsAccepted(false);

    const timers: NodeJS.Timeout[] = [];
    handover.items.forEach((_, idx) => {
      const t = setTimeout(() => {
        setCheckedItems((prev) => [...prev, idx]);
      }, (idx + 1) * 350);
      timers.push(t);
    });

    const finalT = setTimeout(() => {
      setIsAccepted(true);
    }, (handover.items.length + 1) * 350);
    timers.push(finalT);

    return () => timers.forEach(clearTimeout);
  }, [key]);

  return (
    <Card className="p-4 border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-slate-900/40 to-slate-950 shadow-lg rounded-xl space-y-3 relative overflow-hidden">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-emerald-400 to-blue-500 animate-pulse" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px]">
            <Sparkles className="w-3 h-3 mr-1 text-purple-400 animate-spin" />
            AGENT HANDOVER PROTOCOL
          </Badge>
          <span className="text-[11px] font-mono text-muted-foreground">AGS-PIPE-LINK</span>
        </div>

        {onDismiss && (
          <Button variant="ghost" size="xs" onClick={onDismiss} className="text-[10px] h-6 text-muted-foreground hover:text-foreground">
            Dismiss
          </Button>
        )}
      </div>

      {/* Handover Diagram Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center pt-1">
        {/* Source Agent Card */}
        <div className="p-3 rounded-lg border bg-slate-900/60 border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            {handover.fromAgent}
          </div>
          <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
            ✓ {handover.fromStatus}
          </Badge>
        </div>

        {/* Transition Arrow Indicator */}
        <div className="flex flex-col items-center justify-center text-center space-y-1 py-1">
          <span className="text-[10px] font-mono text-purple-400 font-medium animate-pulse">
            Handing Mission Work
          </span>
          <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-sm animate-bounce">
            <ArrowDown className="w-4 h-4 md:-rotate-90" />
          </div>
        </div>

        {/* Destination Agent Card */}
        <div className="p-3 rounded-lg border bg-slate-900/60 border-purple-500/30 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300">
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            {handover.toAgent}
          </div>
          <Badge variant="outline" className="text-[10px] text-purple-300 border-purple-500/40 bg-purple-500/10">
            {handover.toStatus}
          </Badge>
        </div>
      </div>

      {/* Checklist Transfer Details */}
      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
          <span>Handoff Data Package Checklist:</span>
          {isAccepted ? (
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> {handover.finalStatus}
            </span>
          ) : (
            <span className="text-purple-400 font-mono text-[10px] animate-pulse">Verifying Manifest...</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
          {handover.items.map((item, idx) => {
            const isChecked = checkedItems.includes(idx);
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 text-xs p-1.5 rounded transition-all duration-300 ${
                  isChecked
                    ? "text-emerald-300 bg-emerald-950/20 font-medium"
                    : "text-slate-500 bg-slate-900/30 opacity-60"
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    isChecked ? "text-emerald-400" : "text-slate-600"
                  }`}
                />
                <span className="text-[11px] truncate">{item}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

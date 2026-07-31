"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, ShieldCheck, Sparkles, TrendingUp, Droplets, Zap, ArrowDown } from "lucide-react";
import { SdgLiveEvent } from "@/lib/agents/shared-mission-state";

interface LiveSdgStoryWidgetProps {
  coveragePct: number;
  events?: SdgLiveEvent[];
  chemicalSavedPct?: number;
  waterSavedL?: number;
}

export function LiveSdgStoryWidget({
  coveragePct,
  events = [],
  chemicalSavedPct = 95,
  waterSavedL = 420,
}: LiveSdgStoryWidgetProps) {
  // Generate dynamic live story milestones based on coverage & execution
  const activeMilestones = [
    {
      metric: `Coverage ${coveragePct}%`,
      arrow: "↓",
      sdgCode: 2,
      sdgTitle: "SDG 2: Zero Hunger",
      detail: "Monitoring crop health & early pathogen detection across 5.5 acres.",
      active: coveragePct >= 15,
    },
    {
      metric: "Battery Saved +3.2%",
      arrow: "↓",
      sdgCode: 13,
      sdgTitle: "SDG 13: Climate Action",
      detail: "Optimized autonomous path planning minimizes drone energy footprint.",
      active: coveragePct >= 50,
    },
    {
      metric: "Coverage Efficiency 99%",
      arrow: "↓",
      sdgCode: 12,
      sdgTitle: "SDG 12: Responsible Consumption",
      detail: "No redundant scanning; zero unnecessary battery discharge.",
      active: coveragePct >= 90,
    },
    {
      metric: `Chemical Saved ${chemicalSavedPct}%`,
      arrow: "↓",
      sdgCode: 6,
      sdgTitle: "SDG 6: Clean Water & Sanitation",
      detail: `Conserved ${waterSavedL}L of agricultural water via 5% micro-dosage spot spraying.`,
      active: coveragePct >= 100,
    },
  ];

  return (
    <Card className="p-4 border bg-gradient-to-br from-emerald-950/30 via-slate-900/40 to-slate-950 shadow-sm rounded-xl space-y-3">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
        <div className="flex items-center space-x-2">
          <Leaf className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-sm text-foreground">Live Sustainability Evolution</h3>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />
          LIVE SDG FEED
        </Badge>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Watch UN Sustainable Development Goals update in real-time as the drone executes flight waypoints.
      </p>

      {/* Dynamic Milestones Stack */}
      <div className="space-y-2.5 pt-1">
        {activeMilestones.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border transition-all duration-300 space-y-1.5 ${
              item.active
                ? "bg-slate-900/70 border-emerald-500/40 shadow-sm text-slate-100"
                : "bg-slate-950/30 border-slate-800/50 opacity-40 text-slate-500"
            }`}
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                {item.metric}
                <span className="text-slate-400 font-sans">{item.arrow}</span>
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  item.active
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40 font-bold"
                    : "text-slate-600 border-slate-800"
                }`}
              >
                {item.sdgTitle}
              </Badge>
            </div>

            <div className="text-[11px] text-muted-foreground leading-snug">
              {item.detail}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

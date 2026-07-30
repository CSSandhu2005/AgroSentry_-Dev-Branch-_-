"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaypointMapCanvas } from "@/components/autonomous/mission-control/WaypointMapCanvas";
import { Play, Pause, RotateCcw, Sparkles, CheckCircle2 } from "lucide-react";

export default function MissionReplayPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between p-5 rounded-2xl bg-card border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">Replay Engine</Badge>
            <span className="text-xs font-mono text-muted-foreground">Historical Telemetry Playback</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Interactive Mission Replay</h1>
          <p className="text-xs text-muted-foreground">
            Replay completed drone flight paths, agent handoffs, sprayer activations, and telemetry step-by-step.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setIsPlaying(!isPlaying)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
            {isPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
            {isPlaying ? "Pause Replay" : "Start Replay"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <WaypointMapCanvas />
        </div>

        <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-semibold text-sm">Mission MSN-2026-042 Log</h3>
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">Verified</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-secondary/50 space-y-1">
              <div className="font-semibold text-foreground">Scout Flight Completed</div>
              <p className="text-muted-foreground">Grid scan at 18.5m altitude. Identified 0.3 acre blight spot.</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="font-semibold text-emerald-500">Targeted Spray Executed</div>
              <p className="text-muted-foreground">Sprayed Sector B with 95% chemical savings vs broad spray.</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-1">
              <div className="font-semibold text-blue-500">Verification Flight Passed</div>
              <p className="text-muted-foreground">Post-treatment return sweep confirmed pathogen suppression.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

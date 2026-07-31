"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UnifiedMissionPipelineCanvas } from "@/components/autonomous/mission-control/UnifiedMissionPipelineCanvas";
import { MissionTimelineWidget } from "@/components/autonomous/mission-control/MissionTimelineWidget";
import { DroneTelemetryCard } from "@/components/autonomous/widgets/DroneTelemetryCard";
import { SdgMetricCard } from "@/components/autonomous/widgets/SdgMetricCard";
import { Play, ShieldAlert, Sparkles, ShieldCheck } from "lucide-react";

export default function MissionControlPage() {
  const [missionState, setMissionState] = useState<"Executing" | "Paused" | "Verified">("Executing");

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Control Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl bg-card border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5" />
              MISSION CONTROL CENTER
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">STATE: EXECUTING</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Mission Control Center — MSN-2026-042</h1>
          <p className="text-xs text-muted-foreground">
            Target Parcel: <span className="font-medium text-foreground">Sector B — Cotton Parcel (5.5 Acres)</span> | Command Link: <span className="font-medium text-emerald-400">High-Frequency 3D RTK</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {missionState === "Executing" ? (
            <Button variant="outline" size="sm" onClick={() => setMissionState("Paused")} className="text-xs">
              Pause Mission
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setMissionState("Executing")} className="text-xs">
              <Play className="w-3.5 h-3.5 mr-1" /> Resume Mission
            </Button>
          )}

          <Button variant="destructive" size="sm" className="text-xs">
            <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Emergency Abort (RTL)
          </Button>
        </div>
      </div>

      {/* Main 7-Stage Pipeline Canvas & Side Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: 7-Stage Shared Mission Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <UnifiedMissionPipelineCanvas />
        </div>

        {/* Right Column: Telemetry & State Timeline */}
        <div className="space-y-6">
          <DroneTelemetryCard
            batteryPct={84}
            altitudeM={18.5}
            speedKmh={12.4}
            windSpeedKmh={8.2}
            gpsFix="3D RTK"
            piStatus="Connected"
            sprayerState="Active"
          />

          <SdgMetricCard
            chemicalSavedPct={95}
            waterSavedL={420}
            co2AvoidedKg={18.4}
            costSavedInr={3450}
            sdgBadges={[2, 6, 12, 13, 15]}
          />

          <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl">
            <MissionTimelineWidget />
          </Card>
        </div>
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaypointMapCanvas } from "@/components/autonomous/mission-control/WaypointMapCanvas";
import { MissionTimelineWidget } from "@/components/autonomous/mission-control/MissionTimelineWidget";
import { MissionStatusCard } from "@/components/autonomous/widgets/MissionStatusCard";
import { DroneTelemetryCard } from "@/components/autonomous/widgets/DroneTelemetryCard";
import { SdgMetricCard } from "@/components/autonomous/widgets/SdgMetricCard";
import { Play, ShieldAlert, RotateCcw, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

export default function MissionControlPage() {
  const [missionState, setMissionState] = useState<"Executing" | "Paused" | "Verified">("Executing");

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Control Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl bg-card border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5" />
              HERO MISSION CONTROL
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">STATE: EXECUTING</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">MSN-2026-042: Targeted Spray & Verification</h1>
          <p className="text-xs text-muted-foreground">
            Target Parcel: <span className="font-medium text-foreground">Sector B — Cotton Parcel (5.5 Acres)</span> | Mission Executor: <span className="font-medium text-emerald-500">Autonomous Drone #1 (RTK)</span>
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

          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Trigger Verification
          </Button>
        </div>
      </div>

      {/* Main Mission Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Flight Map Canvas & Active Agent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Waypoint Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-tight">Real-Time Waypoint Telemetry Canvas</h3>
              <span className="text-xs font-mono text-emerald-500">Live Spatial Sync: 60Hz</span>
            </div>
            <WaypointMapCanvas />
          </div>

          {/* Active Agent Pipeline Trace */}
          <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <h3 className="font-semibold text-sm">Active Agent Intelligence Pipeline</h3>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                5 Agents Active
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-secondary/40 space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-emerald-500">1. Precision Scout Agent</span>
                  <span className="text-muted-foreground">Confidence 98%</span>
                </div>
                <p className="text-muted-foreground">Completed 42 sector image sweeps at 18.5m altitude.</p>
              </div>

              <div className="p-3 rounded-lg bg-secondary/40 space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-emerald-500">2. Disease Surveillance Agent</span>
                  <span className="text-muted-foreground">Confidence 94%</span>
                </div>
                <p className="text-muted-foreground">Pinpointed Leaf Blight in Sector B. Generated 0.3 acre spot polygon.</p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <div className="flex justify-between font-semibold text-emerald-500">
                  <span>3. Targeted Spray Commander</span>
                  <span className="animate-pulse">Active Now</span>
                </div>
                <p className="text-emerald-600 dark:text-emerald-400">Executing 5% spot spray. Avoiding 94.5% non-target crop.</p>
              </div>

              <div className="p-3 rounded-lg bg-secondary/40 space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">4. Verification Agent</span>
                  <span className="text-muted-foreground">Queued</span>
                </div>
                <p className="text-muted-foreground">Scheduled return sweep post-spray to confirm pathogen suppression.</p>
              </div>
            </div>
          </Card>
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

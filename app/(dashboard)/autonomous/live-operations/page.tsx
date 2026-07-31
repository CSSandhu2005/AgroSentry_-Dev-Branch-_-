"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { UnifiedMissionPipelineCanvas } from "@/components/autonomous/mission-control/UnifiedMissionPipelineCanvas";
import { DroneTelemetryCard } from "@/components/autonomous/widgets/DroneTelemetryCard";
import { SdgMetricCard } from "@/components/autonomous/widgets/SdgMetricCard";

export default function MissionControlCenterPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between p-5 rounded-2xl bg-card border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping mr-1.5" />
              MISSION CONTROL CENTER
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">3D RTK Precision Command</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Mission Control Center</h1>
          <p className="text-xs text-muted-foreground">
            Central execution hub: Real-time multi-agent pipeline, observation queue, live SDG evolution, and edge telemetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UnifiedMissionPipelineCanvas />
        </div>

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
        </div>
      </div>
    </div>
  );
}


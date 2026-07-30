"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WaypointMapCanvas } from "@/components/autonomous/mission-control/WaypointMapCanvas";
import { DroneTelemetryCard } from "@/components/autonomous/widgets/DroneTelemetryCard";
import { BatteryIndicator } from "@/components/autonomous/widgets/BatteryIndicator";
import { Activity, Wifi, Radio, Cpu, Camera } from "lucide-react";

export default function LiveOperationsPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between p-5 rounded-2xl bg-card border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">High-Frequency Link</Badge>
            <span className="text-xs font-mono text-muted-foreground">3D RTK Precision</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Live Operations & Telemetry</h1>
          <p className="text-xs text-muted-foreground">
            Real-time GPS lock, wind speed, spray nozzle status, and Raspberry Pi edge link monitoring.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <WaypointMapCanvas />

          <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-purple-500" />
                <h3 className="font-semibold text-sm">Multispectral Camera Stream Simulator</h3>
              </div>
              <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/20">
                1080p 60fps
              </Badge>
            </div>
            <div className="h-48 rounded-lg bg-slate-950 flex items-center justify-center border text-slate-400 text-xs font-mono relative overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-slate-200">LIVE FEED — SECTOR B</span>
              </div>
              <div className="text-center space-y-1">
                <Camera className="w-8 h-8 mx-auto text-slate-600 animate-bounce" />
                <div>RGB + NIR MULTISPECTRAL CAMERA ACTIVE</div>
                <div className="text-[10px] text-emerald-400">NDVI INDEX: 0.72 (HEALTHY CANOPY)</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <DroneTelemetryCard
            batteryPct={84}
            altitudeM={18.5}
            speedKmh={12.4}
            windSpeedKmh={8.2}
            gpsFix="3D RTK"
            piStatus="Connected"
            sprayerState="Active"
          />

          <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-3">
            <div className="flex items-center space-x-2 border-b pb-2">
              <Cpu className="w-4 h-4 text-purple-500" />
              <h3 className="font-semibold text-sm">Edge AI Hardware Status</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Raspberry Pi 4 Model B</span>
                <span className="font-medium text-emerald-500">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CPU Temperature</span>
                <span className="font-mono">42°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Local YOLO Model</span>
                <span className="font-mono">Inference 14ms</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

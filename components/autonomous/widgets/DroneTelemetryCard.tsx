"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Battery, Wifi, Navigation, Wind, ShieldAlert, Cpu } from "lucide-react";

export interface DroneTelemetryCardProps {
  batteryPct: number;
  altitudeM: number;
  speedKmh: number;
  windSpeedKmh: number;
  gpsFix: "3D RTK" | "GPS" | "No Fix";
  piStatus: "Connected" | "Offline";
  sprayerState: "Active" | "Idle" | "Blocked";
}

export function DroneTelemetryCard({
  batteryPct,
  altitudeM,
  speedKmh,
  windSpeedKmh,
  gpsFix,
  piStatus,
  sprayerState,
}: DroneTelemetryCardProps) {
  return (
    <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-emerald-500 animate-pulse" />
          <span className="font-semibold text-sm tracking-wide uppercase">Drone Telemetry</span>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          RTK ONLINE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center space-x-2.5 p-2 rounded-lg bg-secondary/50">
          <Battery className="w-4 h-4 text-emerald-500" />
          <div>
            <div className="text-muted-foreground">Battery</div>
            <div className="font-bold text-sm">{batteryPct}%</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 p-2 rounded-lg bg-secondary/50">
          <Wind className="w-4 h-4 text-blue-500" />
          <div>
            <div className="text-muted-foreground">Wind Speed</div>
            <div className="font-bold text-sm">{windSpeedKmh} km/h</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 p-2 rounded-lg bg-secondary/50">
          <Wifi className="w-4 h-4 text-amber-500" />
          <div>
            <div className="text-muted-foreground">GPS Fix</div>
            <div className="font-bold text-sm">{gpsFix}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 p-2 rounded-lg bg-secondary/50">
          <Cpu className="w-4 h-4 text-purple-500" />
          <div>
            <div className="text-muted-foreground">Raspberry Pi</div>
            <div className="font-bold text-sm">{piStatus}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-muted-foreground">Sprayer Controller:</span>
        <span
          className={`font-semibold px-2 py-0.5 rounded ${
            sprayerState === "Active"
              ? "bg-emerald-500/20 text-emerald-500"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {sprayerState}
        </span>
      </div>
    </Card>
  );
}

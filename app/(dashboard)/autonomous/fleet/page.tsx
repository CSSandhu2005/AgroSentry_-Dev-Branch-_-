"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation, Battery, Cpu, Wifi, ShieldCheck, Wrench } from "lucide-react";

export default function FleetPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between p-5 rounded-2xl bg-card border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Fleet Health</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Drone Fleet & Hardware Profiles</h1>
          <p className="text-xs text-muted-foreground">
            Hardware diagnostics, battery health cycles, sensor calibration, and firmware versions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-emerald-500" />
              <div>
                <h3 className="font-semibold text-sm">AgroSentry Drone Alpha #1</h3>
                <span className="text-[11px] text-muted-foreground font-mono">SN: AS-DRN-2026-X1</span>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">Ready for Flight</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-secondary/50">
              <div className="text-muted-foreground">Battery Cycles</div>
              <div className="font-bold text-sm">48 / 300 Cycles</div>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/50">
              <div className="text-muted-foreground">GPS RTK Precision</div>
              <div className="font-bold text-sm text-emerald-500">1.2 cm Lock</div>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/50">
              <div className="text-muted-foreground">Spray Pump Nozzle</div>
              <div className="font-bold text-sm">Flow Rate 1.2 L/min</div>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary/50">
              <div className="text-muted-foreground">Firmware Version</div>
              <div className="font-mono text-sm">v2.4.1-RTK</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

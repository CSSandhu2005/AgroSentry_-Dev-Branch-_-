"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, HardDrive, Wifi, Camera, ShieldCheck, Activity } from "lucide-react";

export default function EdgeAiPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between p-5 rounded-2xl bg-card border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20">Edge Hardware</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Edge Computing & Raspberry Pi</h1>
          <p className="text-xs text-muted-foreground">
            Onboard Raspberry Pi hardware monitoring, local YOLO inference runtime, and offline mission cache.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>CPU Usage</span>
            <Cpu className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-500">24%</div>
          <div className="text-xs text-muted-foreground">Temp: 42°C (Normal)</div>
        </Card>

        <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>RAM Usage</span>
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-500">1.8 / 4.0 GB</div>
          <div className="text-xs text-muted-foreground">Local Model Cached</div>
        </Card>

        <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Edge Storage</span>
            <HardDrive className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-500">14.2 / 64 GB</div>
          <div className="text-xs text-muted-foreground">Offline Mission Cache Ready</div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play, CheckCircle2, Pause, Activity } from "lucide-react";

export default function MissionQueuePage() {
  const queueItems = [
    {
      id: "MSN-2026-042",
      name: "Targeted Spray & Verification Sweep",
      parcel: "Sector B — Cotton Parcel (5.5 Acres)",
      status: "Executing",
      time: "09:41 AM",
      agent: "Targeted Spray Commander",
    },
    {
      id: "MSN-2026-043",
      name: "NDVI Water Stress Patrol",
      parcel: "Sector A — Wheat Field (3.2 Acres)",
      status: "Queued",
      time: "10:15 AM",
      agent: "Water Stress Patrol Agent",
    },
    {
      id: "MSN-2026-044",
      name: "Variable Rate N-P-K Survey",
      parcel: "Sector C — Soybean Plot (4.0 Acres)",
      status: "Queued",
      time: "11:00 AM",
      agent: "Nutrient Mapping Agent",
    },
    {
      id: "MSN-2026-041",
      name: "Boundary & Acreage Survey",
      parcel: "Perimeter Polygon",
      status: "Completed",
      time: "08:30 AM",
      agent: "Autonomous Boundary Agent",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between p-5 rounded-2xl bg-card border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Batched Queue</Badge>
            <span className="text-xs font-mono text-muted-foreground">State Machine Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Autonomous Mission Queue</h1>
          <p className="text-xs text-muted-foreground">
            Manage batched state transitions across active, queued, and verified drone missions.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {queueItems.map((item) => (
          <Card key={item.id} className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 rounded-xl bg-secondary">
                {item.status === "Executing" ? (
                  <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
                ) : item.status === "Completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {item.status}
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm">{item.name}</h4>
                <p className="text-xs text-muted-foreground">{item.parcel} • Scheduled: {item.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-xs hidden md:block">
                <div className="text-muted-foreground">Assigned Agent</div>
                <div className="font-medium text-emerald-500">{item.agent}</div>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                {item.status === "Executing" ? "Pause" : "Prioritize"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

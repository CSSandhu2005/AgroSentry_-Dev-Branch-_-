"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Clock, ShieldCheck, Droplets, Leaf } from "lucide-react";

export default function MissionAnalyticsPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between p-5 rounded-2xl bg-card border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-sky-500/10 text-sky-500 border-sky-500/20">Analytics Engine</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Mission Operations Analytics</h1>
          <p className="text-xs text-muted-foreground">
            Aggregate flight metrics, success rates, cumulative chemical savings, and area coverage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-1">
          <div className="text-xs text-muted-foreground">Mission Success Rate</div>
          <div className="text-2xl font-bold text-emerald-500">98.4%</div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" /> +2.1% from last month
          </div>
        </Card>

        <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-1">
          <div className="text-xs text-muted-foreground">Total Flight Hours</div>
          <div className="text-2xl font-bold text-blue-500">42.8 Hours</div>
          <div className="text-[11px] text-muted-foreground">148 Total Missions</div>
        </Card>

        <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-1">
          <div className="text-xs text-muted-foreground">Pesticide Avoided</div>
          <div className="text-2xl font-bold text-indigo-500">94.2%</div>
          <div className="text-[11px] text-muted-foreground">142 Liters Saved</div>
        </Card>

        <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-1">
          <div className="text-xs text-muted-foreground">Total Water Saved</div>
          <div className="text-2xl font-bold text-amber-500">5,420 Liters</div>
          <div className="text-[11px] text-muted-foreground">Precision Drip & Spray</div>
        </Card>
      </div>
    </div>
  );
}

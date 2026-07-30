"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Droplets, CloudOff, IndianRupee, ShieldCheck } from "lucide-react";

export interface SdgMetricCardProps {
  chemicalSavedPct: number;
  waterSavedL: number;
  co2AvoidedKg: number;
  costSavedInr: number;
  sdgBadges: number[];
}

export function SdgMetricCard({
  chemicalSavedPct,
  waterSavedL,
  co2AvoidedKg,
  costSavedInr,
  sdgBadges,
}: SdgMetricCardProps) {
  return (
    <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center space-x-2">
          <Leaf className="w-5 h-5 text-emerald-500" />
          <span className="font-semibold text-sm tracking-wide uppercase">SDG Impact Metrics</span>
        </div>
        <div className="flex gap-1">
          {sdgBadges.map((sdg) => (
            <Badge key={sdg} className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] px-1.5 py-0">
              SDG {sdg}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Pesticide Saved</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-500">{chemicalSavedPct}%</div>
        </div>

        <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Water Saved</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-blue-500">{waterSavedL} L</div>
        </div>

        <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>CO₂ Avoided</span>
            <CloudOff className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-indigo-500">{co2AvoidedKg} kg</div>
        </div>

        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Cost Saved</span>
            <IndianRupee className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-500">₹{costSavedInr.toLocaleString()}</div>
        </div>
      </div>
    </Card>
  );
}

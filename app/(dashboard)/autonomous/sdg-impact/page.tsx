"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SdgMetricCard } from "@/components/autonomous/widgets/SdgMetricCard";
import { Leaf, Droplets, CloudOff, IndianRupee, ShieldCheck } from "lucide-react";

export default function SdgImpactPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between p-5 rounded-2xl bg-card border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">SDG Analytics</Badge>
            <span className="text-xs font-mono text-muted-foreground">Global Sustainability Goals</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">SDG Impact Engine</h1>
          <p className="text-xs text-muted-foreground">
            Quantified sustainability impact metrics aligned directly with SDGs 2, 6, 12, 13, and 15.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SdgMetricCard
          chemicalSavedPct={95}
          waterSavedL={420}
          co2AvoidedKg={18.4}
          costSavedInr={3450}
          sdgBadges={[2, 6, 12, 13, 15]}
        />

        <Card className="p-5 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
          <h3 className="font-semibold text-sm border-b pb-2">Supported Sustainable Development Goals</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-start space-x-3">
              <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">SDG 2</Badge>
              <div>
                <div className="font-semibold">Zero Hunger</div>
                <div className="text-muted-foreground">Precision targeted spraying protects crop yield without chemical damage.</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">SDG 6</Badge>
              <div>
                <div className="font-semibold">Clean Water & Sanitation</div>
                <div className="text-muted-foreground">Prevents pesticide runoff into rural groundwater & saves 420L per flight.</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Badge className="bg-indigo-500/20 text-indigo-500 border-indigo-500/30">SDG 13</Badge>
              <div>
                <div className="font-semibold">Climate Action</div>
                <div className="text-muted-foreground">Reduces tractor fuel emissions by replacing ground machinery with drone flights.</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

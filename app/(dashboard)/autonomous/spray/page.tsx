"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Droplets, Leaf, IndianRupee, ArrowRight } from "lucide-react";

export default function TargetedSprayingPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between p-5 rounded-2xl bg-card border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Precision Spray Engine</Badge>
            <span className="text-xs font-mono text-muted-foreground">95% Waste Reduction</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Targeted Spraying Command</h1>
          <p className="text-xs text-muted-foreground">
            Contrast 5% spot spraying over infected zones against 100% traditional chemical runoff.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional Spraying Card */}
        <Card className="p-5 border bg-red-500/5 border-red-500/20 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
            <h3 className="font-semibold text-red-500 text-sm">Traditional Blanket Spraying</h3>
            <Badge variant="outline" className="text-red-500 border-red-500/30 text-xs">100% Coverage</Badge>
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between"><span>Area Sprayed:</span><span className="font-bold text-foreground">5.5 Acres (100%)</span></div>
            <div className="flex justify-between"><span>Chemical Used:</span><span className="font-bold text-foreground">12.5 Liters</span></div>
            <div className="flex justify-between"><span>Water Used:</span><span className="font-bold text-foreground">500 Liters</span></div>
            <div className="flex justify-between"><span>Chemical Runoff:</span><span className="font-bold text-red-500">High Risk (Soil Pollution)</span></div>
          </div>
        </Card>

        {/* AgroSentry Targeted Spraying Card */}
        <Card className="p-5 border bg-emerald-500/5 border-emerald-500/30 ring-1 ring-emerald-500/50 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold text-emerald-500 text-sm">AgroSentry 5% Spot Spraying</h3>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 text-xs">5.5% Coverage</Badge>
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between"><span>Area Sprayed:</span><span className="font-bold text-emerald-500">0.3 Acres (5.5%)</span></div>
            <div className="flex justify-between"><span>Chemical Saved:</span><span className="font-bold text-emerald-500">95% (11.8 L Saved)</span></div>
            <div className="flex justify-between"><span>Water Saved:</span><span className="font-bold text-emerald-500">420 Liters</span></div>
            <div className="flex justify-between"><span>Cost Savings:</span><span className="font-bold text-emerald-500">₹3,450 / Mission</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

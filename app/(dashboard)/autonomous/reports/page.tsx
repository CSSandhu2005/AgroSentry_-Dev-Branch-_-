"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, Download, Leaf, ShieldCheck, CheckCircle2, FileText } from "lucide-react";

export default function ExecutiveReportsPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Top Actions */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-card border shadow-sm print:hidden">
        <div>
          <h1 className="text-xl font-bold">Executive Sustainability Report</h1>
          <p className="text-xs text-muted-foreground">Print-ready A4 PDF Report generated for Mission MSN-2026-042</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
            <Printer className="w-3.5 h-3.5 mr-1" /> Print / Export PDF
          </Button>
        </div>
      </div>

      {/* Printable A4 Report Document */}
      <Card className="p-8 border bg-card text-card-foreground shadow-md rounded-xl space-y-6 print:shadow-none print:border-none print:p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl font-bold tracking-tight">AgroSentry 2.0</h2>
            </div>
            <p className="text-xs text-muted-foreground">Autonomous SDG Agricultural Operating System</p>
          </div>
          <div className="text-right text-xs">
            <div className="font-mono text-muted-foreground">REPORT ID: RPT-2026-042</div>
            <div className="font-semibold text-foreground">Date: July 30, 2026</div>
          </div>
        </div>

        {/* Mission Overview */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-secondary/30 text-xs">
          <div>
            <div className="text-muted-foreground">Target Parcel</div>
            <div className="font-bold text-sm text-foreground">Sector B — Cotton Parcel (5.5 Acres)</div>
          </div>
          <div>
            <div className="text-muted-foreground">Mission Type</div>
            <div className="font-bold text-sm text-emerald-500">Targeted Spray & Verification Sweep</div>
          </div>
        </div>

        {/* Resource Savings Matrix */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm border-b pb-2">Quantified Sustainability Impact</h3>
          <div className="grid grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-muted-foreground">Chemical Saved</div>
              <div className="text-lg font-bold text-emerald-500">95%</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-muted-foreground">Water Saved</div>
              <div className="text-lg font-bold text-blue-500">420 L</div>
            </div>
            <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <div className="text-muted-foreground">CO₂ Avoided</div>
              <div className="text-lg font-bold text-indigo-500">18.4 kg</div>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="text-muted-foreground">Cost Reduction</div>
              <div className="text-lg font-bold text-amber-500">₹3,450</div>
            </div>
          </div>
        </div>

        {/* SDG Contribution Badges */}
        <div className="space-y-2 pt-2 border-t text-xs">
          <div className="font-semibold text-muted-foreground">Verified Sustainable Development Goals:</div>
          <div className="flex gap-2">
            {[2, 6, 12, 13, 15].map((sdg) => (
              <Badge key={sdg} className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                SDG {sdg} Verified
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

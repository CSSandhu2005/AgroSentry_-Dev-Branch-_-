"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, CheckCircle2 } from "lucide-react";

export default function MissionHistoryPage() {
  const historyLogs = [
    { id: "MSN-2026-042", name: "Targeted Spray & Verification", date: "2026-07-30", status: "Verified", chemicalSaved: "95%", waterSaved: "420L" },
    { id: "MSN-2026-041", name: "Autonomous Boundary Survey", date: "2026-07-29", status: "Completed", chemicalSaved: "N/A", waterSaved: "N/A" },
    { id: "MSN-2026-040", name: "NDVI Water Stress Patrol", date: "2026-07-28", status: "Completed", chemicalSaved: "100%", waterSaved: "310L" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between p-5 rounded-2xl bg-card border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20">Historical Log</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Mission History & PDF Reports</h1>
          <p className="text-xs text-muted-foreground">
            View completed drone missions and export print-ready Executive Sustainability PDF Reports.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {historyLogs.map((log) => (
          <Card key={log.id} className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{log.id}</span>
                <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> {log.status}
                </Badge>
              </div>
              <h4 className="font-semibold text-sm">{log.name}</h4>
              <p className="text-xs text-muted-foreground">Executed: {log.date} • Saved: {log.chemicalSaved} Pesticide / {log.waterSaved} Water</p>
            </div>

            <Link href="/autonomous/reports">
              <Button size="sm" variant="outline" className="text-xs">
                <Download className="w-3.5 h-3.5 mr-1" /> Export PDF Report
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

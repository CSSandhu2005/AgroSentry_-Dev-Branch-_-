"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export interface MissionStatusCardProps {
  missionId: string;
  type: string;
  status: "Created" | "Queued" | "Executing" | "Completed" | "Verified" | "Paused" | "Failed";
  targetField: string;
  progress: number;
  activeAgent: string;
}

export function MissionStatusCard({
  missionId,
  type,
  status,
  targetField,
  progress,
  activeAgent,
}: MissionStatusCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "Executing":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse"><Activity className="w-3 h-3 mr-1" /> Executing</Badge>;
      case "Completed":
      case "Verified":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> {status}</Badge>;
      case "Queued":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20"><Clock className="w-3 h-3 mr-1" /> Queued</Badge>;
      case "Paused":
      case "Failed":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20"><AlertTriangle className="w-3 h-3 mr-1" /> {status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-xs font-mono text-muted-foreground">{missionId}</span>
          <h4 className="font-semibold text-base">{type}</h4>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Target Field</span>
          <span className="font-medium text-foreground">{targetField}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Active Agent</span>
          <span className="font-medium text-emerald-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {activeAgent}
          </span>
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Mission Progress</span>
          <span className="font-mono">{progress}%</span>
        </div>
        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Observation, MissionStage } from "@/lib/agents/shared-mission-state";
import {
  Eye,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ArrowRight,
  Maximize2,
} from "lucide-react";

interface ObservationQueuePanelProps {
  observations: Observation[];
  stage: MissionStage;
  onDiagnoseAll?: () => void;
  onSelectObservation?: (obs: Observation) => void;
}

export function ObservationQueuePanel({
  observations,
  stage,
  onDiagnoseAll,
  onSelectObservation,
}: ObservationQueuePanelProps) {
  const [selectedObs, setSelectedObs] = useState<Observation | null>(null);

  const handleObsClick = (obs: Observation) => {
    setSelectedObs(obs);
    onSelectObservation?.(obs);
  };

  const getPriorityBadge = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return (
          <Badge className="bg-red-500/10 text-red-400 border-red-500/30 text-[10px]">
            High Priority
          </Badge>
        );
      case "Medium":
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px]">
            Medium Priority
          </Badge>
        );
      case "Low":
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-[10px]">
            Low Priority
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: Observation["status"]) => {
    switch (status) {
      case "Pending Diagnosis":
        return (
          <Badge variant="outline" className="text-amber-400 border-amber-500/40 bg-amber-500/10 text-[10px]">
            <ClockIcon className="w-3 h-3 mr-1" /> Pending Diagnosis
          </Badge>
        );
      case "Diagnosed":
        return (
          <Badge variant="outline" className="text-purple-300 border-purple-500/40 bg-purple-500/10 text-[10px]">
            <Sparkles className="w-3 h-3 mr-1 text-purple-400" /> Diagnosed
          </Badge>
        );
      case "Sprayed":
        return (
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 bg-emerald-500/10 text-[10px]">
            <Zap className="w-3 h-3 mr-1" /> Sprayed
          </Badge>
        );
      case "Resolved":
        return (
          <Badge variant="outline" className="text-emerald-300 border-emerald-500/40 bg-emerald-500/20 text-[10px]">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Resolved
          </Badge>
        );
    }
  };

  return (
    <Card className="p-4 border bg-card text-card-foreground shadow-sm rounded-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-sm">Observation Queue</h3>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Scout-generated anomaly feed consumed by Disease Agent
          </p>
        </div>

        <Badge variant="outline" className="font-mono text-[10px]">
          {observations.length} ANOMALIES
        </Badge>
      </div>

      {/* Disease Agent Consume Banner if Stage === Disease */}
      {stage === "Disease" && (
        <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
            <div>
              <span className="font-semibold">Disease Agent Active:</span> Consuming Observation Queue
            </div>
          </div>
          {onDiagnoseAll && (
            <Button
              size="xs"
              onClick={onDiagnoseAll}
              className="bg-purple-600 hover:bg-purple-700 text-white text-[10px]"
            >
              Run YOLO Diagnosis &rarr;
            </Button>
          )}
        </div>
      )}

      {/* Observation Cards Queue List */}
      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        {observations.map((obs) => (
          <div
            key={obs.id}
            onClick={() => handleObsClick(obs)}
            className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 relative overflow-hidden ${
              selectedObs?.id === obs.id
                ? "bg-purple-950/30 border-purple-500/60 shadow-md ring-1 ring-purple-500/30"
                : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
            }`}
          >
            {/* Top row: ID, Priority, Status */}
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-emerald-400">{obs.id}</span>
                {getPriorityBadge(obs.priority)}
              </div>
              {getStatusBadge(obs.status)}
            </div>

            {/* Middle row: Thumbnail + Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-1 items-center">
              {/* Thumbnail Image */}
              <div className="col-span-1 h-16 rounded-lg bg-slate-900 overflow-hidden relative border border-slate-800 group">
                <img
                  src={obs.thumbnail}
                  alt={obs.id}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              {/* Numerical Metrics: Confidence & Anomaly Score */}
              <div className="col-span-2 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium text-slate-200 truncate max-w-[120px]" title={obs.location}>
                    {obs.location}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px]">Confidence:</span>
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    {obs.confidence}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px]">Anomaly Score:</span>
                  <span className="font-mono font-bold text-purple-400 text-xs">
                    {obs.anomalyScore.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnosed Info if available */}
            {obs.detectedDisease && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-purple-300 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  {obs.detectedDisease}
                </span>
                <span className="text-muted-foreground text-[10px] font-mono">
                  YOLO v8 Nano
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

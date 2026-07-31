// components/MissionPlanner/PlannerStateChecklist.tsx
'use client';

import React from 'react';
import { PlannerStateStage } from '@/lib/agents/planner-agent';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Activity, Sparkles, Sliders, Globe } from 'lucide-react';

interface PlannerStateChecklistProps {
  currentStage: PlannerStateStage;
  confidenceScore?: number;
  className?: string;
}

const STAGES: { id: PlannerStateStage; label: string; sdgTip: string }[] = [
  { id: 'VALIDATING_BOUNDARY', label: 'Validating Boundary', sdgTip: 'SDG 12: Prevents redundant flight overlap & boundary waste' },
  { id: 'CALCULATING_AREA', label: 'Calculating Area & Perimeter', sdgTip: 'SDG 12: Establishes exact surface area budget' },
  { id: 'OPTIMIZING_SWEEP', label: 'Optimizing Sweep Angle', sdgTip: 'SDG 13: Minimizes total flight turns & energy draw' },
  { id: 'GENERATING_BOUSTROPHEDON', label: 'Generating Boustrophedon Path', sdgTip: 'SDG 13: Computes parallel flight lanes' },
  { id: 'CREATING_WAYPOINTS', label: 'Creating 3D Waypoints', sdgTip: 'SDG 13: Spaces waypoints to prevent deceleration spikes' },
  { id: 'ESTIMATING_BATTERY', label: 'Estimating Battery Telemetry', sdgTip: 'SDG 13: Validates safe energy discharge margin' },
  { id: 'OPTIMIZING_MISSION', label: 'Optimizing Resource Savings', sdgTip: 'SDG 12 & 13: Finalizes CO2 avoided & battery saved metrics' },
  { id: 'COMPLETED', label: 'Path Planning Ready', sdgTip: 'Autonomous Flight Plan Locked' },
];

export function PlannerStateChecklist({
  currentStage,
  confidenceScore = 98,
  className = '',
}: PlannerStateChecklistProps) {
  const getStageIndex = (st: PlannerStateStage) => {
    const idx = STAGES.findIndex((s) => s.id === st);
    if (idx !== -1) return idx;
    if (st === 'COMPLETED') return STAGES.length - 1;
    return 0;
  };

  const activeIdx = getStageIndex(currentStage);

  return (
    <Card className={`p-4 border bg-card/90 shadow-sm rounded-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-sky-500/10 text-sky-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
              Planner Agent Execution Engine
            </h4>
            <p className="text-[11px] text-muted-foreground">8-Stage Autonomous Optimization</p>
          </div>
        </div>

        <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/40 font-mono text-xs px-2.5 py-0.5">
          <Sparkles className="w-3 h-3 mr-1 text-sky-400" />
          {confidenceScore}% Confidence
        </Badge>
      </div>

      {/* Checklist Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {STAGES.map((st, idx) => {
          const isDone = idx < activeIdx || currentStage === 'COMPLETED';
          const isCurrent = idx === activeIdx && currentStage !== 'COMPLETED';

          return (
            <div
              key={st.id}
              className={`p-2 rounded-lg border transition-all flex items-start space-x-2 ${
                isDone
                  ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-400'
                  : isCurrent
                  ? 'bg-sky-500/10 border-sky-500/50 text-sky-300 ring-1 ring-sky-500/30 animate-pulse'
                  : 'bg-background/40 border-border/40 text-muted-foreground/60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              ) : isCurrent ? (
                <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5 animate-spin" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-semibold block text-[11px]">{st.label}</span>
                <span className="text-[10px] text-muted-foreground block line-clamp-1">{st.sdgTip}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

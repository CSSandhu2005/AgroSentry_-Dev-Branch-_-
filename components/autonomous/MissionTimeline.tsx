// components/autonomous/MissionTimeline.tsx
'use client';

import React from 'react';
import { MissionStatus } from '@/lib/mission/types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface MissionTimelineProps {
  currentStatus: MissionStatus;
  className?: string;
}

const LIFECYCLE_STAGES: { id: MissionStatus; label: string }[] = [
  { id: 'CREATED', label: 'Created' },
  { id: 'PLANNING', label: 'Planning' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'QUEUED', label: 'Queued' },
  { id: 'EXECUTING', label: 'Executing' },
  { id: 'SCANNING', label: 'Scanning' },
  { id: 'ANALYZING', label: 'Analyzing' },
  { id: 'SPRAYING', label: 'Spraying' },
  { id: 'VERIFYING', label: 'Verifying' },
  { id: 'COMPLETED', label: 'Completed' },
];

export function MissionTimeline({ currentStatus, className = '' }: MissionTimelineProps) {
  const getStageIndex = (st: MissionStatus): number => {
    const idx = LIFECYCLE_STAGES.findIndex((s) => s.id === st);
    if (idx !== -1) return idx;
    if (st === 'ARCHIVED') return LIFECYCLE_STAGES.length - 1;
    return 0;
  };

  const activeIndex = getStageIndex(currentStatus);

  return (
    <div className={`w-full py-3 ${className}`}>
      <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none gap-2">
        {LIFECYCLE_STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isPending = idx > activeIndex;

          return (
            <div key={stage.id} className="flex items-center space-x-2 min-w-max">
              <div className="flex flex-col items-center group">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isCurrent
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/60 ring-2 ring-sky-500/20 animate-pulse'
                      : 'bg-muted/40 text-muted-foreground border border-border'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                  ) : (
                    <Circle className="w-3 h-3 text-muted-foreground/50" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium mt-1 transition-colors ${
                    isCompleted
                      ? 'text-emerald-400 font-semibold'
                      : isCurrent
                      ? 'text-sky-400 font-bold'
                      : 'text-muted-foreground/60'
                  }`}
                >
                  {stage.label}
                </span>
              </div>

              {/* Connecting Line */}
              {idx < LIFECYCLE_STAGES.length - 1 && (
                <div
                  className={`h-0.5 w-6 sm:w-8 transition-colors ${
                    idx < activeIndex ? 'bg-emerald-500/40' : 'bg-border/60'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

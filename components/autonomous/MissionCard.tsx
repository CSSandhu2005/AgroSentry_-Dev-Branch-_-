// components/autonomous/MissionCard.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AutonomousMission } from '@/lib/mission/types';
import { MissionStatusBadge } from './MissionStatusBadge';
import { MapPin, Calendar, Activity, Bot, ChevronRight, Sparkles, Cpu } from 'lucide-react';

interface MissionCardProps {
  mission: AutonomousMission;
  isSelected?: boolean;
  onSelect: (mission: AutonomousMission) => void;
  onOpenStudio?: (mission: AutonomousMission) => void;
}

export function MissionCard({
  mission,
  isSelected = false,
  onSelect,
  onOpenStudio,
}: MissionCardProps) {
  const getPriorityBadge = (p: AutonomousMission['priority']) => {
    switch (p) {
      case 'HIGH':
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-[10px] font-mono">HIGH</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] font-mono">MED</Badge>;
      default:
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-mono">LOW</Badge>;
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  return (
    <Card
      onClick={() => onSelect(mission)}
      className={`p-4 border transition-all cursor-pointer rounded-xl space-y-3 ${
        isSelected
          ? 'bg-emerald-500/5 border-emerald-500/60 ring-1 ring-emerald-500/30 shadow-md'
          : 'bg-card hover:bg-accent/40 border-border shadow-sm'
      }`}
    >
      {/* Top Bar: Mission ID, Type, Priority, Status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Badge className="bg-slate-900 text-emerald-400 border-slate-700 font-mono text-xs px-2 py-0.5 shadow-sm">
            {mission.id}
          </Badge>
          {getPriorityBadge(mission.priority)}
        </div>

        <MissionStatusBadge status={mission.status} />
      </div>

      {/* Title & Objective */}
      <div>
        <h3 className="font-bold text-sm text-foreground tracking-tight line-clamp-1">{mission.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{mission.objective}</p>
      </div>

      {/* Meta Grid: Field, Health Score, Current Agent */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/60">
        <div className="flex items-center space-x-1.5 text-muted-foreground truncate">
          <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">{mission.field.name}</span>
        </div>

        <div className="flex items-center justify-end space-x-1.5 text-muted-foreground font-mono">
          <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="text-foreground font-semibold">{mission.healthScore}% Health</span>
        </div>
      </div>

      {/* Footer: Drone, Agent, Created At, Action Button */}
      <div className="flex items-center justify-between text-[11px] pt-1 text-muted-foreground">
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1 bg-secondary/60 px-2 py-0.5 rounded text-[10px] font-mono text-foreground">
            <Bot className="w-3 h-3 text-emerald-400 mr-1" />
            {mission.currentAgent}
          </span>
          <span className="flex items-center space-x-1 text-[10px]">
            <Calendar className="w-3 h-3 text-muted-foreground mr-0.5" />
            {formatDate(mission.createdAt)}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-emerald-400 font-medium hover:underline text-xs">
          <span>Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Card>
  );
}

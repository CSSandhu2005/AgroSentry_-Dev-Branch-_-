// components/autonomous/MissionStatusBadge.tsx
'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MissionStatus } from '@/lib/mission/types';
import {
  Clock,
  Sliders,
  CheckCircle2,
  ListOrdered,
  Play,
  Scan,
  Brain,
  Droplet,
  ShieldCheck,
  CheckCheck,
  Archive,
} from 'lucide-react';

interface MissionStatusBadgeProps {
  status: MissionStatus;
  className?: string;
}

export function MissionStatusBadge({ status, className = '' }: MissionStatusBadgeProps) {
  const getBadgeConfig = (st: MissionStatus) => {
    switch (st) {
      case 'CREATED':
        return {
          label: 'CREATED',
          icon: <Clock className="w-3 h-3 mr-1 text-cyan-400" />,
          style: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-mono',
        };
      case 'PLANNING':
        return {
          label: 'PLANNING',
          icon: <Sliders className="w-3 h-3 mr-1 text-sky-400 animate-pulse" />,
          style: 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-mono',
        };
      case 'APPROVED':
        return {
          label: 'APPROVED',
          icon: <CheckCircle2 className="w-3 h-3 mr-1 text-indigo-400" />,
          style: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-mono',
        };
      case 'QUEUED':
        return {
          label: 'QUEUED',
          icon: <ListOrdered className="w-3 h-3 mr-1 text-amber-400" />,
          style: 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono',
        };
      case 'EXECUTING':
        return {
          label: 'EXECUTING',
          icon: <Play className="w-3 h-3 mr-1 text-emerald-400 animate-pulse" />,
          style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono',
        };
      case 'SCANNING':
        return {
          label: 'SCANNING',
          icon: <Scan className="w-3 h-3 mr-1 text-emerald-400 animate-pulse" />,
          style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 font-mono',
        };
      case 'ANALYZING':
        return {
          label: 'ANALYZING',
          icon: <Brain className="w-3 h-3 mr-1 text-purple-400 animate-pulse" />,
          style: 'bg-purple-500/15 text-purple-400 border-purple-500/40 font-mono',
        };
      case 'SPRAYING':
        return {
          label: 'SPRAYING',
          icon: <Droplet className="w-3 h-3 mr-1 text-blue-400 animate-pulse" />,
          style: 'bg-blue-500/15 text-blue-400 border-blue-500/40 font-mono',
        };
      case 'VERIFYING':
        return {
          label: 'VERIFYING',
          icon: <ShieldCheck className="w-3 h-3 mr-1 text-teal-400 animate-pulse" />,
          style: 'bg-teal-500/15 text-teal-400 border-teal-500/40 font-mono',
        };
      case 'COMPLETED':
        return {
          label: 'COMPLETED',
          icon: <CheckCheck className="w-3 h-3 mr-1 text-emerald-400" />,
          style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-mono',
        };
      case 'ARCHIVED':
        return {
          label: 'ARCHIVED',
          icon: <Archive className="w-3 h-3 mr-1 text-muted-foreground" />,
          style: 'bg-muted text-muted-foreground border-border font-mono',
        };
      default:
        return {
          label: status,
          icon: null,
          style: 'bg-secondary text-secondary-foreground font-mono',
        };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <Badge variant="outline" className={`px-2.5 py-0.5 text-xs font-semibold flex items-center w-fit ${config.style} ${className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

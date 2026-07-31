// components/autonomous/MissionDetailsPanel.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AutonomousMission } from '@/lib/mission/types';
import { MissionStatusBadge } from './MissionStatusBadge';
import { MissionTimeline } from './MissionTimeline';
import { MissionImpactCard } from './MissionImpactCard';
import { MissionLog } from './MissionLog';
import {
  MapPin,
  Calendar,
  Activity,
  Bot,
  Globe,
  Sliders,
  Play,
  Scan,
  Brain,
  Droplet,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Cpu,
} from 'lucide-react';

interface MissionDetailsPanelProps {
  mission: AutonomousMission;
  onClose?: () => void;
}

export function MissionDetailsPanel({ mission }: MissionDetailsPanelProps) {
  const agentSubsystems = [
    {
      name: 'Path Planner Agent',
      status: mission.context.planner.status,
      icon: <Sliders className="w-4 h-4 text-sky-400" />,
      detail: mission.context.planner.waypointCount
        ? `${mission.context.planner.waypointCount} Waypoints Generated`
        : 'Boundary & Path Pending',
      phase: 'Phase 2 Module',
    },
    {
      name: 'Scout Agent',
      status: mission.context.scout.status,
      icon: <Scan className="w-4 h-4 text-amber-400" />,
      detail: mission.context.scout.scannedAreaAcres
        ? `${mission.context.scout.scannedAreaAcres} Acres Scanned`
        : 'Awaiting Flight Execution',
      phase: 'Phase 3 Module',
    },
    {
      name: 'Disease Intelligence',
      status: mission.context.disease.status,
      icon: <Brain className="w-4 h-4 text-purple-400" />,
      detail: mission.context.disease.pathogenName
        ? `${mission.context.disease.pathogenName} (${mission.context.disease.confidencePct}%)`
        : 'Awaiting Multispectral Data',
      phase: 'Phase 4 Module',
    },
    {
      name: 'Spray Commander',
      status: mission.context.spray.status,
      icon: <Droplet className="w-4 h-4 text-blue-400" />,
      detail: mission.context.spray.spotTargetsCount
        ? `${mission.context.spray.spotTargetsCount} Spot Targets Spraying`
        : 'Awaiting Pathogen Map',
      phase: 'Phase 5 Module',
    },
    {
      name: 'Verification Sentinel',
      status: mission.context.verification.status,
      icon: <ShieldCheck className="w-4 h-4 text-teal-400" />,
      detail: mission.context.verification.recoveryRatePct
        ? `${mission.context.verification.recoveryRatePct}% Yield Recovery`
        : 'Post-Spray Audit Pending',
      phase: 'Phase 6 Module',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <Card className="p-5 border bg-card shadow-sm rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge className="bg-slate-900 text-emerald-400 border-slate-700 font-mono text-sm px-3 py-1 shadow-sm">
                {mission.id}
              </Badge>
              <MissionStatusBadge status={mission.status} />
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-mono">
                Agent: {mission.currentAgent}
              </Badge>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">{mission.name}</h2>
          </div>

          <div className="flex items-center space-x-2">
            <Link href={`/autonomous/mission-studio?missionId=${mission.id}`}>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm">
                <Globe className="w-4 h-4 mr-1.5" /> Open Studio
                <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mission Operational Summary */}
        <p className="text-xs text-muted-foreground leading-relaxed">{mission.objective}</p>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-2.5 rounded-lg bg-secondary/50 border border-border/60">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
              Target Field
            </span>
            <p className="font-bold text-foreground mt-0.5">{mission.field.name}</p>
            <p className="text-[11px] text-muted-foreground">{mission.field.acres} Acres</p>
          </div>

          <div className="p-2.5 rounded-lg bg-secondary/50 border border-border/60">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
              Crop & Farmer
            </span>
            <p className="font-bold text-foreground mt-0.5">{mission.crop}</p>
            <p className="text-[11px] text-muted-foreground">{mission.farmer.name}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-secondary/50 border border-border/60">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
              Autonomous Drone
            </span>
            <p className="font-bold text-foreground mt-0.5 truncate">{mission.droneId}</p>
            <p className="text-[11px] text-emerald-400 font-mono">RTK Locked</p>
          </div>

          <div className="p-2.5 rounded-lg bg-secondary/50 border border-border/60">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
              Mission Health
            </span>
            <p className="font-extrabold text-sky-400 text-sm mt-0.5 font-mono">{mission.healthScore}%</p>
            <p className="text-[11px] text-muted-foreground">Optimal Parameters</p>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">
            Mission Lifecycle Pipeline
          </span>
          <MissionTimeline currentStatus={mission.status} />
        </div>
      </Card>

      {/* Sustainability Impact Storytelling Engine Card */}
      <MissionImpactCard
        sustainability={mission.context.sustainability}
        currentStatus={mission.status}
        currentAgent={mission.currentAgent}
      />

      {/* Subsystem Agent Pipeline Status Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Subsystem Agent Ownership Pipeline
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {agentSubsystems.map((sub) => (
            <Card key={sub.name} className="p-3.5 border bg-card/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-secondary">{sub.icon}</div>
                  <span className="font-semibold text-xs text-foreground">{sub.name}</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {sub.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">{sub.detail}</p>
              <div className="pt-1 text-[10px] font-mono text-emerald-400/80 border-t border-border/50">
                {sub.phase}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Replay & Event Log */}
      <MissionLog logs={mission.missionLogs} />
    </div>
  );
}

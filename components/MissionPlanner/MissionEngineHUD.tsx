// components/MissionPlanner/MissionEngineHUD.tsx
'use client';

import React from 'react';
import { UnifiedMission } from '@/lib/mission/mission';
import { PathPlannerConfig } from '@/lib/mission/path-planner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Cpu,
  Zap,
  Battery,
  Clock,
  Navigation,
  ShieldCheck,
  Droplets,
  Sparkles,
  Sliders,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';

interface MissionEngineHUDProps {
  mission: UnifiedMission;
  onUpdateConfig: (overrides: Partial<PathPlannerConfig>) => void;
  onToggleReplanning: () => void;
}

export default function MissionEngineHUD({
  mission,
  onUpdateConfig,
  onToggleReplanning,
}: MissionEngineHUDProps) {
  const cfg = mission.plannerConfig;
  const tel = mission.telemetry;
  const path = mission.pathResult;

  return (
    <div className="space-y-6">
      {/* Algorithm Header Banner */}
      <Card className="p-4 border bg-card/90 backdrop-blur shadow-sm rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs font-mono">
                Coverage Algorithm
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                Mathematical Sweep Engine
              </span>
            </div>
            <h3 className="text-base font-bold tracking-tight text-foreground flex items-center gap-1.5 mt-0.5">
              {path.algorithmName} <CheckCircle className="w-4 h-4 text-emerald-500 inline" />
            </h3>
          </div>
        </div>

        {/* Dynamic Replanning Trigger */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onToggleReplanning}
            variant={mission.replanning.isReplanned ? 'destructive' : 'outline'}
            size="sm"
            className="text-xs font-medium"
          >
            {mission.replanning.isReplanned ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Obstacle Avoidance
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-500" /> Simulate Obstacle / Wind Shear
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Mission Distance</span>
            <Navigation className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl font-bold font-mono">{path.totalDistanceMeters} m</div>
          <p className="text-[11px] text-muted-foreground">{path.turnCount} Turnarounds</p>
        </Card>

        <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Est. Flight Time</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono">{tel.flightDurationFormatted}</div>
          <p className="text-[11px] text-muted-foreground">Cruise @ 5.5 m/s</p>
        </Card>

        <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Battery Required</span>
            <Battery className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-500">
            {tel.estimatedBatteryUsedPct}%
          </div>
          <p className="text-[11px] text-muted-foreground">{tel.remainingBatteryPct}% Remaining</p>
        </Card>

        <Card className="p-4 border bg-card shadow-sm rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">GSD Resolution</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold font-mono">{tel.gsdCmPerPx} cm/px</div>
          <p className="text-[11px] text-muted-foreground">{path.waypoints.length} Waypoints</p>
        </Card>
      </div>

      {/* Flight Parameters Controls */}
      <Card className="p-5 border bg-card shadow-sm rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-500" />
            <h4 className="font-semibold text-sm">Flight Parameters & Sensor Physics</h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateConfig({ isSpotSprayMode: !cfg.isSpotSprayMode })}
              className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
                cfg.isSpotSprayMode
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-secondary text-muted-foreground hover:bg-accent'
              }`}
            >
              🎯 {cfg.isSpotSprayMode ? 'Targeted Spot Spray Mode' : '100% Field Survey Mode'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          {/* Altitude Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Flight Altitude:</span>
              <span className="font-bold text-foreground font-mono">{cfg.altitudeMeters}m</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={1}
              value={cfg.altitudeMeters}
              onChange={(e) => onUpdateConfig({ altitudeMeters: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>10m (High Res)</span>
              <span>50m (Fast Coverage)</span>
            </div>
          </div>

          {/* Overlap Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Camera Overlap:</span>
              <span className="font-bold text-foreground font-mono">
                {cfg.frontOverlapPct}% Front / {cfg.sideOverlapPct}% Side
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={90}
              step={5}
              value={cfg.sideOverlapPct}
              onChange={(e) => onUpdateConfig({ sideOverlapPct: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>50% (Wide)</span>
              <span>90% (Dense 3D Model)</span>
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 text-xs">
            <div className="flex items-center justify-between text-emerald-400 font-semibold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Spot Chemical Savings
              </span>
              <span className="font-mono text-sm">{tel.chemicalSavedPct}%</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Targeted spot spraying avoids {tel.waterSavedLiters}L water waste and saves {tel.co2AvoidedKg}kg CO₂ emissions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

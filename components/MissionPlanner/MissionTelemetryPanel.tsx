// components/MissionPlanner/MissionTelemetryPanel.tsx
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
  Sparkles,
  Sliders,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Wind,
  Sun,
  Send,
  Droplets,
} from 'lucide-react';

interface MissionTelemetryPanelProps {
  mission: UnifiedMission;
  onUpdateConfig: (overrides: Partial<PathPlannerConfig>) => void;
  onToggleReplanning: () => void;
}

export default function MissionTelemetryPanel({
  mission,
  onUpdateConfig,
  onToggleReplanning,
}: MissionTelemetryPanelProps) {
  const cfg = mission.plannerConfig;
  const tel = mission.telemetry;
  const path = mission.pathResult;

  return (
    <Card className="p-5 border bg-card/90 backdrop-blur shadow-lg rounded-2xl space-y-5 flex flex-col justify-between min-h-[650px] h-full">
      <div className="space-y-5">
        {/* Header & Algorithm Badge */}
        <div className="space-y-2 border-b pb-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs font-mono">
              Mission Control Panel
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">35% Telemetry HUD</span>
          </div>
          <h3 className="text-base font-bold tracking-tight text-foreground flex items-center gap-1.5">
            {path.algorithmName} <CheckCircle className="w-4 h-4 text-emerald-500 inline" />
          </h3>
        </div>

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-secondary/50 border space-y-1">
            <span className="text-muted-foreground">Flight Distance</span>
            <div className="text-lg font-bold font-mono text-sky-400">{path.totalDistanceMeters} m</div>
            <span className="text-[10px] text-muted-foreground">{path.turnCount} Turnarounds</span>
          </div>

          <div className="p-3 rounded-xl bg-secondary/50 border space-y-1">
            <span className="text-muted-foreground">Est. Flight Time</span>
            <div className="text-lg font-bold font-mono text-emerald-400">{tel.flightDurationFormatted}</div>
            <span className="text-[10px] text-muted-foreground">Speed: 5.5 m/s</span>
          </div>

          <div className="p-3 rounded-xl bg-secondary/50 border space-y-1">
            <span className="text-muted-foreground">Battery Draw</span>
            <div className="text-lg font-bold font-mono text-amber-400">{tel.estimatedBatteryUsedPct}%</div>
            <span className="text-[10px] text-muted-foreground">{tel.remainingBatteryPct}% Remaining</span>
          </div>

          <div className="p-3 rounded-xl bg-secondary/50 border space-y-1">
            <span className="text-muted-foreground">GSD Resolution</span>
            <div className="text-lg font-bold font-mono text-purple-400">{tel.gsdCmPerPx} cm/px</div>
            <span className="text-[10px] text-muted-foreground">{path.waypoints.length} Waypoints</span>
          </div>
        </div>

        {/* Flight Parameters Controls */}
        <div className="space-y-4 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-500" /> Flight Parameters
            </span>
            <button
              onClick={() => onUpdateConfig({ isSpotSprayMode: !cfg.isSpotSprayMode })}
              className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-colors ${
                cfg.isSpotSprayMode
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-secondary text-muted-foreground hover:bg-accent'
              }`}
            >
              🎯 {cfg.isSpotSprayMode ? 'Targeted Spot Spray' : '100% Survey'}
            </button>
          </div>

          {/* Altitude Slider */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Altitude:</span>
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
          </div>

          {/* Camera Overlap Slider */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Camera Overlap:</span>
              <span className="font-bold text-foreground font-mono">{cfg.sideOverlapPct}% Side</span>
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
          </div>
        </div>

        {/* Spot Spraying Savings Highlight */}
        {cfg.isSpotSprayMode && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
            <div className="flex items-center justify-between text-emerald-400 font-semibold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Spot Chemical Savings
              </span>
              <span className="font-mono">{tel.chemicalSavedPct}%</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Spot treatment saves {tel.waterSavedLiters}L water and avoids {tel.co2AvoidedKg}kg CO₂.
            </p>
          </div>
        )}

        {/* Weather & Environmental Widget */}
        <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs flex items-center justify-between font-mono">
          <div className="flex items-center space-x-2 text-sky-300">
            <Wind className="w-4 h-4" />
            <span>Wind: 8.4 km/h NE</span>
          </div>
          <div className="flex items-center space-x-2 text-amber-300">
            <Sun className="w-4 h-4" />
            <span>28°C Clear</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t">
        <Button
          onClick={onToggleReplanning}
          variant={mission.replanning.isReplanned ? 'destructive' : 'outline'}
          size="sm"
          className="w-full text-xs font-medium"
        >
          {mission.replanning.isReplanned ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Obstacle Avoidance
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" /> Simulate Obstacle / Wind Shear
            </>
          )}
        </Button>

        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 shadow-md">
          <Send className="w-4 h-4 mr-2" /> Launch Mission to Fleet
        </Button>
      </div>
    </Card>
  );
}

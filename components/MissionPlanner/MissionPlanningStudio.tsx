// components/MissionPlanner/MissionPlanningStudio.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { buildUnifiedMission, UnifiedMission } from '@/lib/mission/mission';
import { Point2D, LatLngPoint } from '@/lib/mission/boundary';
import LeafletMapEngine from './LeafletMapEngine';
import MissionTelemetryPanel from './MissionTelemetryPanel';
import VisualizationEngine3D from './VisualizationEngine3D';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Box, Sparkles, Zap, Layers } from 'lucide-react';

export default function MissionPlanningStudio() {
  const [mission, setMission] = useState<UnifiedMission>(() => buildUnifiedMission());

  // Handle boundary updates from Leaflet Map Engine
  const handleUpdatePolygon = useCallback((newPoints: Point2D[], latLngs?: LatLngPoint[]) => {
    setMission((prev) => {
      const updated = buildUnifiedMission(newPoints, prev.plannerConfig, prev.replanning.isReplanned);
      if (latLngs) {
        updated.fieldBoundary.latLngs = latLngs;
      }
      return updated;
    });
  }, []);

  // Handle configuration updates from Mission Telemetry Panel
  const handleUpdateConfig = useCallback((overrides: Parameters<typeof buildUnifiedMission>[1]) => {
    setMission((prev) =>
      buildUnifiedMission(prev.fieldBoundary.points, { ...prev.plannerConfig, ...overrides }, prev.replanning.isReplanned)
    );
  }, []);

  // Handle dynamic obstacle avoidance simulation
  const handleToggleReplanning = useCallback(() => {
    setMission((prev) =>
      buildUnifiedMission(prev.fieldBoundary.points, prev.plannerConfig, !prev.replanning.isReplanned)
    );
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Studio Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-card border shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono text-xs">
              AgroSentry Autonomous Mission Operations
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">
              Professional GIS Mission Planning
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            🚁 Mission Planning Studio
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl mt-0.5">
            Leaflet GIS Satellite Mission Planner with automatic Boustrophedon sweep waypoints, takeoff/landing markers, disease hotspots, and synchronized 3D terrain flight preview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-sky-500/10 text-sky-400 border-sky-500/30 font-mono text-xs p-2">
            <Globe className="w-3.5 h-3.5 mr-1.5" /> Satellite Basemap Active
          </Badge>
        </div>
      </div>

      {/* Dynamic Alert Banner for Dynamic Replanning */}
      {mission.replanning.isReplanned && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            {mission.replanning.alertText}
          </span>
          <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/40">
            Path Updated Live
          </Badge>
        </div>
      )}

      {/* TOP SECTION: 65% Leaflet Map / 35% Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 65%: Leaflet Satellite Map Engine */}
        <div className="lg:col-span-8 h-full">
          <LeafletMapEngine
            mission={mission}
            onUpdatePolygon={handleUpdatePolygon}
            onUpdateConfig={handleUpdateConfig}
            onToggleReplanning={handleToggleReplanning}
          />
        </div>

        {/* RIGHT 35%: Mission Control & Telemetry Panel */}
        <div className="lg:col-span-4 h-full">
          <MissionTelemetryPanel
            mission={mission}
            onUpdateConfig={handleUpdateConfig}
            onToggleReplanning={handleToggleReplanning}
          />
        </div>
      </div>

      {/* BOTTOM SECTION: 3D Visualization Engine Complement */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Box className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold tracking-tight">3D Terrain & Flight Preview Complement</h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Synchronized 3D Farm Mesh & Quadcopter Drone Preview
          </span>
        </div>

        <VisualizationEngine3D mission={mission} isPreviewMode={false} />
      </div>
    </div>
  );
}

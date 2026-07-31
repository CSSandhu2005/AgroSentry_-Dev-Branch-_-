// components/MissionPlanner/MissionPlanningStudio.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { buildUnifiedMission, UnifiedMission } from '@/lib/mission/mission';
import { Point2D, LatLngPoint } from '@/lib/mission/boundary';
import LeafletMapEngine from './LeafletMapEngine';
import MissionTelemetryPanel from './MissionTelemetryPanel';
import VisualizationEngine3D from './VisualizationEngine3D';
import { PlannerStateChecklist } from './PlannerStateChecklist';
import { PlannerDeliverablesView } from './PlannerDeliverablesView';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AutonomousMission, PlannerDeliverables, PlannerConfidence } from '@/lib/mission/types';
import { getMissions, getMissionById, updateMissionStatus } from '@/lib/mission/store';
import { runPlannerAgentEngine, PlannerStateStage } from '@/lib/agents/planner-agent';
import { Globe, Sparkles, Zap, CheckCircle2, FileText, ArrowLeft, Bot, ShieldCheck } from 'lucide-react';

export default function MissionPlanningStudio() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const missionIdFromUrl = searchParams.get('missionId');

  const [activeMission, setActiveMission] = useState<AutonomousMission | null>(null);
  const [unifiedMission, setUnifiedMission] = useState<UnifiedMission>(() => buildUnifiedMission());
  const [plannerStage, setPlannerStage] = useState<PlannerStateStage>('COMPLETED');
  const [deliverables, setDeliverables] = useState<PlannerDeliverables | undefined>(undefined);
  const [confidence, setConfidence] = useState<PlannerConfidence | undefined>(undefined);
  const [deliverablesDialogOpen, setDeliverablesDialogOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  // Load mission from store on mount
  useEffect(() => {
    const allMissions = getMissions();
    const target = (missionIdFromUrl && getMissionById(missionIdFromUrl)) || allMissions[0];
    if (target) {
      setActiveMission(target);
      setIsApproved(target.status === 'APPROVED' || target.status === 'QUEUED' || target.status === 'COMPLETED');
      if (target.context.planner.deliverables) {
        setDeliverables(target.context.planner.deliverables);
      }
      if (target.context.planner.confidence) {
        setConfidence(target.context.planner.confidence);
      }
    }
  }, [missionIdFromUrl]);

  // Run Planner Agent Engine whenever polygon or config changes
  const executePlannerAgent = useCallback(async (polygon: Point2D[], configOverrides?: any) => {
    if (!activeMission) return;
    try {
      const result = await runPlannerAgentEngine(
        activeMission,
        polygon,
        configOverrides,
        (st) => setPlannerStage(st)
      );
      setDeliverables(result.deliverables);
      setConfidence(result.confidence);
    } catch (err) {
      console.error('Planner agent execution error:', err);
      setPlannerStage('FAILED');
    }
  }, [activeMission]);

  // Handle boundary updates from Leaflet Map Engine
  const handleUpdatePolygon = useCallback((newPoints: Point2D[], latLngs?: LatLngPoint[]) => {
    setUnifiedMission((prev) => {
      const updated = buildUnifiedMission(newPoints, prev.plannerConfig, prev.replanning.isReplanned);
      if (latLngs) {
        updated.fieldBoundary.latLngs = latLngs;
      }
      return updated;
    });
    executePlannerAgent(newPoints);
  }, [executePlannerAgent]);

  // Handle configuration updates from Mission Telemetry Panel
  const handleUpdateConfig = useCallback((overrides: Parameters<typeof buildUnifiedMission>[1]) => {
    setUnifiedMission((prev) => {
      const updated = buildUnifiedMission(prev.fieldBoundary.points, { ...prev.plannerConfig, ...overrides }, prev.replanning.isReplanned);
      executePlannerAgent(prev.fieldBoundary.points, overrides);
      return updated;
    });
  }, [executePlannerAgent]);

  // Handle dynamic obstacle avoidance simulation
  const handleToggleReplanning = useCallback(() => {
    setUnifiedMission((prev) =>
      buildUnifiedMission(prev.fieldBoundary.points, prev.plannerConfig, !prev.replanning.isReplanned)
    );
  }, []);

  // Primary Action: Approve & Lock Flight Plan
  const handleApproveMission = () => {
    if (!activeMission) return;
    const updated = updateMissionStatus(
      activeMission.id,
      'APPROVED',
      'Planner Agent',
      {
        agent: 'PLANNER',
        event: 'PLANNING_COMPLETED',
        description: `Boustrophedon sweep flight plan locked for ${activeMission.field.name}. Waypoints generated and persisted to mission.`,
        severity: 'SUCCESS',
      }
    );

    if (updated) {
      setActiveMission(updated);
      setIsApproved(true);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Studio Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-card border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/autonomous/mission-queue')}
              className="text-xs h-7 px-2 border-border"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Queue
            </Button>

            {activeMission && (
              <Badge className="bg-slate-900 text-emerald-400 border-slate-700 font-mono text-xs px-2.5 py-0.5">
                {activeMission.id}
              </Badge>
            )}

            <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/30 font-mono text-xs">
              Agent 1: Path Planner Agent
            </Badge>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2 text-foreground">
            🚁 Mission Planning Studio
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Autonomous Boustrophedon sweep path planner driven by Agent 1. Minimizes flight distance & energy draw for SDG 12 & 13.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {deliverables && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeliverablesDialogOpen(true)}
              className="text-xs font-semibold border-sky-500/40 text-sky-400 hover:bg-sky-500/10"
            >
              <FileText className="w-4 h-4 mr-1.5" /> View Deliverables
            </Button>
          )}

          <Button
            onClick={handleApproveMission}
            disabled={isApproved}
            className={`text-xs font-bold shadow-md ${
              isApproved
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isApproved ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" /> Flight Plan Approved & Locked
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 mr-1.5" /> Approve & Lock Flight Plan
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Agent 1 Execution State Machine Progress Banner */}
      <PlannerStateChecklist
        currentStage={plannerStage}
        confidenceScore={confidence?.score || activeMission?.context.planner.confidenceScore || 98}
      />

      {/* TOP SECTION: 65% Leaflet Map / 35% Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 65%: Leaflet Satellite Map Engine */}
        <div className="lg:col-span-8 h-full">
          <LeafletMapEngine
            mission={unifiedMission}
            onUpdatePolygon={handleUpdatePolygon}
            onUpdateConfig={handleUpdateConfig}
            onToggleReplanning={handleToggleReplanning}
          />
        </div>

        {/* RIGHT 35%: Mission Control & Telemetry Panel */}
        <div className="lg:col-span-4 h-full">
          <MissionTelemetryPanel
            mission={unifiedMission}
            onUpdateConfig={handleUpdateConfig}
            onToggleReplanning={handleToggleReplanning}
          />
        </div>
      </div>

      {/* BOTTOM SECTION: Synchronized 3D Flight Preview Engine */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            Synchronized 3D WebGL Flight Preview
          </h2>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs font-mono">
            3D Elevation & Quadcopter Playback
          </Badge>
        </div>

        <div className="h-[420px] rounded-2xl overflow-hidden border shadow-sm">
          <VisualizationEngine3D mission={unifiedMission} />
        </div>
      </div>

      {/* Deliverables Inspector Dialog */}
      {activeMission && (
        <PlannerDeliverablesView
          open={deliverablesDialogOpen}
          onOpenChange={setDeliverablesDialogOpen}
          deliverables={deliverables}
          missionId={activeMission.id}
        />
      )}
    </div>
  );
}

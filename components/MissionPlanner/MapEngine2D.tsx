// components/MissionPlanner/MapEngine2D.tsx
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { UnifiedMission } from '@/lib/mission/mission';
import { Point2D } from '@/lib/mission/boundary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Layers, Trash2, Edit3, CheckCircle2, ShieldAlert } from 'lucide-react';

interface MapEngine2DProps {
  mission: UnifiedMission;
  onUpdatePolygon: (pts: Point2D[]) => void;
}

export default function MapEngine2D({ mission, onUpdatePolygon }: MapEngine2DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [draftPoints, setDraftPoints] = useState<Point2D[]>(mission.fieldBoundary.points);

  useEffect(() => {
    setDraftPoints(mission.fieldBoundary.points);
  }, [mission.fieldBoundary.points]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // 1. Dark Satellite Map Background Grid
    ctx.clearRect(0, 0, W, H);
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0a1610');
    bgGrad.addColorStop(1, '#050c08');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Coordinate grid lines
    ctx.strokeStyle = '#1e3a2944';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < W; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Satellite imagery texture effect (simulated high-res satellite farm tiles)
    ctx.fillStyle = '#14382218';
    ctx.beginPath();
    ctx.arc(W * 0.4, H * 0.5, W * 0.35, 0, Math.PI * 2);
    ctx.fill();

    const pts = draftPoints;

    // 2. Draw Polygon Boundary
    if (pts.length >= 2) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pts[0].x * W, pts[0].y * H);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x * W, pts[i].y * H);
      }
      if (pts.length >= 3 && !isDrawing) {
        ctx.closePath();
      }

      // Fill field polygon
      ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';
      ctx.fill();

      // Glowing border
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Draw Disease Hotspot Heatmap Overlays
    mission.terrain.diseaseClouds.forEach((cloud) => {
      const cx = cloud.x * W;
      const cy = cloud.y * H;
      const rad = 35 * (cloud.severityPct / 50);

      const radGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, rad);
      radGrad.addColorStop(0, `rgba(239, 68, 68, ${0.4 + (cloud.severityPct / 200)})`);
      radGrad.addColorStop(0.6, 'rgba(239, 68, 68, 0.15)');
      radGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Draw Boustrophedon Waypoint Path & Turn Lines
    const waypoints = mission.replanning.isReplanned
      ? mission.replanning.replannedWaypoints
      : mission.pathResult.waypoints;

    if (waypoints.length > 1) {
      ctx.save();
      // Original path (if replanned, show dashed gray)
      if (mission.replanning.isReplanned && mission.replanning.originalWaypoints.length > 1) {
        ctx.beginPath();
        ctx.moveTo(mission.replanning.originalWaypoints[0].x * W, mission.replanning.originalWaypoints[0].y * H);
        mission.replanning.originalWaypoints.forEach((wp) => {
          ctx.lineTo(wp.x * W, wp.y * H);
        });
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
      }

      // Active Boustrophedon Path (Emerald glow)
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.moveTo(waypoints[0].x * W, waypoints[0].y * H);
      for (let i = 1; i < waypoints.length; i++) {
        ctx.lineTo(waypoints[i].x * W, waypoints[i].y * H);
      }
      ctx.strokeStyle = mission.plannerConfig.isSpotSprayMode ? '#f59e0b' : '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = mission.plannerConfig.isSpotSprayMode ? '#f59e0b' : '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();

      // Waypoint Dots
      waypoints.forEach((wp, idx) => {
        const wx = wp.x * W;
        const wy = wp.y * H;
        ctx.beginPath();
        ctx.arc(wx, wy, wp.isSpotTarget ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = wp.isSpotTarget ? '#ef4444' : '#38bdf8';
        ctx.fill();

        if (idx === 0 || idx === waypoints.length - 1) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    }

    // 5. Draw Dynamic Obstacle Marker if present
    if (mission.replanning.activeObstacle) {
      const obs = mission.replanning.activeObstacle;
      const ox = obs.x * W;
      const oy = obs.y * H;

      ctx.save();
      ctx.beginPath();
      ctx.arc(ox, oy, 22, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.restore();
    }

    // 6. Draw Polygon Handles (Vertices)
    pts.forEach((pt, idx) => {
      const px = pt.x * W;
      const py = pt.y * H;

      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = dragIndex === idx ? '#facc15' : '#22c55e';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.fillText(`P${idx + 1}`, px + 10, py + 4);
    });
  }, [draftPoints, isDrawing, dragIndex, mission]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle Mouse Events for Polygon Editing
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    // Check if clicked near an existing vertex to drag
    const foundIdx = draftPoints.findIndex((p) => {
      const dx = p.x - clickX;
      const dy = p.y - clickY;
      return Math.sqrt(dx * dx + dy * dy) < 0.04;
    });

    if (foundIdx !== -1) {
      setDragIndex(foundIdx);
    } else if (isDrawing) {
      const updated = [...draftPoints, { x: clickX, y: clickY }];
      setDraftPoints(updated);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragIndex === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const newX = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width));
    const newY = Math.max(0.05, Math.min(0.95, (e.clientY - rect.top) / rect.height));

    const updated = [...draftPoints];
    updated[dragIndex] = { x: newX, y: newY };
    setDraftPoints(updated);
  };

  const handleMouseUp = () => {
    if (dragIndex !== null) {
      setDragIndex(null);
      onUpdatePolygon(draftPoints);
    }
  };

  const handleStartDrawing = () => {
    setDraftPoints([]);
    setIsDrawing(true);
  };

  const handleFinishDrawing = () => {
    setIsDrawing(false);
    onUpdatePolygon(draftPoints);
  };

  const handleReset = () => {
    const defaultPts = [
      { x: 0.15, y: 0.15 },
      { x: 0.82, y: 0.12 },
      { x: 0.88, y: 0.82 },
      { x: 0.52, y: 0.88 },
      { x: 0.18, y: 0.75 },
    ];
    setDraftPoints(defaultPts);
    setIsDrawing(false);
    onUpdatePolygon(defaultPts);
  };

  return (
    <div className="relative w-full rounded-2xl bg-card border shadow-lg overflow-hidden flex flex-col">
      {/* Top Toolbar */}
      <div className="p-4 border-b bg-card/80 backdrop-blur flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 flex items-center gap-1 font-mono text-xs">
            <Layers className="w-3.5 h-3.5" /> 🛰 Map Engine 2D
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            {mission.fieldBoundary.acres} Acres | {mission.fieldBoundary.perimeterMeters}m Boundary
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isDrawing ? (
            <Button onClick={handleStartDrawing} variant="outline" size="sm" className="text-xs">
              <Edit3 className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Draw Boundary
            </Button>
          ) : (
            <Button onClick={handleFinishDrawing} variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Finish Boundary ({draftPoints.length} Pts)
            </Button>
          )}

          <Button onClick={handleReset} variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-[480px] bg-black cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-full block"
        />

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-3 left-3 p-3 rounded-xl bg-background/90 backdrop-blur border shadow-md text-xs space-y-1.5 font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
            <span className="text-muted-foreground">Field Boundary ({draftPoints.length} Vertices)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-0.5 bg-sky-400" />
            <span className="text-muted-foreground">Boustrophedon Sweep Path</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500" />
            <span className="text-muted-foreground">Pathogen Risk Heatmap</span>
          </div>
          {mission.replanning.isReplanned && (
            <div className="flex items-center space-x-2 text-red-400 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Obstacle Avoided (Detour Active)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, ShieldAlert, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WaypointMapCanvas() {
  const [currentWaypoint, setCurrentWaypoint] = useState(4);
  const [isPlaying, setIsPlaying] = useState(true);

  const waypoints = [
    { id: 1, x: 20, y: 20, type: "Takeoff Point", status: "passed" },
    { id: 2, x: 40, y: 25, type: "Scout Sector A", status: "passed" },
    { id: 3, x: 70, y: 30, type: "Scout Sector B", status: "passed" },
    { id: 4, x: 65, y: 65, type: "Target Spray Zone (Sector B)", status: "active" },
    { id: 5, x: 30, y: 70, type: "Verification Loop", status: "pending" },
    { id: 6, x: 20, y: 20, type: "RTL Home Base", status: "pending" },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentWaypoint((prev) => (prev >= waypoints.length ? 1 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeWp = waypoints.find((w) => w.id === currentWaypoint) || waypoints[0];

  return (
    <div className="relative w-full h-[360px] md:h-[420px] rounded-xl border bg-slate-950 text-white overflow-hidden shadow-inner flex flex-col justify-between p-4">
      {/* Grid Overlay background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top Controls Overlay */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5" />
            LIVE FLIGHT CANVAS
          </Badge>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            LAT: 18.5204° N | LON: 73.8567° E
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
            {isPlaying ? "Pause Flight" : "Resume Flight"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-8 border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs"
            onClick={() => setCurrentWaypoint(1)}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Map Content SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Field Polygon */}
        <polygon
          points="60,40 340,50 320,320 80,300"
          fill="rgba(16, 185, 129, 0.05)"
          stroke="rgba(16, 185, 129, 0.3)"
          strokeWidth="2"
          strokeDasharray="4,4"
        />

        {/* Targeted Spray Zone (Sector B) */}
        <polygon
          points="210,180 300,190 280,280 200,260"
          fill="rgba(239, 68, 68, 0.2)"
          stroke="rgba(239, 68, 68, 0.6)"
          strokeWidth="2"
        />
        <text x="215" y="210" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold">
          5% TARGET SPRAY ZONE
        </text>

        {/* No Spray Biodiversity Buffer Zone */}
        <circle cx="120" cy="120" r="35" fill="rgba(59, 130, 246, 0.15)" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1.5" />
        <text x="95" y="123" fill="#60a5fa" fontSize="9" fontFamily="sans-serif">
          NO SPRAY BUFFER
        </text>

        {/* Waypoint Polyline */}
        <polyline
          points="60,60 140,75 250,90 240,240 100,250 60,60"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        {/* Waypoint Markers */}
        {waypoints.map((wp) => {
          const isActive = wp.id === currentWaypoint;
          return (
            <g key={wp.id}>
              <circle
                cx={`${wp.x}%`}
                cy={`${wp.y}%`}
                r={isActive ? 8 : 5}
                fill={isActive ? "#10b981" : "#475569"}
                stroke="#020617"
                strokeWidth="2"
                className={isActive ? "animate-ping" : ""}
              />
              <circle
                cx={`${wp.x}%`}
                cy={`${wp.y}%`}
                r={isActive ? 6 : 4}
                fill={isActive ? "#10b981" : "#64748b"}
              />
            </g>
          );
        })}

        {/* Animated Drone Marker */}
        <g style={{ transition: "all 1s ease-in-out" }}>
          <circle
            cx={`${activeWp.x}%`}
            cy={`${activeWp.y}%`}
            r="16"
            fill="rgba(16, 185, 129, 0.25)"
            className="animate-pulse"
          />
          <circle cx={`${activeWp.x}%`} cy={`${activeWp.y}%`} r="6" fill="#10b981" />
        </g>
      </svg>

      {/* Bottom Telemetry HUD Overlay */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-lg bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs">
        <div className="flex items-center space-x-3">
          <Navigation className="w-4 h-4 text-emerald-400 animate-spin" />
          <div>
            <div className="text-slate-400 font-mono">ACTIVE WAYPOINT</div>
            <div className="font-semibold text-slate-100">
              WP-{activeWp.id}: {activeWp.type}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 font-mono text-slate-300">
          <div>ALT: <span className="text-emerald-400">18.5m</span></div>
          <div>SPD: <span className="text-emerald-400">12.4 km/h</span></div>
          <div>SPRAYER: <span className="text-red-400 font-bold">ACTIVE (5%)</span></div>
        </div>
      </div>
    </div>
  );
}

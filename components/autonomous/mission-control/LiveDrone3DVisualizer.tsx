"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigation, Battery, Wind, Droplets, ShieldCheck, ArrowUp, ArrowDown, Power } from "lucide-react";

export interface LiveDrone3DVisualizerProps {
  isSpraying?: boolean;
  stage?: string;
}

export function LiveDrone3DVisualizer({ isSpraying = false, stage = "Scout" }: LiveDrone3DVisualizerProps) {
  const [altitude, setAltitude] = useState(18.5);
  const [heading, setHeading] = useState(146);
  const [pitch, setPitch] = useState(4.2);
  const [roll, setRoll] = useState(-2.1);
  const [yaw, setYaw] = useState(146);
  const [hangarOpen, setHangarOpen] = useState(true);
  const [rotorSpeed, setRotorSpeed] = useState(12);

  // Dynamic Telemetry Oscillation Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPitch((prev) => Number((Math.sin(Date.now() / 600) * 8).toFixed(1)));
      setRoll((prev) => Number((Math.cos(Date.now() / 800) * 6).toFixed(1)));
      setHeading((prev) => (prev >= 360 ? 0 : prev + 1));
      setYaw((prev) => (prev >= 360 ? 0 : prev + 1));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[320px] rounded-xl border bg-slate-950 text-white overflow-hidden shadow-inner flex flex-col justify-between p-4">
      {/* Grid Overlay background */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Top HUD Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-sm text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5" />
            LIVE DRONE 3D TELEMETRY
          </Badge>
          <span className="text-xs font-mono text-slate-400">STAGE: {stage.toUpperCase()}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            HANGAR: {hangarOpen ? "OPEN" : "DOCKED"}
          </span>
        </div>
      </div>

      {/* 3D Quadcopter Canvas Representation */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-2">
        <div
          className="relative w-44 h-44 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transform: `perspective(600px) rotateX(${pitch}deg) rotateY(${roll}deg) rotateZ(${yaw % 30}deg)`,
          }}
        >
          {/* Drone Center Body */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center relative z-20">
            <Navigation className="w-6 h-6 text-emerald-400 animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-400 font-bold mt-0.5">AGRO-X1</span>
          </div>

          {/* Quadrotor Arms */}
          <div className="absolute w-36 h-1 bg-slate-700/80 rounded transform rotate-45 z-10" />
          <div className="absolute w-36 h-1 bg-slate-700/80 rounded transform -rotate-45 z-10" />

          {/* Rotor Motor 1 (Top Left) */}
          <div className="absolute -top-1 -left-1 w-10 h-10 rounded-full border border-emerald-500/40 flex items-center justify-center bg-slate-900/80">
            <div className="w-8 h-8 rounded-full border border-dashed border-emerald-400/60 animate-spin" />
          </div>

          {/* Rotor Motor 2 (Top Right) */}
          <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full border border-emerald-500/40 flex items-center justify-center bg-slate-900/80">
            <div className="w-8 h-8 rounded-full border border-dashed border-emerald-400/60 animate-spin" />
          </div>

          {/* Rotor Motor 3 (Bottom Left) */}
          <div className="absolute -bottom-1 -left-1 w-10 h-10 rounded-full border border-emerald-500/40 flex items-center justify-center bg-slate-900/80">
            <div className="w-8 h-8 rounded-full border border-dashed border-emerald-400/60 animate-spin" />
          </div>

          {/* Rotor Motor 4 (Bottom Right) */}
          <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full border border-emerald-500/40 flex items-center justify-center bg-slate-900/80">
            <div className="w-8 h-8 rounded-full border border-dashed border-emerald-400/60 animate-spin" />
          </div>

          {/* Animated Spray Nozzles Mist particles when spraying */}
          {isSpraying && (
            <div className="absolute bottom-[-30px] inset-x-0 flex justify-around pointer-events-none z-30">
              <div className="w-6 h-12 bg-gradient-to-b from-blue-500/60 to-transparent rounded-full animate-ping opacity-80" />
              <div className="w-6 h-12 bg-gradient-to-b from-blue-500/60 to-transparent rounded-full animate-ping opacity-80 delay-100" />
            </div>
          )}

          {/* Scout Laser Scanning Beam */}
          {stage === "Scout" && (
            <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-full animate-ping pointer-events-none" />
          )}
        </div>
      </div>

      {/* Bottom Telemetry HUD Matrix */}
      <div className="relative z-10 grid grid-cols-5 gap-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <div>
          <div className="text-slate-500">ALTITUDE</div>
          <div className="font-bold text-emerald-400 text-xs">{altitude}m</div>
        </div>
        <div>
          <div className="text-slate-500">PITCH</div>
          <div className="font-bold text-emerald-400 text-xs">{pitch}°</div>
        </div>
        <div>
          <div className="text-slate-500">ROLL</div>
          <div className="font-bold text-emerald-400 text-xs">{roll}°</div>
        </div>
        <div>
          <div className="text-slate-500">HEADING</div>
          <div className="font-bold text-emerald-400 text-xs">{heading}°</div>
        </div>
        <div>
          <div className="text-slate-500">NOZZLES</div>
          <div className={`font-bold text-xs ${isSpraying ? "text-blue-400 animate-pulse" : "text-slate-400"}`}>
            {isSpraying ? "SPRAYING" : "OFF"}
          </div>
        </div>
      </div>
    </div>
  );
}

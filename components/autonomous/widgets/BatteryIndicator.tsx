"use client";

import React from "react";
import { Battery, BatteryCharging, BatteryWarning } from "lucide-react";

export interface BatteryIndicatorProps {
  pct: number;
  isCharging?: boolean;
}

export function BatteryIndicator({ pct, isCharging = false }: BatteryIndicatorProps) {
  const getColorClass = () => {
    if (pct <= 20) return "text-red-500 bg-red-500/10 border-red-500/20";
    if (pct <= 50) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  };

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono font-semibold ${getColorClass()}`}>
      {isCharging ? (
        <BatteryCharging className="w-4 h-4 animate-pulse" />
      ) : pct <= 20 ? (
        <BatteryWarning className="w-4 h-4 animate-bounce" />
      ) : (
        <Battery className="w-4 h-4" />
      )}
      <span>{pct}%</span>
    </div>
  );
}

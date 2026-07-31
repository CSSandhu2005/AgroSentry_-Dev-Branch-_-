// components/autonomous/MissionImpactCard.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SustainabilityContext, MissionStatus } from '@/lib/mission/types';
import { Leaf, Globe, Sparkles, HelpCircle, ShieldCheck, Zap, Droplet, Wind, Target } from 'lucide-react';

interface MissionImpactCardProps {
  sustainability: SustainabilityContext;
  currentStatus: MissionStatus;
  currentAgent: string;
  stageNarrative?: {
    what: string;
    why: string;
    how: string;
  };
  className?: string;
}

export function MissionImpactCard({
  sustainability,
  currentStatus,
  currentAgent,
  stageNarrative,
  className = '',
}: MissionImpactCardProps) {
  const primarySdg = sustainability.objectives[0] || { code: 13, title: 'SDG 13: Climate Action' };
  const supportingSdgs = sustainability.objectives.slice(1);

  // Default storytelling narrative if stageNarrative is not passed
  const defaultNarrative = {
    what: stageNarrative?.what || `Autonomous mission initialized under ${currentAgent} supervision in stage [${currentStatus}].`,
    why: stageNarrative?.why || `Preventing resource wastage and safeguarding crop yield through targeted robotics automation.`,
    how: stageNarrative?.how || `Directly advancing ${sustainability.objectives.map((s) => `SDG ${s.code}`).join(' & ')} through precise autonomous flight optimization.`,
  };

  return (
    <Card className={`p-4 border bg-card/90 shadow-sm rounded-xl space-y-4 ${className}`}>
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm tracking-tight flex items-center gap-1.5">
              Sustainability & SDG Impact Engine
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Autonomous Operations Impact Tracking
            </p>
          </div>
        </div>

        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono text-xs">
          <Globe className="w-3 h-3 mr-1" /> SDG Verified
        </Badge>
      </div>

      {/* Primary & Supporting SDGs Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Badge className="bg-emerald-600 text-white font-mono text-xs px-2.5 py-1 flex items-center space-x-1 shadow-sm">
          <Sparkles className="w-3 h-3 mr-1" />
          <span>Primary: SDG {primarySdg.code}</span>
        </Badge>
        {supportingSdgs.map((sdg) => (
          <Badge key={sdg.code} variant="outline" className="bg-emerald-500/5 text-emerald-300 border-emerald-500/20 font-mono text-xs">
            SDG {sdg.code}
          </Badge>
        ))}
      </div>

      {/* 3-Question Storytelling Engine */}
      <div className="p-3.5 rounded-lg bg-secondary/40 border border-border/60 space-y-2.5 text-xs">
        <div className="flex items-start space-x-2">
          <div className="mt-0.5 p-1 rounded bg-sky-500/10 text-sky-400 shrink-0">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-sky-400 uppercase text-[10px] tracking-wider block">
              1. What is happening?
            </span>
            <p className="text-muted-foreground leading-relaxed mt-0.5">{defaultNarrative.what}</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <div className="mt-0.5 p-1 rounded bg-amber-500/10 text-amber-400 shrink-0">
            <Target className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-amber-400 uppercase text-[10px] tracking-wider block">
              2. Why is it happening?
            </span>
            <p className="text-muted-foreground leading-relaxed mt-0.5">{defaultNarrative.why}</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <div className="mt-0.5 p-1 rounded bg-emerald-500/10 text-emerald-400 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-emerald-400 uppercase text-[10px] tracking-wider block">
              3. How does it improve sustainability?
            </span>
            <p className="text-muted-foreground leading-relaxed mt-0.5">{defaultNarrative.how}</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <div className="p-2.5 rounded-lg bg-background border border-border/50 text-center">
          <div className="flex items-center justify-center space-x-1 text-muted-foreground text-[10px]">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Battery Saved</span>
          </div>
          <p className="text-sm font-bold text-foreground mt-0.5 font-mono">
            {sustainability.metrics.batterySavedPct ?? 0}%
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-background border border-border/50 text-center">
          <div className="flex items-center justify-center space-x-1 text-muted-foreground text-[10px]">
            <Droplet className="w-3 h-3 text-blue-400" />
            <span>Water Saved</span>
          </div>
          <p className="text-sm font-bold text-foreground mt-0.5 font-mono">
            {sustainability.metrics.waterSavedLiters ?? 0}L
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-background border border-border/50 text-center">
          <div className="flex items-center justify-center space-x-1 text-muted-foreground text-[10px]">
            <Leaf className="w-3 h-3 text-emerald-400" />
            <span>Chemical Reduction</span>
          </div>
          <p className="text-sm font-bold text-foreground mt-0.5 font-mono">
            {sustainability.metrics.chemicalSavedPct ?? 0}%
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-background border border-border/50 text-center">
          <div className="flex items-center justify-center space-x-1 text-muted-foreground text-[10px]">
            <Wind className="w-3 h-3 text-teal-400" />
            <span>CO2 Avoided</span>
          </div>
          <p className="text-sm font-bold text-foreground mt-0.5 font-mono">
            {sustainability.metrics.co2AvoidedKg ?? 0}kg
          </p>
        </div>
      </div>
    </Card>
  );
}

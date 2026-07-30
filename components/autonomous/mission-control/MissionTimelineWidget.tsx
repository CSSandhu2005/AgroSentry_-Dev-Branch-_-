"use client";

import React from "react";
import { CheckCircle2, Circle, Clock, ShieldCheck, Navigation, Activity, Sparkles, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface TimelineStep {
  time: string;
  label: string;
  agent: string;
  status: "completed" | "in_progress" | "pending";
  description: string;
}

export interface MissionTimelineWidgetProps {
  steps?: TimelineStep[];
}

const defaultSteps: TimelineStep[] = [
  {
    time: "09:41 AM",
    label: "Farmer Intake / Voice Prompt",
    agent: "Bharat Voice Agent",
    status: "completed",
    description: 'Spoken request: "मेरे कपास के खेत में बीमारी लग रही है, ड्रोन से छिड़काव करो"',
  },
  {
    time: "09:42 AM",
    label: "Mission State Machine Initialized",
    agent: "Mission Orchestrator",
    status: "completed",
    description: "State transition: Created → Validated → Queued → Planning",
  },
  {
    time: "09:43 AM",
    label: "Pre-Flight Safety Matrix",
    agent: "Mission Safety Agent",
    status: "completed",
    description: "GPS RTK Fix: 3D, Battery: 84%, Wind: 8.2 km/h. Flight status PASSED.",
  },
  {
    time: "09:44 AM",
    label: "Autonomous Takeoff & Scout Flight",
    agent: "Precision Scout Agent",
    status: "completed",
    description: "Grid altitude 18.5m, 80% overlap. 42 sector images collected.",
  },
  {
    time: "09:47 AM",
    label: "Pathogen Diagnosis & Heatmap",
    agent: "Disease Surveillance Agent",
    status: "completed",
    description: "Detected Leaf Blight in Sector B (5.5% field area). High severity.",
  },
  {
    time: "09:48 AM",
    label: "Targeted 5% Spot Spraying",
    agent: "Targeted Spray Commander",
    status: "in_progress",
    description: "Spraying 0.3 acres vs 5.5 acres. 95% chemical reduction active.",
  },
  {
    time: "09:50 AM",
    label: "Verification Return Sweep",
    agent: "Verification Agent",
    status: "pending",
    description: "Scheduled post-treatment return scan to verify recovery.",
  },
  {
    time: "09:52 AM",
    label: "SDG Quantification & Report",
    agent: "SDG Compliance Agent",
    status: "pending",
    description: "Quantify CO₂ avoided, water saved, and generate PDF report.",
  },
];

export function MissionTimelineWidget({ steps = defaultSteps }: MissionTimelineWidgetProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-500" />
          <h3 className="font-semibold text-sm">Autonomous Mission Timeline</h3>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
          Live Sync
        </Badge>
      </div>

      <div className="relative border-l-2 border-muted ml-3 space-y-6 pl-5 py-1">
        {steps.map((step, idx) => (
          <div key={idx} className="relative group">
            {/* Dot Indicator */}
            <div className="absolute -left-[27px] top-0.5 bg-background">
              {step.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
              ) : step.status === "in_progress" ? (
                <div className="relative">
                  <Circle className="w-5 h-5 text-emerald-500 animate-spin" />
                  <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground/40" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground">{step.time}</span>
                <span className="font-medium text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {step.agent}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-foreground">{step.label}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

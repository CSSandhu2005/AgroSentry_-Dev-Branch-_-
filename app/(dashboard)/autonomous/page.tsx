"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Calendar,
  Clock,
  Zap,
  Sparkles,
  FileText,
  ShieldCheck,
  Navigation,
  Cpu,
  Leaf,
  BarChart3,
  Globe,
  Plus,
} from "lucide-react";
import { MissionStatusCard } from "@/components/autonomous/widgets/MissionStatusCard";
import { DroneTelemetryCard } from "@/components/autonomous/widgets/DroneTelemetryCard";
import { SdgMetricCard } from "@/components/autonomous/widgets/SdgMetricCard";

export default function AutonomousOperationsOverviewPage() {
  const operationsModules = [
    {
      title: "Mission Planning Studio",
      path: "/autonomous/mission-studio",
      icon: <Globe className="w-5 h-5 text-emerald-500" />,
      description: "Synchronized 2D Satellite boundary, Boustrophedon path planner, 3D farm twin, and dynamic replanning.",
      badge: "Flagship Studio",
    },
    {
      title: "Mission Control Center",
      path: "/autonomous/mission-control",
      icon: <Activity className="w-5 h-5 text-emerald-500" />,
      description: "NASA-style live execution command center, 7-stage autonomous mission pipeline, and observation queue.",
      badge: "Command Center",
    },
    {
      title: "Mission Planner",
      path: "/autonomous/mission-planner",
      icon: <Calendar className="w-5 h-5 text-blue-500" />,
      description: "Design autonomous missions, launch templates, or use Bharat Voice intake.",
      badge: "9 Templates",
    },
    {
      title: "Disease Intelligence Agent",
      path: "/autonomous/disease",
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      description: "Phase 4 Disease Agent: 5 internal engines transforming observation queue into verified crop health findings.",
      badge: "Phase 4 Agent",
    },
    {
      title: "Mission Queue",
      path: "/autonomous/mission-queue",
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      description: "Manage batched mission states (Queued, Planning, Executing, Verified).",
      badge: "3 Active",
    },
    {
      title: "Live Operations & Telemetry",
      path: "/autonomous/mission-control",
      icon: <Zap className="w-5 h-5 text-purple-500" />,
      description: "High-frequency GPS, RTK fix, speed, wind, and camera stream telemetry.",
      badge: "3D RTK",
    },
    {
      title: "Mission Replay",
      path: "/autonomous/mission-replay",
      icon: <Sparkles className="w-5 h-5 text-indigo-500" />,
      description: "Interactive step-by-step playback engine of past completed missions.",
      badge: "Playback",
    },
    {
      title: "Targeted Spraying",
      path: "/autonomous/spray",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      description: "Precision 5% spot spray execution contrasting 95% chemical reduction.",
      badge: "Phase 5 Commander",
    },
    {
      title: "Verification Sentinel",
      path: "/autonomous/verification",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      description: "Phase 6 Sentinel: QA audit, 100% target validation, and +87% canopy recovery audit.",
      badge: "Phase 6 QA",
    },
    {
      title: "SDG Impact Showcase",
      path: "/autonomous/sdg-impact",
      icon: <Sparkles className="w-5 h-5 text-emerald-300" />,
      description: "Phase 8 Showcase: Executive SDG 2, 6, 12, 13, 15 reports & 98/100 Mission Scorecard.",
      badge: "Phase 8 Showcase",
    },
    {
      title: "Mission History",
      path: "/autonomous/mission-history",
      icon: <FileText className="w-5 h-5 text-cyan-500" />,
      description: "Historical mission logs with 1-click Executive PDF Report exports.",
      badge: "Logs & PDF",
    },
    {
      title: "Mission Analytics",
      path: "/autonomous/mission-analytics",
      icon: <BarChart3 className="w-5 h-5 text-sky-500" />,
      description: "Flight hours, success rates, water savings, and area coverage charts.",
      badge: "Analytics",
    },
    {
      title: "Fleet & Profiles",
      path: "/autonomous/fleet",
      icon: <Navigation className="w-5 h-5 text-orange-500" />,
      description: "Drone hardware diagnostics, battery health, and sensor calibration.",
      badge: "Hardware",
    },
    {
      title: "Edge AI & Hardware",
      path: "/autonomous/edge-ai",
      icon: <Cpu className="w-5 h-5 text-rose-500" />,
      description: "Raspberry Pi CPU/RAM status, local AI model runtime, and camera link.",
      badge: "Raspberry Pi",
    },
    {
      title: "SDG Impact Engine",
      path: "/autonomous/sdg-impact",
      icon: <Leaf className="w-5 h-5 text-emerald-500" />,
      description: "Quantified resource savings for SDGs 2, 6, 12, 13, and 15.",
      badge: "SDG Score 94",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-card border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              AgroSentry 2.0 Enterprise
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">v1.0 Specifications</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Autonomous Mission Operations
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Transforming AI insights into real, verified physical drone execution. Pluggable Mission Executor Layer running closed-loop multi-agent workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/autonomous/mission-queue">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm text-xs">
              <Plus className="w-4 h-4 mr-1.5" /> Create New Mission
            </Button>
          </Link>
          <Link href="/autonomous/mission-control">
            <Button variant="outline" className="font-medium shadow-sm text-xs">
              <Activity className="w-4 h-4 mr-1.5" /> Launch Mission Control
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MissionStatusCard
          missionId="MSN-2026-042"
          type="Targeted Spray & Verification"
          status="Executing"
          targetField="Sector B — Cotton Parcel (5.5 Acres)"
          progress={68}
          activeAgent="Targeted Spray Commander"
        />

        <DroneTelemetryCard
          batteryPct={84}
          altitudeM={18.5}
          speedKmh={12.4}
          windSpeedKmh={8.2}
          gpsFix="3D RTK"
          piStatus="Connected"
          sprayerState="Active"
        />

        <SdgMetricCard
          chemicalSavedPct={95}
          waterSavedL={420}
          co2AvoidedKg={18.4}
          costSavedInr={3450}
          sdgBadges={[2, 6, 12, 13, 15]}
        />
      </div>

      {/* Module Navigation Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Autonomous Operations Suite</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {operationsModules.map((mod) => (
            <Link key={mod.path} href={mod.path}>
              <Card className="p-4 border bg-card hover:bg-accent/50 transition-colors shadow-sm rounded-xl space-y-2 h-full flex flex-col justify-between group cursor-pointer">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-secondary">{mod.icon}</div>
                    <Badge variant="outline" className="text-xs group-hover:border-emerald-500/50">
                      {mod.badge}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-base group-hover:text-emerald-500 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {mod.description}
                  </p>
                </div>
                <div className="pt-2 text-xs font-medium text-emerald-500 flex items-center justify-end">
                  Open Module &rarr;
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

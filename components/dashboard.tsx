'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { DashboardResponse } from '@/lib/agents/dashboard-agent';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Calendar,
  Compass,
  Cpu,
  Droplets,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Sprout,
  Stethoscope,
  TrendingUp,
  Zap,
} from 'lucide-react';

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Pending';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recently updated';
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} d ago`;
  } catch {
    return 'Recently updated';
  }
}

export function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Failed to load dashboard`);
        }
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        } else {
          throw new Error(json.error || 'Invalid API response');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 my-8 space-y-4 max-w-xl mx-auto text-center">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="max-w-md mx-auto my-8 border-destructive/40 bg-destructive/10 text-center">
        <CardHeader>
          <div className="mx-auto h-12 w-12 rounded-full bg-destructive/20 text-destructive flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle className="text-destructive font-bold text-lg">Failed to Load Dashboard</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{error || 'Could not connect to dashboard service.'}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center border-t-0 bg-transparent">
          <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Retry Connection
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const { overview, metrics, alerts, heroAgents, drone, activity, executivePulse } = data;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-4">
      {/* ── Efferd Header & Search Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
              Precision Agriculture OS
            </Badge>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {overview.village}, {overview.district ? `${overview.district}, ` : ''}{overview.state}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {overview.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            Real-time multi-agent intelligence and autonomous farm analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search farm metrics, agents, reports..."
              className="h-9 w-64 rounded-xl border border-input bg-background pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <Link
            href="/agent-chat"
            className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-sm"
          >
            <Bot className="h-4 w-4" /> Consult AI Assistant
          </Link>
        </div>
      </div>

      {/* ── Executive AI Pulse Banner ── */}
      <Card className="relative overflow-hidden bg-card border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <Badge variant="outline" className="text-[10px] font-bold tracking-wider uppercase">
                AI Command Pulse
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              Land Acreage: {overview.landSize} Acres
            </span>
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold text-foreground">
            {executivePulse.greeting}
          </CardTitle>
          <CardDescription className="text-sm font-semibold text-primary mt-0.5">
            {executivePulse.pulse}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            {executivePulse.summary}
          </p>

          {executivePulse.top_action_items.length > 0 && (
            <div className="rounded-xl bg-muted/50 p-4 border border-border">
              <div className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" /> Priority Agronomic Directives
              </div>
              <div className="flex flex-col gap-2">
                {executivePulse.top_action_items.map((item, i) => (
                  <div key={i} className="text-xs text-foreground/90 flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Efferd KPI Metric Cards Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Farm Health Gauge */}
        <Card className="p-4 flex flex-col items-center justify-center text-center border-border shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
            <Activity className="h-3 w-3" /> Farm Health
          </div>
          <div className="text-2xl md:text-3xl font-black text-foreground">
            {metrics.farmHealthScore}
            <span className="text-xs font-normal text-muted-foreground">/100</span>
          </div>
          <div className="text-[10px] font-semibold text-muted-foreground mt-1">
            {metrics.farmHealthScore >= 80 ? 'Optimal Vitals' : metrics.farmHealthScore >= 50 ? 'Moderate Risk' : 'Attention Needed'}
          </div>
        </Card>

        {/* Expected Yield */}
        <Card className="p-4 flex flex-col items-center justify-center text-center border-border shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Expected Yield
          </div>
          <div className="text-2xl md:text-3xl font-black text-foreground">
            {metrics.expectedYield > 0 ? `${metrics.expectedYield} t` : '—'}
          </div>
          <div className="text-[10px] font-semibold text-muted-foreground mt-1">Est. Total Harvest</div>
        </Card>

        {/* Spatial Score */}
        <Card className="p-4 flex flex-col items-center justify-center text-center border-border shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
            <Compass className="h-3 w-3" /> Spatial Score
          </div>
          <div className="text-2xl md:text-3xl font-black text-foreground">
            {metrics.layoutScore > 0 ? `${metrics.layoutScore}/100` : '—'}
          </div>
          <div className="text-[10px] font-semibold text-muted-foreground mt-1">Layout Efficiency</div>
        </Card>

        {/* Land Efficiency */}
        <Card className="p-4 flex flex-col items-center justify-center text-center border-border shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
            <Layers className="h-3 w-3" /> Land Efficiency
          </div>
          <div className="text-2xl md:text-3xl font-black text-foreground">
            {metrics.landEfficiency > 0 ? `${metrics.landEfficiency}%` : '—'}
          </div>
          <div className="text-[10px] font-semibold text-muted-foreground mt-1">Acreage Utilized</div>
        </Card>

        {/* Water Saving */}
        <Card className="p-4 flex flex-col items-center justify-center text-center border-border shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
            <Droplets className="h-3 w-3" /> Water Saved
          </div>
          <div className="text-2xl md:text-3xl font-black text-foreground">
            {metrics.waterSavingPct > 0 ? `${metrics.waterSavingPct}%` : '—'}
          </div>
          <div className="text-[10px] font-semibold text-muted-foreground mt-1">vs Traditional</div>
        </Card>

        {/* Drone Missions */}
        <Card className="p-4 flex flex-col items-center justify-center text-center border-border shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
            <Cpu className="h-3 w-3" /> Drone Flights
          </div>
          <div className="text-2xl md:text-3xl font-black text-foreground">
            {metrics.missionCount}
          </div>
          <div className="text-[10px] font-semibold text-muted-foreground mt-1">Active Missions</div>
        </Card>
      </div>

      {/* ── Active Alerts ── */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className="flex items-center justify-between gap-4 p-4 border-border bg-card shadow-sm">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <div className="font-bold text-xs md:text-sm text-foreground">{alert.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{alert.message}</div>
                </div>
              </div>
              <Badge variant={alert.severity === 'High' ? 'destructive' : 'secondary'} className="text-[10px] uppercase font-bold tracking-wider">
                {alert.severity}
              </Badge>
            </Card>
          ))}
        </div>
      )}

      {/* ── Farm Overview Section ── */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Farm & Field Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">FARMER NAME</div>
              <div className="font-bold text-xs text-foreground mt-1">{overview.name}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">LOCATION</div>
              <div className="font-bold text-xs text-foreground mt-1">{overview.village}, {overview.state}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">LAND ACREAGE</div>
              <div className="font-bold text-xs text-foreground mt-1">{overview.landSize} Acres</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">SOIL TYPE</div>
              <div className="font-bold text-xs text-foreground mt-1">{overview.soilType}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">IRRIGATION SETUP</div>
              <div className="font-bold text-xs text-foreground mt-1">{overview.irrigation}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">FIELD BOUNDARY</div>
              <div className="mt-1">
                {heroAgents.fieldBoundary.available ? (
                  <Badge variant="secondary" className="text-xs font-semibold">
                    Saved ({heroAgents.fieldBoundary.summary?.area_acres || overview.landSize} ac)
                  </Badge>
                ) : (
                  <Link
                    href="/spatial-planner"
                    className="inline-flex items-center px-2.5 py-1 rounded-md border border-input bg-background text-[10px] font-bold hover:bg-accent transition-colors"
                  >
                    Draw Boundary
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── AI Hero Agent Matrix ── */}
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
          AI Hero Agent Matrix
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Crop Recommendation Agent */}
          <Card className="flex flex-col justify-between border-border bg-card shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sprout className="h-4 w-4 text-primary" /> Crop Advisor Agent
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {heroAgents.recommendation.available ? formatRelativeTime(heroAgents.recommendation.updatedAt) : 'Pending'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {heroAgents.recommendation.available && heroAgents.recommendation.summary ? (
                <>
                  <div className="text-sm font-bold text-foreground mb-1">
                    {heroAgents.recommendation.summary.recommended_crops}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Season: {heroAgents.recommendation.summary.season || 'Kharif'} · Confidence: {heroAgents.recommendation.summary.confidence}%
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground italic py-2">No recommendation analysis generated yet.</div>
              )}
            </CardContent>
            <CardFooter className="pt-2 border-t border-border">
              <Link
                href="/recommendation"
                className="w-full flex items-center justify-between text-xs font-semibold py-1 text-foreground hover:text-primary transition-colors"
              >
                <span>Open Crop Advisor</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardFooter>
          </Card>

          {/* 2. Crop Planning Agent */}
          <Card className="flex flex-col justify-between border-border bg-card shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" /> Crop Planner Agent
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {heroAgents.cropPlan.available ? formatRelativeTime(heroAgents.cropPlan.updatedAt) : 'Pending'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {heroAgents.cropPlan.available && heroAgents.cropPlan.summary ? (
                <>
                  <div className="text-sm font-bold text-foreground mb-1">
                    {heroAgents.cropPlan.summary.crop_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Status: {heroAgents.cropPlan.summary.status || 'Active'} · Sowing: {heroAgents.cropPlan.summary.sowing_schedule || 'Standard'}
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground italic py-2">No active crop plan configured.</div>
              )}
            </CardContent>
            <CardFooter className="pt-2 border-t border-border">
              <Link
                href="/plan"
                className="w-full flex items-center justify-between text-xs font-semibold py-1 text-foreground hover:text-primary transition-colors"
              >
                <span>View Crop Schedule</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardFooter>
          </Card>

          {/* 3. Disease Detection Agent */}
          <Card className="flex flex-col justify-between border-border bg-card shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4 text-primary" /> Disease Diagnostic Agent
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {heroAgents.disease.available ? formatRelativeTime(heroAgents.disease.updatedAt) : 'Pending'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {heroAgents.disease.available && heroAgents.disease.summary ? (
                <>
                  <div className="text-sm font-bold text-foreground mb-1">
                    {heroAgents.disease.summary.diagnosis}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    Severity: {heroAgents.disease.summary.severity} · {heroAgents.disease.summary.treatment}
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground italic py-2">No disease issues detected.</div>
              )}
            </CardContent>
            <CardFooter className="pt-2 border-t border-border">
              <Link
                href="/disease"
                className="w-full flex items-center justify-between text-xs font-semibold py-1 text-foreground hover:text-primary transition-colors"
              >
                <span>Run Leaf Scanner</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardFooter>
          </Card>

          {/* 4. Soil Nutrient Advisor */}
          <Card className="flex flex-col justify-between border-border bg-card shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-primary" /> Nutrient Risk Agent
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {heroAgents.nutrient.available ? formatRelativeTime(heroAgents.nutrient.updatedAt) : 'Pending'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {heroAgents.nutrient.available && heroAgents.nutrient.summary ? (
                <>
                  <div className="text-sm font-bold text-foreground mb-1">
                    {heroAgents.nutrient.summary.risk_level} Deficiency Risk
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {heroAgents.nutrient.summary.suggested_action}
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground italic py-2">Soil nutrient vitals normal.</div>
              )}
            </CardContent>
            <CardFooter className="pt-2 border-t border-border">
              <Link
                href="/nutrient"
                className="w-full flex items-center justify-between text-xs font-semibold py-1 text-foreground hover:text-primary transition-colors"
              >
                <span>Check Soil Health</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardFooter>
          </Card>

          {/* 5. Spatial Digital Twin */}
          <Card className="flex flex-col justify-between border-border bg-card shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-primary" /> Spatial Twin Agent
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {heroAgents.spatialTwin.available ? formatRelativeTime(heroAgents.spatialTwin.updatedAt) : 'Pending'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {heroAgents.spatialTwin.available && heroAgents.spatialTwin.summary ? (
                <>
                  <div className="text-sm font-bold text-foreground mb-1">
                    {heroAgents.spatialTwin.summary.main_crop} + {heroAgents.spatialTwin.summary.companion_crop}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Mode: {heroAgents.spatialTwin.summary.layout_mode} · Score: {heroAgents.spatialTwin.summary.layout_score}/100
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground italic py-2">No 3D spatial twin plan initialized.</div>
              )}
            </CardContent>
            <CardFooter className="pt-2 border-t border-border">
              <Link
                href="/spatial-planner"
                className="w-full flex items-center justify-between text-xs font-semibold py-1 text-foreground hover:text-primary transition-colors"
              >
                <span>Open 3D Spatial Twin</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardFooter>
          </Card>

          {/* 6. Field Boundary Mapping */}
          <Card className="flex flex-col justify-between border-border bg-card shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" /> Field Boundary Agent
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {heroAgents.fieldBoundary.available ? formatRelativeTime(heroAgents.fieldBoundary.updatedAt) : 'Pending'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {heroAgents.fieldBoundary.available && heroAgents.fieldBoundary.summary ? (
                <>
                  <div className="text-sm font-bold text-foreground mb-1">
                    {heroAgents.fieldBoundary.summary.area_acres} Acres Saved
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Centroid: {Number(heroAgents.fieldBoundary.summary.centroid?.lat || 0).toFixed(4)}, {Number(heroAgents.fieldBoundary.summary.centroid?.lng || 0).toFixed(4)}
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground italic py-2">No boundary polygon saved.</div>
              )}
            </CardContent>
            <CardFooter className="pt-2 border-t border-border">
              <Link
                href="/spatial-planner"
                className="w-full flex items-center justify-between text-xs font-semibold py-1 text-foreground hover:text-primary transition-colors"
              >
                <span>Draw Field Boundary</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* ── Drone Flight Roster ── */}
      {drone.missionCount > 0 && (
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" /> Autonomous Drone Flight Roster ({drone.missionCount} Missions)
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                Est. Flight: {drone.estimatedDurationMin} min · Battery Req: {drone.batteryRequiredPct}%
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {drone.missions.slice(0, 3).map((m) => (
                <div key={m.mission_id} className="p-3 rounded-xl bg-muted/40 border border-border text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-foreground">#{m.mission_id} {m.zone}</span>
                    <Badge variant={m.priority === 'High' ? 'destructive' : 'secondary'} className="text-[10px]">
                      {m.priority}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground">{m.action}</div>
                  <div className="text-[10px] text-muted-foreground/70 mt-1">Alt: {m.altitude_m}m · Speed: {m.speed_mps}m/s</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Recent Activity Stream ── */}
      {activity.length > 0 && (
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Recent Agent Activity Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {activity.slice(0, 5).map((act, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">{act.agent_name || act.agent}</span>
                    <span className="text-muted-foreground">{act.action_type || act.actionType}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{formatRelativeTime(act.timestamp || act.createdAt)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { LoadingState, ErrorState } from '@/components/shared/states';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ReportResponse } from '@/lib/agents/report-agent';
import { FileText, Printer, RefreshCw, AlertTriangle, CheckSquare, ShieldCheck, Plane } from 'lucide-react';

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Analysis Pending';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recently updated';
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Recently updated';
  }
}

export default function AdvisoryReportPage() {
  const [data, setData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadReport() {
      try {
        const res = await fetch('/api/report');
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Failed to fetch advisory report`);
        }
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        } else {
          throw new Error(json.error || 'Invalid API payload');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load report';
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-4">

      {/* Screen Action Toolbar */}
      <div className="no-print">
        <PageHeader
          title="Farm Analytical & Advisory Reports"
          subtitle="Print-ready official agronomic advisory synthesized by AgroSentry Multi-Agent System."
          icon={<FileText className="h-6 w-6" />}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="h-10 text-xs font-semibold border-slate-700 hover:bg-slate-800"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Refresh Data
              </Button>
              <Button
                onClick={handlePrint}
                disabled={loading || !!error || !data}
                className="h-10 text-xs font-bold bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white shadow-lg"
              >
                <Printer className="h-4 w-4 mr-1.5" />
                Print / Save PDF
              </Button>
            </div>
          }
        />
      </div>

      {/* Loading State */}
      {loading && <LoadingState message="Assembling Farm Advisory Artifact & Synthesizing Agent Intelligence..." />}

      {/* Error State */}
      {error && <ErrorState title="Failed to Load Advisory Report" message={error} onRetry={() => window.location.reload()} />}

      {/* Printable Report Document */}
      {data && (
        <div className="printable-report space-y-6 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-2xl">

          {/* Header / Cover */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b-2 border-sky-500/30 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-600 to-sky-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                🌿
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wider">AGROSENTRY AI</h2>
                <div className="text-[10px] font-black text-sky-400 tracking-widest uppercase">
                  OFFICIAL FARM ADVISORY REPORT
                </div>
              </div>
            </div>

            <div className="sm:text-right">
              <StatusBadge status={data.metadata.status} label={`STATUS: ${data.metadata.status}`} />
              <div className="text-xs font-bold text-white mt-1">{data.metadata.reportId}</div>
              <div className="text-[11px] text-slate-400">Generated: {formatDate(data.metadata.generatedAt)}</div>
            </div>
          </div>

          {/* Executive Summary */}
          <SectionCard
            title="📊 Executive Advisory Summary"
            action={
              <span className="text-[11px] text-emerald-400 font-bold">
                Completeness: {data.confidence.dataCompletenessPct}% · Confidence: {data.confidence.agronomicConfidencePct}%
              </span>
            }
            className="border-sky-500/30 bg-sky-950/20"
          >
            <h4 className="text-base font-extrabold text-white mb-1">{data.executiveSummary.status}</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{data.executiveSummary.currentSituation}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] font-black text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Identified Risks
                </div>
                <ul className="text-xs text-slate-300 space-y-1">
                  {data.executiveSummary.topRisks.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <CheckSquare className="h-3.5 w-3.5" /> Recommended Priority
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{data.executiveSummary.recommendedPriority}</p>
              </div>
            </div>
          </SectionCard>

          {/* Farm Overview */}
          <SectionCard title="🏡 Farm & Field Overview" className="border-slate-800">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Farmer Name</span>
                <span className="text-xs font-bold text-white">{data.overview.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Location</span>
                <span className="text-xs font-bold text-white">{data.overview.village}, {data.overview.state}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Acreage</span>
                <span className="text-xs font-bold text-emerald-400">{data.overview.landSize} Acres</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Soil Type</span>
                <span className="text-xs font-bold text-white">{data.overview.soilType}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Irrigation</span>
                <span className="text-xs font-bold text-white">{data.overview.irrigation}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Boundary</span>
                <StatusBadge status={data.fieldBoundary.available ? 'Low' : 'Medium'} label={data.fieldBoundary.available ? 'Saved' : 'Pending'} />
              </div>
            </div>
          </SectionCard>

          {/* Agent Matrix */}
          <SectionCard title="🤖 Hero Agent Advisory Matrix" className="border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-emerald-400">🌾 CROP RECOMMENDATION</span>
                  <span className="text-[10px] text-slate-400">{formatDate(data.recommendation.updatedAt)}</span>
                </div>
                {data.recommendation.available && data.recommendation.summary ? (
                  <>
                    <div className="text-sm font-bold text-white">{data.recommendation.summary.recommended_crops}</div>
                    <div className="text-xs text-slate-400 mt-1">Confidence: {data.recommendation.summary.confidence}%</div>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 italic">Analysis Pending</div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-amber-400">📅 CROP PLAN</span>
                  <span className="text-[10px] text-slate-400">{formatDate(data.cropPlan.updatedAt)}</span>
                </div>
                {data.cropPlan.available && data.cropPlan.summary ? (
                  <>
                    <div className="text-sm font-bold text-white">{data.cropPlan.summary.crop_name}</div>
                    <div className="text-xs text-slate-400 mt-1">Sowing: {data.cropPlan.summary.sowing_schedule}</div>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 italic">Analysis Pending</div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-rose-400">🔬 DISEASE DIAGNOSIS</span>
                  <span className="text-[10px] text-slate-400">{formatDate(data.disease.updatedAt)}</span>
                </div>
                {data.disease.available && data.disease.summary ? (
                  <>
                    <div className="text-sm font-bold text-rose-400">{data.disease.summary.diagnosis}</div>
                    <div className="text-xs text-slate-400 mt-1">{data.disease.summary.treatment}</div>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 italic">No Issues Detected</div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Drone Flight Missions Table */}
          {data.drone.missionCount > 0 && (
            <SectionCard
              title={
                <span className="flex items-center gap-2 text-amber-400">
                  <Plane className="h-4 w-4" /> Drone Flight Missions ({data.drone.missionCount})
                </span>
              }
              action={
                <span className="text-xs text-slate-400">
                  Duration: {data.drone.estimatedDurationMin} min · Battery: {data.drone.batteryRequiredPct}%
                </span>
              }
              className="border-amber-500/30"
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-xs">Mission ID</TableHead>
                    <TableHead className="text-xs">Zone</TableHead>
                    <TableHead className="text-xs">Action / Objective</TableHead>
                    <TableHead className="text-xs">Altitude</TableHead>
                    <TableHead className="text-xs">Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.drone.missions.map((m) => (
                    <TableRow key={m.mission_id} className="border-slate-800/60">
                      <TableCell className="font-bold text-white">#{m.mission_id}</TableCell>
                      <TableCell>{m.zone}</TableCell>
                      <TableCell>{m.action}</TableCell>
                      <TableCell>{m.altitude_m}m</TableCell>
                      <TableCell>
                        <StatusBadge status={m.priority} label={m.priority} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SectionCard>
          )}

          {/* Action Checklist */}
          <SectionCard title="✅ Deterministic Farmer Action Checklist" className="border-emerald-500/30">
            <div className="space-y-2.5">
              {data.actionPlan.map((act) => (
                <div key={act.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked={act.status === 'Completed'} className="h-4 w-4 rounded border-slate-700 accent-emerald-500 cursor-pointer" />
                    <div>
                      <div className="font-bold text-white">{act.task}</div>
                      <div className="text-[10px] text-slate-400">Category: {act.category} · Agent: {act.sourceAgent}</div>
                    </div>
                  </div>
                  <StatusBadge status={act.priority} label={act.priority} />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Technical Appendix */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div><strong className="text-slate-300">Dashboard:</strong> v{data.appendix.dashboardVersion}</div>
            <div><strong className="text-slate-300">Report:</strong> v{data.appendix.reportVersion}</div>
            <div><strong className="text-slate-300">Farmer ID:</strong> #{data.appendix.farmerId}</div>
            <div><strong className="text-slate-300">Rec ID:</strong> {data.appendix.recommendationId ? `#${data.appendix.recommendationId}` : 'N/A'}</div>
          </div>

          {/* Disclaimer */}
          <div className="pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>{data.disclaimer}</span>
          </div>

        </div>
      )}
    </div>
  );
}

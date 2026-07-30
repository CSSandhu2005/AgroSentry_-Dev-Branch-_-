'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { LoadingState } from '@/components/shared/states';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Sprout, Droplets, FlaskConical, Bug, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

interface Plan {
  plan_id: number;
  crop_name: string;
  status?: string;
  sowing_schedule: string;
  irrigation_plan: string;
  fertilizer_schedule: string;
  pest_alerts: string;
  harvest_timeline: string;
}

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/plan')
      .then((r) => r.json())
      .then((d) => {
        if (d.plan) setPlan(d.plan);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const crop_name = fd.get('crop_name') as string;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop_name }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) setPlan({ crop_name, status: 'Active', plan_id: data.plan_id, ...data });
      else if (res.status === 401) router.push('/intake');
      else setError(data.error || 'Failed to generate crop plan.');
    } catch {
      setLoading(false);
      setError('Connection error while generating crop plan.');
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-4">
        <PageHeader
          title="Agro-Economic Crop Planner"
          subtitle="Generate and track tailored sowing, irrigation, fertilizer, and pest management schedules."
          icon={<Calendar className="h-6 w-6" />}
        />

        {!plan && (
          <SectionCard
            title="Generate New Crop Schedule"
            description="Enter your target crop to create a comprehensive agronomic schedule."
            className="border-emerald-500/30"
          >
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Generation Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
              <Input
                name="crop_name"
                placeholder="Enter crop name (e.g. Wheat, Corn, Rice...)"
                required
                className="flex-1 h-11 text-xs"
              />
              <Button type="submit" disabled={loading} className="h-11 px-6 font-bold bg-emerald-600 hover:bg-emerald-500 text-white">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Plan'
                )}
              </Button>
            </form>
          </SectionCard>
        )}

        {loading && !plan && <LoadingState message="Fetching active crop plan schedule..." />}

        {plan && (
          <div className="space-y-6">
            <SectionCard
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl font-bold text-white flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-emerald-400" />
                    Crop Plan: {plan.crop_name}
                  </span>
                  <StatusBadge status={plan.status || 'Active'} label={plan.status || 'Active'} />
                </div>
              }
              className="border-emerald-500/40"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Calendar className="h-3.5 w-3.5 text-emerald-400" /> Sowing Schedule
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{plan.sowing_schedule}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Droplets className="h-3.5 w-3.5 text-sky-400" /> Irrigation Plan
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{plan.irrigation_plan}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <FlaskConical className="h-3.5 w-3.5 text-amber-400" /> Fertilizer Schedule
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{plan.fertilizer_schedule}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Sprout className="h-3.5 w-3.5 text-lime-400" /> Harvest Timeline
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{plan.harvest_timeline}</p>
                </div>

                <div className="md:col-span-2 p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Bug className="h-3.5 w-3.5" /> Pest & Disease Vulnerabilities
                  </span>
                  <p className="text-xs leading-relaxed font-medium">{plan.pest_alerts}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setPlan(null)}
                  className="h-10 text-xs font-semibold border-slate-700 hover:bg-slate-800 text-slate-300"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Generate New Plan
                </Button>
                <Button
                  onClick={() => router.push('/nutrient')}
                  className="h-10 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Proceed to Soil Nutrient Assessment <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </SectionCard>
          </div>
        )}
      </div>
  );
}

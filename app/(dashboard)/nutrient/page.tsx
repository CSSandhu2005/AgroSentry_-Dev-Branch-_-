'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Activity, FlaskConical, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface NutrientLog {
  id?: number;
  risk_level: 'High' | 'Medium' | 'Low';
  risk_probability: number;
  suggested_action: string;
  logged_at?: string;
}

export default function NutrientPage() {
  const [log, setLog] = useState<NutrientLog | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [nitrogen, setNitrogen] = useState('Medium');
  const [ph, setPh] = useState('6.5');
  const [moisture, setMoisture] = useState('Optimal');

  useEffect(() => {
    async function loadNutrientData() {
      try {
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        if (json.success && json.data?.heroAgents?.nutrient?.summary) {
          const n = json.data.heroAgents.nutrient.summary;
          setLog({
            id: n.id,
            risk_level: (n.risk_level as 'High' | 'Medium' | 'Low') || 'Low',
            risk_probability: n.risk_probability || 15,
            suggested_action: n.suggested_action || 'Soil nutrient levels optimal.',
            logged_at: json.data.heroAgents.nutrient.updatedAt,
          });
        }
      } catch {
        // Fallback
      }
    }
    loadNutrientData();
  }, []);

  const runEvaluation = async () => {
    setEvaluating(true);
    setMsg(null);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      const simulated: NutrientLog = {
        id: Date.now(),
        risk_level: nitrogen === 'Low' ? 'High' : 'Low',
        risk_probability: nitrogen === 'Low' ? 78 : 12,
        suggested_action: nitrogen === 'Low'
          ? 'Apply 45kg/acre Urea split dose and intercrop leguminous N-fixers (Soybean/Chickpea).'
          : 'Maintain current organic compost application.',
        logged_at: new Date().toISOString(),
      };
      setLog(simulated);
      setMsg({ text: 'Soil Nutrient Risk Logged Successfully.', type: 'success' });
    } catch {
      setMsg({ text: 'Failed to log nutrient test parameters.', type: 'error' });
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <FlaskConical className="h-6 w-6" />
          <h1>Soil Nutrient Risk & Health Assessment</h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Monitor N-P-K soil deficiencies, pH balance, and precise organic/chemical fertilizer recommendations.
        </p>
      </div>

      {/* Input Form Section */}
      <Card className="border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-base font-bold">Log Soil Test Parameters</CardTitle>
          <CardDescription className="text-xs">Enter current field soil test metrics to evaluate N-P-K balance and risks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="nitrogen">Nitrogen (N) Level</Label>
              <select
                id="nitrogen"
                value={nitrogen}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNitrogen(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Low">Low (Deficient)</option>
                <option value="Medium">Medium (Balanced)</option>
                <option value="High">High (Abundant)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ph">Soil pH Level</Label>
              <Input
                id="ph"
                type="text"
                value={ph}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPh(e.target.value)}
                placeholder="e.g. 6.5"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="moisture">Moisture Level</Label>
              <select
                id="moisture"
                value={moisture}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMoisture(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Dry">Dry</option>
                <option value="Optimal">Optimal</option>
                <option value="Waterlogged">Waterlogged</option>
              </select>
            </div>
          </div>

          <Button
            onClick={runEvaluation}
            disabled={evaluating}
            className="w-full h-11 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {evaluating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Evaluating Nutrient Risk...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Run Nutrient Risk Assessment
              </>
            )}
          </Button>

          {msg && (
            <Alert variant={msg.type === 'success' ? 'default' : 'destructive'} className="mt-4">
              {msg.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{msg.type === 'success' ? 'Assessment Complete' : 'Evaluation Failed'}</AlertTitle>
              <AlertDescription>{msg.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Logged Result */}
      {log && (
        <Card className="border-amber-500/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-400" />
              Active Soil Risk Status
            </CardTitle>
            <Badge variant={log.risk_level === 'High' ? 'destructive' : 'secondary'}>
              {log.risk_level} Risk ({log.risk_probability}%)
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold text-muted-foreground">
                <span>Risk Probability Index</span>
                <span className="text-foreground font-bold">{log.risk_probability}%</span>
              </div>
              <Progress value={log.risk_probability} />
            </div>

            <div className="p-4 rounded-xl bg-muted/60 border border-border">
              <div className="text-[11px] font-extrabold text-emerald-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Suggested Agronomic Action
              </div>
              <div className="text-sm text-foreground leading-relaxed font-medium">
                {log.suggested_action}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

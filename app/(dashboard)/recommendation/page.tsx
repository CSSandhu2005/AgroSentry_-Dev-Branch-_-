'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EmptyPlaceholder } from '@/components/shared/states';
import { Wheat, Sparkles, Sprout, ArrowRight, Lightbulb, AlertTriangle } from 'lucide-react';

interface CropItem {
  name: string;
  reason: string;
  care_tip: string;
  growing_days?: string;
  market_price?: string;
  profit_potential?: 'Low' | 'Medium' | 'High';
  confidence?: 'Highly Recommended' | 'Recommended' | 'Worth Considering';
}

interface RecResult {
  primary_crop: string;
  crops: CropItem[];
  overall_advice: string;
  ai_powered: boolean;
}

const CROP_EMOJI: Record<string, string> = {
  Cotton: '🌸', Rice: '🍚', Paddy: '🍚', Wheat: '🌾', Sugarcane: '🎋',
  Maize: '🌽', Corn: '🌽', Groundnut: '🥜', Soybean: '🫘', Sorghum: '🌿',
  Millet: '🌿', Millets: '🌿', Tomato: '🍅', Tomatoes: '🍅', Potato: '🥔',
  Onion: '🧅', Chickpea: '🫘', Lentil: '🫘', Sunflower: '🌻', Mustard: '🌼',
  Jowar: '🌿', Bajra: '🌿', Turmeric: '🫚', Ginger: '🫚', Garlic: '🧄',
  Peas: '🫛', Beans: '🫘', 'French Beans': '🫘',
};

function getCropEmoji(name: string) {
  for (const [key, emoji] of Object.entries(CROP_EMOJI)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return emoji;
  }
  return '🌱';
}

export default function RecommendationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    soil_type: 'Black',
    water_const: 'Medium',
    season: 'Kharif (June-October, Monsoon)',
    goal: 'Maximum yield and profit',
    farm_size: '',
    location: '',
    // ML Parameters
    n: '50',
    p: '50',
    k: '50',
    ph: '6.5',
    temp: '25',
    humidity: '60',
    rainfall: '100',
  });
  const [result, setResult] = useState<RecResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  function update(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) setResult(data);
      else setError(data.error || 'Failed to get recommendation.');
    } catch {
      setLoading(false);
      setError('Connection error while fetching crop recommendation.');
    }
  }

  async function generatePlan(cropName: string) {
    setPlanLoading(cropName);
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop_name: cropName }),
      });
      setPlanLoading(null);
      if (res.ok) router.push('/crop-plan');
      else if (res.status === 401) router.push('/intake');
    } catch {
      setPlanLoading(null);
    }
  }

  function getConfidence(i: number, crop: CropItem): string {
    if (crop.confidence) return crop.confidence;
    if (i === 0) return 'Highly Recommended';
    if (i === 1) return 'Recommended';
    return 'Worth Considering';
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-4">
      <PageHeader
        title="AI Crop Recommendations"
        subtitle="Answer a few simple questions about your farm to receive ML-powered crop suggestions."
        icon={<Wheat className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* FORM PANEL */}
        <SectionCard
          title="Farm & Soil Inputs"
          description="Provide field parameters to feed into the Random Forest prediction model."
          className="lg:col-span-5 border-emerald-500/30"
        >
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="soil_type">Soil Type</Label>
              <Select id="soil_type" value={form.soil_type} onChange={(e) => update('soil_type', e.target.value)}>
                <option value="Black">⬛ Black Soil (Dark, heavy, moisture-retaining)</option>
                <option value="Red">🟥 Red Soil (Thin, reddish, iron-rich)</option>
                <option value="Alluvial">🟫 Alluvial Soil (Fertile, found near rivers)</option>
                <option value="Laterite">🟤 Laterite Soil (Rocky, hilly regions)</option>
                <option value="Sandy">🟡 Sandy Soil (Dry, loose, drains fast)</option>
                <option value="Clay">🔵 Clay Soil (Heavy, sticky when wet)</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="water_const">Water Availability</Label>
              <Select id="water_const" value={form.water_const} onChange={(e) => update('water_const', e.target.value)}>
                <option value="Low">💧 Low — Only rainwater, no irrigation</option>
                <option value="Medium">💧💧 Medium — Some irrigation available</option>
                <option value="High">💧💧💧 High — Good irrigation / near water source</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="season">Planting Season</Label>
              <Select id="season" value={form.season} onChange={(e) => update('season', e.target.value)}>
                <option value="Kharif (June-October, Monsoon)">☔ Kharif (June–Oct, Monsoon)</option>
                <option value="Rabi (November-March, Winter)">❄️ Rabi (Nov–Mar, Winter)</option>
                <option value="Zaid (March-June, Summer)">☀️ Zaid (Mar–Jun, Summer)</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="goal">Primary Goal</Label>
              <Select id="goal" value={form.goal} onChange={(e) => update('goal', e.target.value)}>
                <option value="Maximum yield and profit">💰 Maximum yield and profit</option>
                <option value="Low water usage and drought resistance">🌵 Low water usage (drought-resistant)</option>
                <option value="Soil health improvement">🌿 Improve soil health (legumes)</option>
                <option value="Fastest harvest time">⚡ Fastest harvest time</option>
                <option value="Organic farming">🍃 Organic farming methods</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="farm_size">Farm Size (optional)</Label>
                <Input id="farm_size" placeholder="e.g. 2 acres" value={form.farm_size} onChange={(e) => update('farm_size', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="location">Location (optional)</Label>
                <Input id="location" placeholder="e.g. Pune, MH" value={form.location} onChange={(e) => update('location', e.target.value)} />
              </div>
            </div>

            {/* Advanced ML Soil Parameters */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Advanced ML Parameters
              </div>
              <p className="text-[11px] text-slate-400">Values passed into the Random Forest prediction engine.</p>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <Label htmlFor="n" className="text-[10px]">Nitrogen (N)</Label>
                  <Input id="n" type="number" value={form.n} onChange={(e) => update('n', e.target.value)} className="h-8 text-xs" />
                </div>
                <div>
                  <Label htmlFor="p" className="text-[10px]">Phosphorus (P)</Label>
                  <Input id="p" type="number" value={form.p} onChange={(e) => update('p', e.target.value)} className="h-8 text-xs" />
                </div>
                <div>
                  <Label htmlFor="k" className="text-[10px]">Potassium (K)</Label>
                  <Input id="k" type="number" value={form.k} onChange={(e) => update('k', e.target.value)} className="h-8 text-xs" />
                </div>
                <div>
                  <Label htmlFor="ph" className="text-[10px]">pH Level</Label>
                  <Input id="ph" type="number" step="0.1" value={form.ph} onChange={(e) => update('ph', e.target.value)} className="h-8 text-xs" />
                </div>
                <div>
                  <Label htmlFor="temp" className="text-[10px]">Temp (°C)</Label>
                  <Input id="temp" type="number" step="0.1" value={form.temp} onChange={(e) => update('temp', e.target.value)} className="h-8 text-xs" />
                </div>
                <div>
                  <Label htmlFor="humidity" className="text-[10px]">Humidity (%)</Label>
                  <Input id="humidity" type="number" step="0.1" value={form.humidity} onChange={(e) => update('humidity', e.target.value)} className="h-8 text-xs" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-lg flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Consulting AI Agronomist...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Get AI Recommendation
                </>
              )}
            </Button>
          </form>
        </SectionCard>

        {/* RESULTS / DISPLAY */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {result ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Agronomic Crop Recommendations
                </h3>
                {result.ai_powered && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                    ✨ AI POWERED
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                {result.crops.map((crop, i) => {
                  const confidence = getConfidence(i, crop);
                  const profit = crop.profit_potential || (i === 0 ? 'High' : i === 1 ? 'Medium' : 'Low');

                  return (
                    <SectionCard
                      key={i}
                      className={i === 0 ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-slate-800'}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getCropEmoji(crop.name)}</span>
                          <div>
                            <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                              {crop.name}
                              {i === 0 && (
                                <Badge className="bg-emerald-600 text-white text-[9px] font-black uppercase">
                                  🏆 TOP PICK
                                </Badge>
                              )}
                            </h4>
                            <StatusBadge status={confidence} label={confidence} className="mt-1" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 my-3 text-center">
                        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                          <span className="text-[9px] text-slate-400 block font-bold uppercase">Duration</span>
                          <span className="text-xs font-bold text-white">{crop.growing_days || '90–120 days'}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                          <span className="text-[9px] text-slate-400 block font-bold uppercase">Mandi Price</span>
                          <span className="text-xs font-bold text-white">{crop.market_price || '₹ Market Rate'}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                          <span className="text-[9px] text-slate-400 block font-bold uppercase">Profit</span>
                          <StatusBadge status={profit} label={profit} dot={false} />
                        </div>
                      </div>

                      {crop.reason && (
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {crop.reason}
                        </p>
                      )}

                      {crop.care_tip && (
                        <div className="p-3 rounded-lg bg-emerald-950/30 border-l-2 border-emerald-400 text-xs text-emerald-300 mb-4 flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{crop.care_tip}</span>
                        </div>
                      )}

                      <Button
                        onClick={() => generatePlan(crop.name)}
                        disabled={planLoading !== null}
                        className="w-full h-10 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-2"
                      >
                        {planLoading === crop.name ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating Plan...
                          </>
                        ) : (
                          <>
                            Generate Schedule for {crop.name} <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </SectionCard>
                  );
                })}
              </div>

              {result.overall_advice && (
                <Alert variant="warning">
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Agronomist&apos;s Overall Advice</AlertTitle>
                  <AlertDescription>{result.overall_advice}</AlertDescription>
                </Alert>
              )}
            </>
          ) : (
            <EmptyPlaceholder
              title="Ready to Analyze Your Farm"
              description="Fill out the soil, water, and season details on the left and click 'Get AI Recommendation' to generate personalized crop recommendations."
              icon={<Sprout className="h-8 w-8 text-emerald-400" />}
              className="h-full min-h-[420px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}

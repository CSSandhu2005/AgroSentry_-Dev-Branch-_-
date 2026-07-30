'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Home, ArrowRight, AlertTriangle } from 'lucide-react';

export default function IntakeForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    land_acres: '',
    village: '',
    district: '',
    state: '',
    soil_type: 'Black',
    irrigation: 'Adequate',
    primary_crops: '',
    economic_class: 'Smallholder',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) router.push('/dashboard');
      else setError(data.error || 'Failed to save farm profile');
    } catch {
      setLoading(false);
      setError('Connection error saving farm profile.');
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto py-4">
        <PageHeader
          title="Farm Profile Setup"
          subtitle="Tell us about your farm so we can tailor precision AI recommendations."
          icon={<Home className="h-6 w-6" />}
        />

        <SectionCard className="border-emerald-500/30">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Profile Setup Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                required
                className="h-11 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="land_acres">Land Size (Acres)</Label>
                <Input
                  id="land_acres"
                  type="number"
                  step="0.1"
                  value={form.land_acres}
                  onChange={(e) => update('land_acres', e.target.value)}
                  placeholder="e.g. 5.5"
                  required
                  className="h-11 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village"
                  value={form.village}
                  onChange={(e) => update('village', e.target.value)}
                  placeholder="e.g. Rampura"
                  required
                  className="h-11 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={form.district}
                  onChange={(e) => update('district', e.target.value)}
                  placeholder="e.g. Indore"
                  className="h-11 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={form.state}
                  onChange={(e) => update('state', e.target.value)}
                  placeholder="e.g. MP"
                  className="h-11 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="soil_type">Soil Type</Label>
                <Input
                  id="soil_type"
                  value={form.soil_type}
                  onChange={(e) => update('soil_type', e.target.value)}
                  placeholder="e.g. Black"
                  className="h-11 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="irrigation">Irrigation Access</Label>
                <Select
                  id="irrigation"
                  value={form.irrigation}
                  onChange={(e) => update('irrigation', e.target.value)}
                >
                  <option>Rainfed only</option>
                  <option>Borewell</option>
                  <option>Canal irrigation</option>
                  <option>Adequate</option>
                  <option>Water-stressed</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="primary_crops">Primary Crops</Label>
              <Input
                id="primary_crops"
                value={form.primary_crops}
                onChange={(e) => update('primary_crops', e.target.value)}
                placeholder="e.g. Wheat, Soybean"
                className="h-11 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="economic_class">Economic Class</Label>
              <Input
                id="economic_class"
                value={form.economic_class}
                onChange={(e) => update('economic_class', e.target.value)}
                placeholder="e.g. Smallholder"
                className="h-11 text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  Continue to Dashboard <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </SectionCard>
      </div>
  );
}

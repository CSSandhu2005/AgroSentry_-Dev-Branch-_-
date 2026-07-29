// src/app/intake/IntakeForm.tsx — Client-only form component
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

  function update(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) router.push('/');
    else setError(data.error || 'Failed to save profile');
  }

  return (
    <div className="page-container" style={{ maxWidth: 600 }}>
      <div className="page-header">
        <h1>🏡 Farm Profile Setup</h1>
        <p>Tell us about your farm so we can tailor our AI recommendations.</p>
      </div>
      <div className="card fade-in">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input className="form-control" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Ramesh Kumar" required />
          </div>
          <div className="input-row">
            <div className="form-group">
              <label>Land Size (acres)</label>
              <input className="form-control" type="number" step="0.1" value={form.land_acres} onChange={e => update('land_acres', e.target.value)} placeholder="e.g. 5.5" required />
            </div>
            <div className="form-group">
              <label>Village</label>
              <input className="form-control" value={form.village} onChange={e => update('village', e.target.value)} placeholder="e.g. Rampura" required />
            </div>
          </div>
          <div className="input-row">
            <div className="form-group">
              <label>District</label>
              <input className="form-control" value={form.district} onChange={e => update('district', e.target.value)} placeholder="e.g. Indore" />
            </div>
            <div className="form-group">
              <label>State</label>
              <input className="form-control" value={form.state} onChange={e => update('state', e.target.value)} placeholder="e.g. MP" />
            </div>
          </div>
          <div className="input-row">
            <div className="form-group">
              <label>Soil Type</label>
              <input className="form-control" value={form.soil_type} onChange={e => update('soil_type', e.target.value)} placeholder="e.g. Black" />
            </div>
            <div className="form-group">
              <label>Irrigation</label>
              <select className="form-control" value={form.irrigation} onChange={e => update('irrigation', e.target.value)}>
                <option>Rainfed only</option>
                <option>Borewell</option>
                <option>Canal irrigation</option>
                <option>Adequate</option>
                <option>Water-stressed</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Primary Crops</label>
            <input className="form-control" value={form.primary_crops} onChange={e => update('primary_crops', e.target.value)} placeholder="e.g. Wheat, Soybean" />
          </div>
          <div className="form-group">
            <label>Economic Class</label>
            <input className="form-control" value={form.economic_class} onChange={e => update('economic_class', e.target.value)} placeholder="e.g. Smallholder" />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? <><span className="spinner" /> Saving...</> : 'Continue to Dashboard →'}
          </button>
        </form>
      </div>
    </div>
  );
}

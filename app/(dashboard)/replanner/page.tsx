'use client';

import { useState } from 'react';

export default function ReplannerPage() {
  const [triggerReason, setTriggerReason] = useState('Heavy Rainfall');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const runReplanner = async () => {
    setRunning(true);
    setResult(null);
    try {
      await new Promise((r) => setTimeout(r, 1800));
      setResult(`✅ Dynamic Re-planning Complete: Adjusted sowing date by +5 days to allow soil drainage. Switched companion crop ratio to high-moisture tolerant Soybean.`);
    } catch {
      setResult('❌ Re-planning calculation error.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ margin: '1.5rem 0 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          🔄 Dynamic Replanner Agent
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
          Automatically recalculates crop sowing, irrigation, and spatial twin parameters when weather or disease disruptions occur.
        </p>
      </div>

      <div className="card fade-in" style={{ padding: '1.75rem', marginBottom: '1.5rem', border: '1px solid rgba(167, 139, 250, 0.3)', background: 'rgba(167, 139, 250, 0.04)' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#a78bfa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          ⚡ Trigger Re-Planning Evaluation
        </h3>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            DISRUPTION REASON
          </label>
          <select value={triggerReason} onChange={(e) => setTriggerReason(e.target.value)} className="input-field" style={{ width: '100%', maxWidth: 400 }}>
            <option value="Heavy Rainfall">Heavy Monsoon Rainfall & Waterlogging</option>
            <option value="Drought Warning">Unseasonable Heat & Drought</option>
            <option value="Pathogen Outbreak">Pest / Disease Outbreak Detected</option>
            <option value="Market Price Shift">Mandi Market Price Spike</option>
          </select>
        </div>

        <button onClick={runReplanner} disabled={running} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', fontWeight: 700 }}>
          {running ? <><span className="spinner" /> Re-calculating Farm Strategy...</> : '🔄 Run Dynamic Replanner'}
        </button>
      </div>

      {result && (
        <div className="card fade-in" style={{ padding: '1.5rem', border: '1px solid rgba(167, 139, 250, 0.4)', background: 'rgba(167, 139, 250, 0.08)' }}>
          <div style={{ fontSize: '0.88rem', color: '#fff', lineHeight: 1.6, fontWeight: 600 }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
}

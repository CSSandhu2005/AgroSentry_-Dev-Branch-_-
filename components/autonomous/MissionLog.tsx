// components/autonomous/MissionLog.tsx
'use client';

import React from 'react';
import { StructuredMissionLog } from '@/lib/mission/types';
import { Badge } from '@/components/ui/badge';
import { Terminal, AlertTriangle, CheckCircle, Info, Cpu, Activity } from 'lucide-react';

interface MissionLogProps {
  logs: StructuredMissionLog[];
  className?: string;
}

export function MissionLog({ logs, className = '' }: MissionLogProps) {
  const getAgentBadge = (agent: StructuredMissionLog['agent']) => {
    switch (agent) {
      case 'SYSTEM':
        return <Badge variant="outline" className="bg-slate-500/10 text-slate-400 border-slate-500/30 text-[10px] font-mono">SYS</Badge>;
      case 'PLANNER':
        return <Badge variant="outline" className="bg-sky-500/10 text-sky-400 border-sky-500/30 text-[10px] font-mono">PLANNER</Badge>;
      case 'SCOUT':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] font-mono">SCOUT</Badge>;
      case 'DISEASE':
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-[10px] font-mono">DISEASE</Badge>;
      case 'SPRAY':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-[10px] font-mono">SPRAY</Badge>;
      case 'VERIFICATION':
        return <Badge variant="outline" className="bg-teal-500/10 text-teal-400 border-teal-500/30 text-[10px] font-mono">VERIFY</Badge>;
      default:
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-mono">SDG</Badge>;
    }
  };

  const getSeverityIcon = (sev: StructuredMissionLog['severity']) => {
    switch (sev) {
      case 'SUCCESS':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'WARN':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'ERROR':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className={`p-4 rounded-xl border bg-slate-950 text-slate-200 space-y-3 font-mono ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Autonomous Operations Replay Log
          </span>
        </div>
        <div className="flex items-center space-x-1 text-[11px] text-slate-400">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>{logs.length} Events Recorded</span>
        </div>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs scrollbar-thin scrollbar-thumb-slate-800">
        {logs.length === 0 ? (
          <p className="text-slate-500 italic py-2 text-center text-xs">No mission events logged yet.</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start space-x-2.5 p-2 rounded bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="mt-0.5">{getSeverityIcon(log.severity)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getAgentBadge(log.agent)}
                    <span className="font-semibold text-slate-200 text-xs">{log.event}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{formatTimestamp(log.timestamp)}</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-sans">{log.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

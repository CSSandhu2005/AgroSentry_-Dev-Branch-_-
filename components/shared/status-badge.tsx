import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusSeverity = 'High' | 'Medium' | 'Low' | 'Success' | 'Warning' | 'Error' | 'Info' | string;

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusSeverity;
  label?: string;
  dot?: boolean;
}

export function StatusBadge({ status, label, dot = true, className, ...props }: StatusBadgeProps) {
  const normalized = (status || '').toLowerCase();
  
  let variantStyle = 'bg-slate-800/80 text-slate-300 border-slate-700/60';
  let dotColor = 'bg-slate-400';

  if (normalized === 'high' || normalized === 'error' || normalized === 'deficient') {
    variantStyle = 'bg-rose-500/15 text-rose-400 border-rose-500/40 dark:bg-rose-950/30';
    dotColor = 'bg-rose-400 animate-pulse';
  } else if (normalized === 'medium' || normalized === 'warning' || normalized === 'moderate') {
    variantStyle = 'bg-amber-500/15 text-amber-400 border-amber-500/40 dark:bg-amber-950/30';
    dotColor = 'bg-amber-400';
  } else if (normalized === 'low' || normalized === 'success' || normalized === 'optimal' || normalized === 'active') {
    variantStyle = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 dark:bg-emerald-950/30';
    dotColor = 'bg-emerald-400';
  } else if (normalized === 'info' || normalized === 'pending') {
    variantStyle = 'bg-sky-500/15 text-sky-400 border-sky-500/40 dark:bg-sky-950/30';
    dotColor = 'bg-sky-400';
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-colors border',
        variantStyle,
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColor)} />}
      <span>{label || status}</span>
    </Badge>
  );
}

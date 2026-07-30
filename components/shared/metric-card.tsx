import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  accentColor?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendType = 'positive',
  accentColor,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('bg-slate-900/80 border-slate-800/80 shadow-xl backdrop-blur-xl hover:border-slate-700/80 transition-all', className)}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </CardTitle>
        {icon && <div className="text-slate-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-white tracking-tight" style={accentColor ? { color: accentColor } : undefined}>
          {value}
        </div>
        {(subtitle || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            {trend && (
              <span
                className={cn(
                  'font-semibold',
                  trendType === 'positive' && 'text-emerald-400',
                  trendType === 'negative' && 'text-rose-400',
                  trendType === 'neutral' && 'text-slate-400'
                )}
              >
                {trend}
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, icon, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/40', className)}>
      <div className="flex items-start gap-3">
        {icon && <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">{icon}</div>}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            {title}
          </h1>
          {subtitle && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface SectionCardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  headerClassName,
  contentClassName,
}: SectionCardProps) {
  return (
    <Card className={cn('bg-slate-900/80 border-slate-800/80 shadow-xl backdrop-blur-xl', className)}>
      {(title || description || action) && (
        <CardHeader className={cn('pb-3 flex flex-row items-start justify-between space-y-0', headerClassName)}>
          <div>
            {title && <CardTitle className="text-sm font-extrabold text-white tracking-wide uppercase">{title}</CardTitle>}
            {description && <CardDescription className="text-xs text-slate-400 mt-1">{description}</CardDescription>}
          </div>
          {action && <div className="ml-4 shrink-0">{action}</div>}
        </CardHeader>
      )}
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

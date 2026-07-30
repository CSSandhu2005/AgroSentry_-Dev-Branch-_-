import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading AgroSentry data...', className }: { message?: string; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center min-h-[160px]', className)}>
      <Loader2 className="h-7 w-7 animate-spin text-primary mb-3" />
      <p className="text-xs font-semibold text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}

export function EmptyPlaceholder({
  title = 'No Data Available',
  description = 'There are no items recorded for this section yet.',
  action,
  icon,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-border/60 bg-muted/20 min-h-[180px]', className)}>
      <div className="p-3 rounded-full bg-muted text-muted-foreground mb-3">
        {icon || <Inbox className="h-6 w-6 opacity-60" />}
      </div>
      <h4 className="text-sm font-bold text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  title = 'Error Loading Data',
  message = 'An unexpected error occurred while fetching information.',
  onRetry,
  className,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <Alert variant="destructive" className={cn('my-4', className)}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground border border-destructive/40 transition-colors w-fit"
          >
            Retry Action
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}

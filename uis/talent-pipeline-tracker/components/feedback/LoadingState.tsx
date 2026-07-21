interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Loading…" }: LoadingStateProps) {
  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-surface p-6"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <div className="space-y-2">
        <div className="h-10 animate-pulse-soft rounded-md bg-muted-fill" />
        <div className="h-10 animate-pulse-soft rounded-md bg-muted-fill/80" />
        <div className="h-10 animate-pulse-soft rounded-md bg-muted-fill/60" />
      </div>
    </div>
  );
}

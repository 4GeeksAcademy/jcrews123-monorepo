interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="rounded-xl border border-danger/20 bg-danger-bg px-4 py-5 text-danger"
      role="alert"
    >
      <p className="font-semibold">Something went wrong</p>
      <p className="mt-1 text-sm">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-md bg-surface px-3 py-1.5 text-sm font-medium text-ink shadow-sm transition hover:bg-accent-soft"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

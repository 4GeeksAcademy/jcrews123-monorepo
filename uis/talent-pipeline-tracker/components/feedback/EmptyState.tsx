import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <h2 className="font-[family-name:var(--font-fraunces)] text-xl text-ink">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-5 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

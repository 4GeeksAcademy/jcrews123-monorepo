import { getStatusLabel } from "@/lib/labels/status";
import type { CandidateStatus } from "@/types/candidate";

const STATUS_STYLES: Record<CandidateStatus, string> = {
  received: "bg-[var(--color-status-received-bg)] text-[var(--color-status-received)]",
  in_progress:
    "bg-[var(--color-status-progress-bg)] text-[var(--color-status-progress)]",
  selected:
    "bg-[var(--color-status-selected-bg)] text-[var(--color-status-selected)]",
  discarded:
    "bg-[var(--color-status-discarded-bg)] text-[var(--color-status-discarded)]",
};

interface StatusBadgeProps {
  status: CandidateStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style =
    STATUS_STYLES[status as CandidateStatus] ??
    "bg-muted-fill text-ink-muted";

  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${style}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

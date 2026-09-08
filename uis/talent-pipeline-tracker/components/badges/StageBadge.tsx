import { getStageLabel } from "@/lib/labels/stage";
import type { CandidateStage } from "@/types/candidate";

const STAGE_STYLES: Record<CandidateStage, string> = {
  pending: "bg-[var(--color-stage-pending-bg)] text-[var(--color-stage-pending)]",
  review: "bg-[var(--color-stage-review-bg)] text-[var(--color-stage-review)]",
  personal_interview:
    "bg-[var(--color-stage-personal-bg)] text-[var(--color-stage-personal)]",
  technical_interview:
    "bg-[var(--color-stage-technical-bg)] text-[var(--color-stage-technical)]",
  offer_presented:
    "bg-[var(--color-stage-offer-bg)] text-[var(--color-stage-offer)]",
};

interface StageBadgeProps {
  stage: CandidateStage | string;
}

export function StageBadge({ stage }: StageBadgeProps) {
  const style =
    STAGE_STYLES[stage as CandidateStage] ?? "bg-muted-fill text-ink-muted";

  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${style}`}
    >
      {getStageLabel(stage)}
    </span>
  );
}

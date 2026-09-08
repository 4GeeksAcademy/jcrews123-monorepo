"use client";

import Link from "next/link";
import { StageBadge } from "@/components/badges/StageBadge";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { CandidateProfile } from "@/components/detail/CandidateProfile";
import { NotesPanel } from "@/components/detail/NotesPanel";
import { StatusStageForm } from "@/components/detail/StatusStageForm";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { useCandidate } from "@/hooks/useCandidate";

interface CandidateDetailPageProps {
  candidateId: string;
}

export function CandidateDetailPage({ candidateId }: CandidateDetailPageProps) {
  const {
    candidate,
    status,
    error,
    mutationStatus,
    mutationError,
    mutationSuccess,
    refetch,
    updateStatusStage,
  } = useCandidate(candidateId);

  if (status === "loading" || status === "idle") {
    return <LoadingState label="Loading candidate…" />;
  }

  if (status === "error" || !candidate) {
    return (
      <ErrorState
        message={error ?? "Candidate not found."}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/"
            className="text-sm font-medium text-ink-muted hover:text-accent"
          >
            ← Back to candidates
          </Link>
          <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-ink">
            {candidate.full_name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={candidate.status} />
            <StageBadge stage={candidate.stage} />
          </div>
        </div>
        <Link
          href={`/candidates/${candidate.id}/edit`}
          className="inline-flex rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:bg-accent-soft"
        >
          Edit candidate
        </Link>
      </div>

      <CandidateProfile candidate={candidate} />

      <StatusStageForm
        key={`${candidate.status}-${candidate.stage}-${candidate.updated_at}`}
        candidate={candidate}
        onSave={updateStatusStage}
        isSaving={mutationStatus === "loading"}
        success={mutationSuccess}
        error={mutationError}
      />

      <NotesPanel candidateId={candidate.id} />
    </div>
  );
}

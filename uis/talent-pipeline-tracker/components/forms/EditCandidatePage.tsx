"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CandidateForm } from "@/components/forms/CandidateForm";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { useCandidate } from "@/hooks/useCandidate";
import { updateCandidate } from "@/lib/api/records";
import type { CandidateCreate } from "@/types/candidate";

interface EditCandidatePageProps {
  candidateId: string;
}

export function EditCandidatePage({ candidateId }: EditCandidatePageProps) {
  const router = useRouter();
  const { candidate, status, error, refetch } = useCandidate(candidateId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (payload: CandidateCreate) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSuccess(null);

    try {
      await updateCandidate(candidateId, payload);
      setSuccess("Candidate updated.");
      router.push(`/candidates/${candidateId}`);
      return true;
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to update candidate",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href={`/candidates/${candidateId}`}
          className="text-sm font-medium text-ink-muted hover:text-accent"
        >
          ← Back to profile
        </Link>
        <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-ink">
          Edit candidate
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Correct data for {candidate.full_name}.
        </p>
      </div>

      <CandidateForm
        mode="edit"
        initial={candidate}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        success={success}
        error={submitError}
      />
    </div>
  );
}

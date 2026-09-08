"use client";

import { useState } from "react";
import { FormFeedback } from "@/components/feedback/FormFeedback";
import { STAGE_OPTIONS } from "@/lib/labels/stage";
import { STATUS_OPTIONS } from "@/lib/labels/status";
import type { Candidate, CandidateStage, CandidateStatus } from "@/types/candidate";

interface StatusStageFormProps {
  candidate: Candidate;
  onSave: (payload: {
    status: CandidateStatus;
    stage: CandidateStage;
  }) => Promise<boolean>;
  isSaving: boolean;
  success: string | null;
  error: string | null;
}

export function StatusStageForm({
  candidate,
  onSave,
  isSaving,
  success,
  error,
}: StatusStageFormProps) {
  const [status, setStatus] = useState<CandidateStatus>(candidate.status);
  const [stage, setStage] = useState<CandidateStage>(candidate.stage);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave({ status, stage });
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-ink">
        Pipeline status
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Update where this candidate sits in the Executive Assistant process.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">
              Status
            </span>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as CandidateStatus)
              }
              className="w-full rounded-md border border-border bg-paper px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">
              Stage
            </span>
            <select
              value={stage}
              onChange={(event) =>
                setStage(event.target.value as CandidateStage)
              }
              className="w-full rounded-md border border-border bg-paper px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            >
              {STAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <FormFeedback success={success} error={error} />

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save status & stage"}
        </button>
      </form>
    </section>
  );
}

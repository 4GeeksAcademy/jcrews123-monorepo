"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CandidateForm } from "@/components/forms/CandidateForm";
import { createCandidate } from "@/lib/api/records";
import type { CandidateCreate } from "@/types/candidate";

export function NewCandidatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (payload: CandidateCreate) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const created = await createCandidate(payload);
      setSuccess("Candidate registered. Opening their profile…");
      router.push(`/candidates/${created.id}`);
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to register candidate",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/"
          className="text-sm font-medium text-ink-muted hover:text-accent"
        >
          ← Back to candidates
        </Link>
        <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-ink">
          Register candidate
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Add someone who applied through another channel to the Brasaland
          Talent Pipeline.
        </p>
      </div>

      <CandidateForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        success={success}
        error={error}
      />
    </div>
  );
}

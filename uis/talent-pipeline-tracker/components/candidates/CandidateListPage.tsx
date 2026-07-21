"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CandidateFilters,
  CandidateSearch,
} from "@/components/candidates/CandidateFilters";
import { CandidateTable } from "@/components/candidates/CandidateTable";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { useCandidates } from "@/hooks/useCandidates";
import type { CandidateStage, CandidateStatus } from "@/types/candidate";

function CandidateListContent() {
  const searchParams = useSearchParams();
  const status = (searchParams.get("status") ?? "") as CandidateStatus | "";
  const stage = (searchParams.get("stage") ?? "") as CandidateStage | "";
  const search = searchParams.get("search") ?? "";

  const { candidates, total, status: loadStatus, error, refetch } =
    useCandidates({
      status,
      stage,
      search,
      limit: 100,
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-ink">
          Candidates
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Executive Assistant pipeline · Corporate headquarters, Medellín
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <CandidateSearch />
        <CandidateFilters />
      </div>

      {loadStatus === "loading" || loadStatus === "idle" ? (
        <LoadingState label="Loading candidates…" />
      ) : null}

      {loadStatus === "error" && error ? (
        <ErrorState message={error} onRetry={() => void refetch()} />
      ) : null}

      {loadStatus === "success" && candidates.length === 0 ? (
        <EmptyState
          title="No candidates match"
          description="Try clearing filters or register a candidate who applied through another channel."
          actionHref="/candidates/new"
          actionLabel="Register candidate"
        />
      ) : null}

      {loadStatus === "success" && candidates.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-ink-muted">
            Showing {candidates.length} of {total} candidates
          </p>
          <CandidateTable candidates={candidates} />
        </div>
      ) : null}
    </div>
  );
}

export function CandidateListPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading candidates…" />}>
      <CandidateListContent />
    </Suspense>
  );
}

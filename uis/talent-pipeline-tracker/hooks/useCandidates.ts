"use client";

import { useCallback, useEffect, useState } from "react";
import { getCandidates } from "@/lib/api/records";
import type {
  Candidate,
  CandidateStage,
  CandidateStatus,
  CandidatesListParams,
} from "@/types/candidate";

export type AsyncStatus = "idle" | "loading" | "success" | "error";

interface UseCandidatesResult {
  candidates: Candidate[];
  total: number;
  status: AsyncStatus;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCandidates(params: CandidatesListParams): UseCandidatesResult {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const statusFilter = params.status ?? "";
  const stageFilter = params.stage ?? "";
  const search = params.search ?? "";
  const page = params.page ?? 1;
  const limit = params.limit ?? 50;

  const refetch = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const response = await getCandidates({
        status: statusFilter as CandidateStatus | "",
        stage: stageFilter as CandidateStage | "",
        search,
        page,
        limit,
      });
      setCandidates(response.data);
      setTotal(response.total);
      setStatus("success");
    } catch (err) {
      setCandidates([]);
      setTotal(0);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to load candidates");
    }
  }, [statusFilter, stageFilter, search, page, limit]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { candidates, total, status, error, refetch };
}

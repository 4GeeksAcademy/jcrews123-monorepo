"use client";

import { useCallback, useEffect, useState } from "react";
import { getCandidate, patchCandidate } from "@/lib/api/records";
import type {
  Candidate,
  CandidatePatch,
} from "@/types/candidate";
import type { AsyncStatus } from "@/hooks/useCandidates";

interface UseCandidateResult {
  candidate: Candidate | null;
  status: AsyncStatus;
  error: string | null;
  mutationStatus: AsyncStatus;
  mutationError: string | null;
  mutationSuccess: string | null;
  refetch: () => Promise<void>;
  updateStatusStage: (payload: CandidatePatch) => Promise<boolean>;
  clearMutationFeedback: () => void;
}

export function useCandidate(id: string): UseCandidateResult {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [mutationStatus, setMutationStatus] = useState<AsyncStatus>("idle");
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [mutationSuccess, setMutationSuccess] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const data = await getCandidate(id);
      setCandidate(data);
      setStatus("success");
    } catch (err) {
      setCandidate(null);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to load candidate");
    }
  }, [id]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const updateStatusStage = useCallback(
    async (payload: CandidatePatch) => {
      setMutationStatus("loading");
      setMutationError(null);
      setMutationSuccess(null);

      try {
        const updated = await patchCandidate(id, payload);
        setCandidate(updated);
        setMutationStatus("success");
        setMutationSuccess("Status and stage updated.");
        return true;
      } catch (err) {
        setMutationStatus("error");
        setMutationError(
          err instanceof Error ? err.message : "Failed to update candidate",
        );
        return false;
      }
    },
    [id],
  );

  const clearMutationFeedback = useCallback(() => {
    setMutationError(null);
    setMutationSuccess(null);
    setMutationStatus("idle");
  }, []);

  return {
    candidate,
    status,
    error,
    mutationStatus,
    mutationError,
    mutationSuccess,
    refetch,
    updateStatusStage,
    clearMutationFeedback,
  };
}

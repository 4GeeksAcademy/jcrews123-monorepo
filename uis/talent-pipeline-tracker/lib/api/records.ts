import { apiFetch } from "@/lib/api/client";
import type {
  Candidate,
  CandidateCreate,
  CandidatePatch,
  CandidatesListParams,
  CandidatesListResponse,
} from "@/types/candidate";

function toQuery(params: CandidatesListParams): string {
  const searchParams = new URLSearchParams();

  if (params.status) searchParams.set("status", params.status);
  if (params.stage) searchParams.set("stage", params.stage);
  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getCandidates(
  params: CandidatesListParams = {},
): Promise<CandidatesListResponse> {
  return apiFetch<CandidatesListResponse>(`/records${toQuery(params)}`);
}

export async function getCandidate(id: string): Promise<Candidate> {
  return apiFetch<Candidate>(`/records/${id}`);
}

export async function createCandidate(
  payload: CandidateCreate,
): Promise<Candidate> {
  return apiFetch<Candidate>("/records", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCandidate(
  id: string,
  payload: CandidateCreate,
): Promise<Candidate> {
  return apiFetch<Candidate>(`/records/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function patchCandidate(
  id: string,
  payload: CandidatePatch,
): Promise<Candidate> {
  return apiFetch<Candidate>(`/records/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

import { apiFetch } from "@/lib/api-client";

export type InvalidBreakdown = {
  missing_location_id: number;
  invalid_or_missing_category: number;
  empty_description: number;
  missing_reporter_id: number;
  closed_without_score: number;
  score_out_of_range: number;
};

export type SatisfactionSummary = {
  scored_closed_count: number;
  total_closed_with_score: number;
  average_score: number;
  score_distribution: Record<number, number>;
};

export type IncidentAnalysisResult = {
  source_file: string;
  total_records: number;
  valid_count: number;
  invalid_count: number;
  invalid_breakdown: InvalidBreakdown;
  category_counts: Record<string, number>;
  status_counts: Record<string, number>;
  satisfaction: SatisfactionSummary;
};

export async function analyzeIncidentFile(
  file: File,
): Promise<IncidentAnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<IncidentAnalysisResult>("/api/incidents/analyze", {
    method: "POST",
    body: formData,
  });
}

export async function downloadIncidentExport(): Promise<void> {
  const { API_BASE } = await import("@/lib/api-client");
  const { getStoredToken } = await import("@/lib/auth-storage");
  const token = getStoredToken();

  const response = await fetch(`${API_BASE}/api/incidents/results/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (response.status === 401) {
    const { clearStoredToken } = await import("@/lib/auth-storage");
    clearStoredToken();
    window.location.href = "/login";
    throw new Error("Session expired. Please sign in again.");
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      detail?: string;
    } | null;
    throw new Error(body?.detail ?? `Export failed (${response.status})`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "incident-analysis-results.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export const INCIDENT_CATEGORIES = [
  "CUSTOMER_COMPLAINT",
  "EQUIPMENT",
  "SUPPLY",
  "FOOD_QUALITY",
  "STAFF",
] as const;

export const INCIDENT_STATUSES = ["OPEN", "CLOSED", "DISCARDED"] as const;

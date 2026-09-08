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

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

export async function analyzeIncidentFile(
  file: File,
): Promise<IncidentAnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/incidents/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      detail?: string;
    } | null;
    throw new Error(body?.detail ?? `Analysis failed (${response.status})`);
  }

  return response.json() as Promise<IncidentAnalysisResult>;
}

export async function downloadIncidentExport(): Promise<void> {
  const response = await fetch(`${API_BASE}/api/incidents/results/export`);

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

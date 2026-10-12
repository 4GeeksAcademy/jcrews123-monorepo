import { apiFetch } from "@/lib/api-client";

export type EventVolume = {
  date: string;
  event_type: string;
  count: number;
};

export type ErrorRate = {
  date: string;
  total_events: number;
  error_events: number;
  error_rate: number;
};

export type ApiLatency = {
  date: string;
  endpoint: string;
  average_ms: number;
  samples: number;
};

export type AuthFailureRate = {
  date: string;
  attempts: number;
  failures: number;
  failure_rate: number;
};

export type TelemetryReport = {
  period: { from: string; to: string };
  metrics: {
    events_per_day: EventVolume[];
    error_rate_by_day: ErrorRate[];
    api_latency_by_day: ApiLatency[];
    auth_failure_rate: AuthFailureRate[];
  };
};

export function fetchTelemetryReport(
  startDate?: string,
  endDate?: string,
): Promise<TelemetryReport> {
  const params = new URLSearchParams();
  if (startDate) params.set("start_date", new Date(startDate).toISOString());
  if (endDate) {
    const exclusiveEnd = new Date(endDate);
    exclusiveEnd.setUTCDate(exclusiveEnd.getUTCDate() + 1);
    params.set("end_date", exclusiveEnd.toISOString());
  }
  const query = params.size ? `?${params.toString()}` : "";
  return apiFetch<TelemetryReport>(`/telemetry/report${query}`);
}

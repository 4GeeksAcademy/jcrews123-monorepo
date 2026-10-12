"use client";

import { useEffect, useState } from "react";

import {
  fetchTelemetryReport,
  type TelemetryReport,
} from "@/lib/telemetry-api";

export function TelemetryReportPanel() {
  const [report, setReport] = useState<TelemetryReport | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(start?: string, end?: string) {
    setLoading(true);
    setError(null);
    try {
      setReport(await fetchTelemetryReport(start, end));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load telemetry.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    void fetchTelemetryReport()
      .then((data) => {
        if (active) setReport(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Could not load telemetry.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <form
        className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void load(startDate || undefined, endDate || undefined);
        }}
      >
        <label className="text-sm text-slate-700">
          From
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="ml-2 rounded border border-slate-300 px-2 py-1"
          />
        </label>
        <label className="text-sm text-slate-700">
          To
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="ml-2 rounded border border-slate-300 px-2 py-1"
          />
        </label>
        <button
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          type="submit"
        >
          Apply period
        </button>
      </form>

      {loading ? <p className="text-sm text-slate-600">Loading report…</p> : null}
      {error ? (
        <p className="rounded bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {report ? (
        <>
          <p className="text-sm text-slate-600">
            UTC period: {report.period.from} to {report.period.to}
          </p>
          <MetricTable
            title="Event volume by day and type"
            rows={report.metrics.events_per_day}
          />
          <MetricTable
            title="Error rate by day"
            rows={report.metrics.error_rate_by_day}
          />
          <MetricTable
            title="API latency by day"
            rows={report.metrics.api_latency_by_day}
          />
          <MetricTable
            title="Authentication failure rate"
            rows={report.metrics.auth_failure_rate}
          />
        </>
      ) : null}
    </div>
  );
}

function MetricTable({
  title,
  rows,
}: {
  title: string;
  rows: Record<string, string | number>[];
}) {
  const columns = rows.length ? Object.keys(rows[0]) : [];
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <h3 className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900">
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="px-4 py-5 text-sm text-slate-500">
          No events in this period.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-2 text-left font-medium text-slate-600"
                  >
                    {column.replaceAll("_", " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, index) => (
                <tr key={`${title}-${index}`}>
                  {columns.map((column) => (
                    <td key={column} className="px-4 py-2 text-slate-700">
                      {String(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

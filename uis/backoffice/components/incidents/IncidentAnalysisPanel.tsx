"use client";

import { useCallback, useState } from "react";
import {
  analyzeIncidentFile,
  downloadIncidentExport,
  INCIDENT_CATEGORIES,
  INCIDENT_STATUSES,
  type IncidentAnalysisResult,
} from "@/lib/incidents-api";

function pct(count: number, total: number): string {
  if (total === 0) return "0.0%";
  return `${((count / total) * 100).toFixed(1)}%`;
}

function SummaryTable({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; count: number; total: number }[];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="font-display text-lg font-semibold text-slate-900">
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Label</th>
              <th className="px-5 py-3 text-right">Count</th>
              <th className="px-5 py-3 text-right">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="px-5 py-3 font-medium text-slate-800">
                  {row.label}
                </td>
                <td className="px-5 py-3 text-right text-slate-700">
                  {row.count}
                </td>
                <td className="px-5 py-3 text-right text-slate-500">
                  {pct(row.count, row.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function IncidentAnalysisPanel() {
  const [result, setResult] = useState<IncidentAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const analysis = await analyzeIncidentFile(file);
      setResult(analysis);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void processFile(file);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const onExport = async () => {
    setExporting(true);
    setError(null);
    try {
      await downloadIncidentExport();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  };

  const breakdown = result?.invalid_breakdown;
  const hasInvalidDetails =
    breakdown &&
    (breakdown.missing_location_id > 0 ||
      breakdown.invalid_or_missing_category > 0 ||
      breakdown.empty_description > 0 ||
      breakdown.missing_reporter_id > 0 ||
      breakdown.closed_without_score > 0 ||
      breakdown.score_out_of_range > 0);

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-display text-lg font-semibold text-slate-900">
          Upload incident CSV
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Drag and drop or select the exported file from Operations. Analysis
          runs on the Brasaland API — data is not sent to external AI tools.
        </p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
            dragOver
              ? "border-indigo-400 bg-indigo-50"
              : "border-slate-300 bg-slate-50"
          }`}
        >
          <p className="text-sm text-slate-600">
            Drop CSV here or choose a file
          </p>
          <label className="mt-4 cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Select file
            <input
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={onFileChange}
              disabled={loading}
            />
          </label>
        </div>
        {loading && (
          <p className="mt-3 text-sm text-indigo-600" role="status">
            Analyzing file…
          </p>
        )}
        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </section>

      {result && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Total records",
                value: String(result.total_records),
                detail: result.source_file,
              },
              {
                label: "Valid records",
                value: String(result.valid_count),
                detail: "Passed Brasaland validation rules",
              },
              {
                label: "Invalid records",
                value: String(result.invalid_count),
                detail: "Excluded from category/status metrics",
              },
              {
                label: "Avg satisfaction",
                value: result.satisfaction.average_score.toFixed(2),
                detail: `${result.satisfaction.scored_closed_count} closed cases scored`,
              },
            ].map((card) => (
              <article
                key={card.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-slate-900">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-slate-500">{card.detail}</p>
              </article>
            ))}
          </section>

          {result.invalid_count > 0 && hasInvalidDetails && (
            <section
              className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm"
              role="alert"
            >
              <h3 className="font-display text-lg font-semibold text-amber-900">
                Invalid records detected ({result.invalid_count})
              </h3>
              <ul className="mt-3 space-y-1 text-sm text-amber-900">
                {breakdown.missing_location_id > 0 && (
                  <li>
                    Missing location_id: {breakdown.missing_location_id}
                  </li>
                )}
                {breakdown.invalid_or_missing_category > 0 && (
                  <li>
                    Invalid or missing category:{" "}
                    {breakdown.invalid_or_missing_category}
                  </li>
                )}
                {breakdown.empty_description > 0 && (
                  <li>Empty or too-short description: {breakdown.empty_description}</li>
                )}
                {breakdown.missing_reporter_id > 0 && (
                  <li>Missing reporter_id: {breakdown.missing_reporter_id}</li>
                )}
                {breakdown.closed_without_score > 0 && (
                  <li>
                    Closed without satisfaction score:{" "}
                    {breakdown.closed_without_score}
                  </li>
                )}
                {breakdown.score_out_of_range > 0 && (
                  <li>
                    Satisfaction score out of range: {breakdown.score_out_of_range}
                  </li>
                )}
              </ul>
            </section>
          )}

          <div className="grid gap-8 xl:grid-cols-2">
            <SummaryTable
              title="Breakdown by category"
              rows={INCIDENT_CATEGORIES.map((category) => ({
                label: category,
                count: result.category_counts[category] ?? 0,
                total: result.valid_count,
              }))}
            />
            <SummaryTable
              title="Breakdown by status"
              rows={INCIDENT_STATUSES.map((status) => ({
                label: status,
                count: result.status_counts[status] ?? 0,
                total: result.valid_count,
              }))}
            />
          </div>

          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Satisfaction index
                </h3>
                <p className="text-sm text-slate-600">
                  Closed cases with recorded scores
                </p>
              </div>
              <button
                type="button"
                onClick={() => void onExport()}
                disabled={exporting}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {exporting ? "Downloading…" : "Download results CSV"}
              </button>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map((score) => (
                <div
                  key={score}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-center"
                >
                  <p className="text-xs uppercase text-slate-500">Score {score}</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-slate-900">
                    {result.satisfaction.score_distribution[score] ?? 0}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

import type { OperationsDashboard } from "@/lib/operations-dashboard";

export function LocationPerformanceTable({
  data,
}: {
  data: OperationsDashboard;
}) {
  return (
    <section
      id="locations"
      aria-labelledby="locations-heading"
      className="rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 px-6 py-4">
        <h3
          id="locations-heading"
          className="font-display text-lg font-semibold text-slate-900"
        >
          Location performance (M2)
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          rankLocationsByPerformance + calculateLocationMargin from{" "}
          <code className="text-xs">@brasaland/operations</code>
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Location</th>
              <th className="px-6 py-3 font-semibold">City</th>
              <th className="px-6 py-3 font-semibold">Score</th>
              <th className="px-6 py-3 font-semibold">Margin (USD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.rankedLocations.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {row.name}
                </td>
                <td className="px-6 py-4 text-slate-700">
                  {row.city}, {row.country}
                </td>
                <td className="px-6 py-4 text-slate-700">
                  {row.score.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-slate-700">
                  ${row.marginUsd.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

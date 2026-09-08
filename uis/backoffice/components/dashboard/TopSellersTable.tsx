import type { OperationsDashboard } from "@/lib/operations-dashboard";

export function TopSellersTable({ data }: { data: OperationsDashboard }) {
  return (
    <section
      aria-labelledby="top-sellers-heading"
      className="rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 px-6 py-4">
        <h3
          id="top-sellers-heading"
          className="font-display text-lg font-semibold text-slate-900"
        >
          Top selling items (M2)
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          findTopSellingItems(sampleSales, sampleMenuItems)
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Item</th>
              <th className="px-6 py-3 font-semibold">Units sold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.topSellers.map((row) => (
              <tr key={row.name} className="hover:bg-slate-50/80">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {row.name}
                </td>
                <td className="px-6 py-4 text-slate-700">{row.totalSold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

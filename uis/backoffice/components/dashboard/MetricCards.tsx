import type { OperationsDashboard } from "@/lib/operations-dashboard";

export function MetricCards({ data }: { data: OperationsDashboard }) {
  const cards = [
    {
      label: "Daily revenue (USD)",
      value: `$${data.dailyRevenueUsd.toFixed(2)}`,
      detail: `From apps/operations · ${data.reportDate}`,
    },
    {
      label: "Average ticket (USD)",
      value: `$${data.averageTicketUsd.toFixed(2)}`,
      detail: "calculateAverageTicket(sampleSales)",
    },
    {
      label: "Active locations",
      value: String(data.activeLocationCount),
      detail: "Sample locations in M2 dataset",
    },
    {
      label: "Top seller",
      value: data.topSellers[0]?.name ?? "—",
      detail: data.topSellers[0]
        ? `${data.topSellers[0].totalSold} units sold`
        : "findTopSellingItems",
    },
  ];

  return (
    <section aria-labelledby="kpi-heading">
      <h3 id="kpi-heading" className="sr-only">
        Operations KPIs from M2
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((kpi) => (
          <article
            key={kpi.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-slate-900">
              {kpi.value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{kpi.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

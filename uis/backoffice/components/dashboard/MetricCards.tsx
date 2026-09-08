import { companyKpis } from "@/data/company";

export function MetricCards() {
  return (
    <section aria-labelledby="kpi-heading">
      <h3 id="kpi-heading" className="sr-only">
        Company KPIs
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {companyKpis.map((kpi) => (
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

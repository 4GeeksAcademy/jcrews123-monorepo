import { Header } from "@/components/layout/AppShell";
import { DepartmentTable } from "@/components/dashboard/DepartmentTable";
import { LocationPerformanceTable } from "@/components/dashboard/LocationPerformanceTable";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { TopSellersTable } from "@/components/dashboard/TopSellersTable";
import { buildOperationsDashboard } from "@/lib/operations-dashboard";

export default function DashboardPage() {
  const operations = buildOperationsDashboard();

  return (
    <>
      <Header />
      <main className="flex-1 space-y-8 px-8 py-8">
        <MetricCards data={operations} />
        <div className="grid gap-8 xl:grid-cols-2">
          <LocationPerformanceTable data={operations} />
          <TopSellersTable data={operations} />
        </div>
        <DepartmentTable />
      </main>
    </>
  );
}

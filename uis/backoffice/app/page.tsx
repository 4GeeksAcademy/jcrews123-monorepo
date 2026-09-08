import { Header } from "@/components/layout/AppShell";
import { DepartmentTable } from "@/components/dashboard/DepartmentTable";
import { LocationTable } from "@/components/dashboard/LocationTable";
import { MetricCards } from "@/components/dashboard/MetricCards";

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="flex-1 space-y-8 px-8 py-8">
        <MetricCards />
        <LocationTable />
        <DepartmentTable />
      </main>
    </>
  );
}

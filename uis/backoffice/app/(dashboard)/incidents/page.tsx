import { IncidentsHeader } from "@/components/layout/AppShell";
import { IncidentAnalysisPanel } from "@/components/incidents/IncidentAnalysisPanel";

export default function IncidentsPage() {
  return (
    <>
      <IncidentsHeader />
      <main className="flex-1 px-8 py-8">
        <IncidentAnalysisPanel />
      </main>
    </>
  );
}

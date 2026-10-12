import { TelemetryHeader } from "@/components/layout/AppShell";
import { TelemetryReportPanel } from "@/components/telemetry/TelemetryReportPanel";

export default function TelemetryPage() {
  return (
    <>
      <TelemetryHeader />
      <main className="flex-1 px-8 py-8">
        <TelemetryReportPanel />
      </main>
    </>
  );
}

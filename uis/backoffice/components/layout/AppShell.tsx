import { SidebarNav } from "@/components/layout/SidebarNav";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white px-8 py-5">
      <p className="text-sm font-medium text-indigo-600">Internal operations</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-slate-900">
        Company overview
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-slate-600">
        Welcome to Brasaland Digital. This dashboard surfaces company context
        from headquarters — locations, departments, and priorities across
        Colombia and Florida.
      </p>
    </header>
  );
}

export function IncidentsHeader() {
  return (
    <header className="border-b border-slate-200 bg-white px-8 py-5">
      <p className="text-sm font-medium text-indigo-600">Operations</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-slate-900">
        Incident file analysis
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-slate-600">
        Upload the exported incident CSV to validate records, review metrics,
        and download a summary. Sensitive customer data stays on internal
        systems.
      </p>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarNav />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

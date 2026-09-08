import Link from "next/link";

const navItems = [
  { href: "/", label: "Dashboard", active: true },
  { href: "#locations", label: "Locations", active: false },
  { href: "#departments", label: "Departments", active: false },
];

export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-700 bg-slate-900 text-slate-100">
      <div className="border-b border-slate-700 px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
          Brasaland Digital
        </p>
        <h1 className="mt-1 font-display text-xl font-semibold text-white">
          Backoffice
        </h1>
      </div>
      <nav className="flex-1 px-3 py-4" aria-label="Main">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-slate-700 px-5 py-4 text-xs text-slate-400">
        HQ Medellín · Ops Miami
      </div>
    </aside>
  );
}

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

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

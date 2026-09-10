"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/incidents", label: "Incident Analysis" },
  { href: "/suppliers", label: "Supplier Directory" },
  { href: "/inventory/products", label: "Inventory" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/change-password", label: "Change password" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : item.href.startsWith("/inventory")
                  ? pathname.startsWith("/inventory")
                  : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-slate-700 px-5 py-4">
        <p className="truncate text-xs text-slate-400">{user?.email}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-3 text-sm font-medium text-indigo-300 hover:text-indigo-200"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

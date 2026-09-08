import Link from "next/link";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(45,212,191,0.22),_transparent_68%)] blur-2xl sm:h-[36rem] sm:w-[36rem]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.12),_transparent_70%)] blur-xl"
      />
      <header className="sticky top-0 z-20 border-b border-border/80 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="group min-w-0">
            <p className="font-[family-name:var(--font-fraunces)] text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Brasaland
            </p>
            <p className="truncate text-xs text-ink-muted sm:text-sm">
              Talent Pipeline · People & Talent
            </p>
          </Link>
          <nav className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-accent-soft hover:text-ink"
            >
              Candidates
            </Link>
            <Link
              href="/candidates/new"
              className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover"
            >
              Register candidate
            </Link>
          </nav>
        </div>
      </header>
      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}

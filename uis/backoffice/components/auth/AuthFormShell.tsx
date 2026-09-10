export function AuthFormShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
          Brasaland Digital
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Internal backoffice access only.
        </p>
      </div>
    </div>
  );
}

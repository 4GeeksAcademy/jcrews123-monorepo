"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { resetPassword } from "@/lib/password-reset-api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Reset token is missing from the link.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, password);
      router.replace("/login?reset=success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      title="Set new password"
      subtitle="Choose a new password for your Brasaland Digital account."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm text-slate-300">
          New password
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500 focus:ring-2"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Confirm password
          <input
            type="password"
            required
            minLength={8}
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500 focus:ring-2"
          />
        </label>
        {error ? (
          <div className="space-y-2">
            <p className="rounded-lg bg-red-950/60 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
            <Link
              href="/forgot-password"
              className="text-sm text-indigo-300 hover:text-indigo-200"
            >
              Request a new reset link
            </Link>
          </div>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {submitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthFormShell>
  );
}

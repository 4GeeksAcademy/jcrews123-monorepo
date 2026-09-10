"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { requestPasswordReset } from "@/lib/password-reset-api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      title="Forgot password"
      subtitle="Enter your email and we will send a reset link if the account exists."
    >
      {submitted ? (
        <div className="space-y-3">
          <p className="rounded-lg bg-emerald-950/40 px-3 py-3 text-sm text-emerald-200">
            If that address is registered, you&apos;ll receive a link shortly.
          </p>
          <p className="text-xs text-slate-400">
            Resend dev accounts only deliver to your verified Resend email (
            <span className="font-medium text-slate-300">bobtest68@yahoo.com</span>
            ). Check spam/promotions, or the API terminal for{" "}
            <span className="font-mono">PASSWORD RESET LINK</span> if delivery fails.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setError(null);
            }}
            className="w-full rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Send again
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-300">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500 focus:ring-2"
            />
          </label>
          {error ? (
            <p className="rounded-lg bg-red-950/60 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-slate-400">
        <Link href="/login" className="text-indigo-300 hover:text-indigo-200">
          Back to sign in
        </Link>
      </p>
    </AuthFormShell>
  );
}

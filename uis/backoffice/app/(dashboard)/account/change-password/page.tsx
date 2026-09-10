"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { changePassword } from "@/lib/password-reset-api";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmation: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (form.newPassword !== form.confirmation) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await changePassword(form.currentPassword, form.newPassword);
      setMessage("Password updated successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmation: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <p className="text-sm font-medium text-indigo-600">Account</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-slate-900">
          Change password
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Update your password while signed in to Brasaland Digital.
        </p>
      </header>
      <main className="flex-1 px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {[
            ["currentPassword", "Current password"],
            ["newPassword", "New password"],
            ["confirmation", "Confirm new password"],
          ].map(([key, label]) => (
            <label key={key} className="block text-sm font-medium text-slate-700">
              {label}
              <input
                type="password"
                required
                minLength={key === "currentPassword" ? 1 : 8}
                value={form[key as keyof typeof form]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-indigo-500 focus:ring-2"
              />
            </label>
          ))}
          {message ? (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {submitting ? "Updating…" : "Update password"}
            </button>
            <Link href="/account/profile" className="text-sm text-indigo-600">
              Back to profile
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}

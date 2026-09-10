"use client";

import { FormEvent, useState } from "react";

import { updateProfile, type AuthUser } from "@/lib/auth-api";
import { useAuth } from "@/lib/auth-context";

function ProfileForm({
  user,
  onSaved,
}: {
  user: AuthUser;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: user.profile.name,
    phone: user.profile.phone,
    address: user.profile.address,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await updateProfile(form);
      await onSaved();
      setMessage("Profile updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="text-sm text-slate-600">
        Signed in as <span className="font-medium">{user.email}</span>
      </p>
      {(["name", "phone", "address"] as const).map((field) => (
        <label key={field} className="block text-sm font-medium text-slate-700">
          {field.charAt(0).toUpperCase() + field.slice(1)}
          <input
            value={form[field]}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                [field]: event.target.value,
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
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  return (
    <>
      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <p className="text-sm font-medium text-indigo-600">Account</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-slate-900">
          Profile
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Update your contact details for Brasaland Digital notifications.
        </p>
      </header>
      <main className="flex-1 px-8 py-8">
        {user ? (
          <ProfileForm key={user.email} user={user} onSaved={refreshUser} />
        ) : (
          <p className="text-sm text-slate-600">Loading profile…</p>
        )}
      </main>
    </>
  );
}

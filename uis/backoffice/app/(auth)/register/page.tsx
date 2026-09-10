"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { login, register } from "@/lib/auth-api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await register(form);
      await login(form.email, form.password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      title="Create account"
      subtitle="Register for Brasaland Digital backoffice access."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {[
          ["email", "Email", "email"],
          ["password", "Password", "password"],
          ["name", "Full name", "text"],
          ["phone", "Phone", "tel"],
          ["address", "Address", "text"],
        ].map(([key, label, type]) => (
          <label key={key} className="block text-sm text-slate-300">
            {label}
            <input
              type={type}
              required={key === "email" || key === "password"}
              value={form[key as keyof typeof form]}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-indigo-500 focus:ring-2"
            />
          </label>
        ))}
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
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Already registered?{" "}
        <Link href="/login" className="text-indigo-300 hover:text-indigo-200">
          Sign in
        </Link>
      </p>
    </AuthFormShell>
  );
}

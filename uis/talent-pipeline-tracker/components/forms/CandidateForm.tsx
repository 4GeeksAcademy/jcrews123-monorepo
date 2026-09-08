"use client";

import { useState } from "react";
import { FormFeedback } from "@/components/feedback/FormFeedback";
import type { Candidate, CandidateCreate } from "@/types/candidate";

interface CandidateFormProps {
  mode: "create" | "edit";
  initial?: Candidate | null;
  onSubmit: (payload: CandidateCreate) => Promise<boolean>;
  isSubmitting: boolean;
  success?: string | null;
  error?: string | null;
}

interface FormErrors {
  full_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  experience_years?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CandidateForm({
  mode,
  initial,
  onSubmit,
  isSubmitting,
  success,
  error,
}: CandidateFormProps) {
  const [fullName, setFullName] = useState(initial?.full_name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [position, setPosition] = useState(
    initial?.position ?? "Executive Assistant",
  );
  const [experienceYears, setExperienceYears] = useState(
    initial ? String(initial.experience_years) : "",
  );
  const [linkedinUrl, setLinkedinUrl] = useState(initial?.linkedin_url ?? "");
  const [cvUrl, setCvUrl] = useState(initial?.cv_url ?? "");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!fullName.trim() || fullName.trim().split(/\s+/).length < 2) {
      next.full_name = "Enter the candidate’s full name (first and last).";
    }
    if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!phone.trim()) {
      next.phone = "Phone is required.";
    }
    if (!position.trim()) {
      next.position = "Position is required.";
    }
    const years = Number(experienceYears);
    if (experienceYears.trim() === "" || Number.isNaN(years) || years < 0) {
      next.experience_years = "Enter years of experience (0 or more).";
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    const payload: CandidateCreate = {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      position: position.trim(),
      experience_years: Number(experienceYears),
      linkedin_url: linkedinUrl.trim() || null,
      cv_url: cvUrl.trim() || null,
    };

    await onSubmit(payload);
  };

  const fieldClass =
    "w-full rounded-md border border-border bg-paper px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-border bg-surface p-5 sm:p-6"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-medium text-ink-muted">
            Full name <span className="text-danger">*</span>
          </span>
          <input
            className={fieldClass}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
          />
          {fieldErrors.full_name ? (
            <p className="mt-1 text-xs text-danger">{fieldErrors.full_name}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">
            Email <span className="text-danger">*</span>
          </span>
          <input
            type="email"
            className={fieldClass}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
          {fieldErrors.email ? (
            <p className="mt-1 text-xs text-danger">{fieldErrors.email}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">
            Phone <span className="text-danger">*</span>
          </span>
          <input
            type="tel"
            className={fieldClass}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
          />
          {fieldErrors.phone ? (
            <p className="mt-1 text-xs text-danger">{fieldErrors.phone}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">
            Position <span className="text-danger">*</span>
          </span>
          <input
            className={fieldClass}
            value={position}
            onChange={(event) => setPosition(event.target.value)}
          />
          {fieldErrors.position ? (
            <p className="mt-1 text-xs text-danger">{fieldErrors.position}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">
            Years of experience <span className="text-danger">*</span>
          </span>
          <input
            type="number"
            min={0}
            step={0.5}
            className={fieldClass}
            value={experienceYears}
            onChange={(event) => setExperienceYears(event.target.value)}
          />
          {fieldErrors.experience_years ? (
            <p className="mt-1 text-xs text-danger">
              {fieldErrors.experience_years}
            </p>
          ) : null}
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-medium text-ink-muted">
            LinkedIn URL
          </span>
          <input
            type="url"
            className={fieldClass}
            value={linkedinUrl}
            onChange={(event) => setLinkedinUrl(event.target.value)}
            placeholder="https://linkedin.com/in/…"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-medium text-ink-muted">
            CV URL
          </span>
          <input
            type="url"
            className={fieldClass}
            value={cvUrl}
            onChange={(event) => setCvUrl(event.target.value)}
            placeholder="https://…"
          />
        </label>
      </div>

      <FormFeedback success={success} error={error} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? mode === "create"
            ? "Registering…"
            : "Saving…"
          : mode === "create"
            ? "Register candidate"
            : "Save changes"}
      </button>
    </form>
  );
}

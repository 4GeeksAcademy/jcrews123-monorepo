import type { Candidate } from "@/types/candidate";

interface CandidateProfileProps {
  candidate: Candidate;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function CandidateProfile({ candidate }: CandidateProfileProps) {
  const fields = [
    { label: "Email", value: candidate.email },
    { label: "Phone", value: candidate.phone },
    { label: "Position", value: candidate.position },
    {
      label: "Years of experience",
      value: String(candidate.experience_years),
    },
    {
      label: "LinkedIn",
      value: candidate.linkedin_url,
      href: candidate.linkedin_url ?? undefined,
    },
    {
      label: "CV",
      value: candidate.cv_url ? "View CV" : null,
      href: candidate.cv_url ?? undefined,
    },
    { label: "Applied", value: formatDate(candidate.applied_at) },
  ];

  return (
    <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-ink">
        Candidate profile
      </h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              {field.label}
            </dt>
            <dd className="mt-1 text-sm text-ink">
              {field.href && field.value ? (
                <a
                  href={field.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-accent hover:underline"
                >
                  {field.value}
                </a>
              ) : (
                (field.value ?? "—")
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

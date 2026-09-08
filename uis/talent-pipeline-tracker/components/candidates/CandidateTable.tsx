"use client";

import { useRouter } from "next/navigation";
import { StageBadge } from "@/components/badges/StageBadge";
import { StatusBadge } from "@/components/badges/StatusBadge";
import type { Candidate } from "@/types/candidate";

interface CandidateTableProps {
  candidates: Candidate[];
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  const router = useRouter();

  const openProfile = (id: string) => {
    router.push(`/candidates/${id}`);
  };

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-surface md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted-fill text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Position</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Stage</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr
                key={candidate.id}
                role="link"
                tabIndex={0}
                aria-label={`Open profile for ${candidate.full_name}`}
                onClick={() => openProfile(candidate.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openProfile(candidate.id);
                  }
                }}
                className="animate-fade-up cursor-pointer border-b border-border last:border-b-0 transition hover:bg-accent-soft/50 focus-visible:bg-accent-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
              >
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{candidate.full_name}</p>
                  <p className="text-xs text-ink-muted">{candidate.email}</p>
                </td>
                <td className="px-4 py-3 text-ink-muted">{candidate.position}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={candidate.status} />
                </td>
                <td className="px-4 py-3">
                  <StageBadge stage={candidate.stage} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {candidates.map((candidate, index) => (
          <li
            key={candidate.id}
            className="animate-fade-up"
            style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
          >
            <button
              type="button"
              onClick={() => openProfile(candidate.id)}
              className="w-full rounded-xl border border-border bg-surface p-4 text-left transition hover:bg-accent-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <p className="font-semibold text-ink">{candidate.full_name}</p>
              <p className="mt-0.5 text-sm text-ink-muted">{candidate.position}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge status={candidate.status} />
                <StageBadge stage={candidate.stage} />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

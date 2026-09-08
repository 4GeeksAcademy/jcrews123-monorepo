"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

export function CandidateSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const current = searchParams.get("search") ?? "";
      if (value.trim() === current.trim()) return;

      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }
      startTransition(() => {
        router.replace(`/?${params.toString()}`);
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [value, router, searchParams]);

  return (
    <label className="block min-w-0 flex-1">
      <span className="mb-1 block text-xs font-medium text-ink-muted">
        Search by name or email
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="e.g. Ashley or ashley@…"
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        aria-busy={isPending}
      />
    </label>
  );
}

export function CandidateFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: "status" | "stage", nextValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextValue) {
        params.set(key, nextValue);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.replace(`/?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  const clearFilters = () => {
    startTransition(() => {
      router.replace("/");
    });
  };

  const hasFilters =
    searchParams.has("status") ||
    searchParams.has("stage") ||
    searchParams.has("search");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="block sm:w-44">
        <span className="mb-1 block text-xs font-medium text-ink-muted">
          Status
        </span>
        <select
          value={searchParams.get("status") ?? ""}
          onChange={(event) => updateParam("status", event.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          <option value="">All statuses</option>
          <option value="received">Received</option>
          <option value="in_progress">In progress</option>
          <option value="selected">Selected</option>
          <option value="discarded">Discarded</option>
        </select>
      </label>

      <label className="block sm:w-52">
        <span className="mb-1 block text-xs font-medium text-ink-muted">
          Stage
        </span>
        <select
          value={searchParams.get("stage") ?? ""}
          onChange={(event) => updateParam("stage", event.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          <option value="">All stages</option>
          <option value="pending">Pending review</option>
          <option value="review">Under review</option>
          <option value="personal_interview">Personal interview</option>
          <option value="technical_interview">Technical interview</option>
          <option value="offer_presented">Offer presented</option>
        </select>
      </label>

      {hasFilters ? (
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-accent-soft hover:text-ink"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import { FormFeedback } from "@/components/feedback/FormFeedback";
import { LoadingState } from "@/components/feedback/LoadingState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useNotes } from "@/hooks/useNotes";

interface NotesPanelProps {
  candidateId: string;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function NotesPanel({ candidateId }: NotesPanelProps) {
  const {
    notes,
    status,
    error,
    actionStatus,
    actionError,
    actionSuccess,
    addNote,
    removeNote,
  } = useNotes(candidateId);
  const [content, setContent] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) {
      setValidationError("Write a note before saving.");
      return;
    }
    setValidationError(null);
    const ok = await addNote(content.trim());
    if (ok) setContent("");
  };

  const handleDelete = async (noteId: string) => {
    const confirmed = window.confirm(
      "Delete this internal note? This cannot be undone.",
    );
    if (!confirmed) return;
    await removeNote(noteId);
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-ink">
        Internal notes
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Visible only here — use after calls or interviews.
      </p>

      <form onSubmit={handleAdd} className="mt-4 space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">
            New note
          </span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={3}
            placeholder="Notes from the latest conversation…"
            className="w-full rounded-md border border-border bg-paper px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>
        <FormFeedback
          success={actionSuccess}
          error={validationError ?? actionError}
        />
        <button
          type="submit"
          disabled={actionStatus === "loading"}
          className="rounded-md border border-border bg-muted-fill px-4 py-2 text-sm font-semibold text-ink transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {actionStatus === "loading" ? "Saving…" : "Add note"}
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {status === "loading" || status === "idle" ? (
          <LoadingState label="Loading notes…" />
        ) : null}
        {status === "error" && error ? <ErrorState message={error} /> : null}
        {status === "success" && notes.length === 0 ? (
          <p className="text-sm text-ink-muted">No internal notes yet.</p>
        ) : null}
        {status === "success"
          ? notes.map((note) => (
              <article
                key={note.id}
                className="animate-fade-up rounded-lg border border-border bg-paper/70 px-4 py-3"
              >
                <p className="whitespace-pre-wrap text-sm text-ink">
                  {note.content}
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <time className="text-xs text-ink-muted">
                    {formatDate(note.created_at)}
                  </time>
                  <button
                    type="button"
                    onClick={() => void handleDelete(note.id)}
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          : null}
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { createNote, deleteNote, getNotes } from "@/lib/api/notes";
import type { AsyncStatus } from "@/hooks/useCandidates";
import type { Note } from "@/types/note";

interface UseNotesResult {
  notes: Note[];
  status: AsyncStatus;
  error: string | null;
  actionStatus: AsyncStatus;
  actionError: string | null;
  actionSuccess: string | null;
  addNote: (content: string) => Promise<boolean>;
  removeNote: (noteId: string) => Promise<boolean>;
}

export function useNotes(candidateId: string): UseNotesResult {
  const [notes, setNotes] = useState<Note[]>([]);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<AsyncStatus>("idle");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const data = await getNotes(candidateId);
      setNotes(data);
      setStatus("success");
    } catch (err) {
      setNotes([]);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to load notes");
    }
  }, [candidateId]);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  const addNote = useCallback(
    async (content: string) => {
      setActionStatus("loading");
      setActionError(null);
      setActionSuccess(null);

      try {
        const note = await createNote(candidateId, { content });
        setNotes((current) => [note, ...current]);
        setActionStatus("success");
        setActionSuccess("Note added.");
        return true;
      } catch (err) {
        setActionStatus("error");
        setActionError(err instanceof Error ? err.message : "Failed to add note");
        return false;
      }
    },
    [candidateId],
  );

  const removeNote = useCallback(
    async (noteId: string) => {
      setActionStatus("loading");
      setActionError(null);
      setActionSuccess(null);

      try {
        await deleteNote(candidateId, noteId);
        setNotes((current) => current.filter((note) => note.id !== noteId));
        setActionStatus("success");
        setActionSuccess("Note deleted.");
        return true;
      } catch (err) {
        setActionStatus("error");
        setActionError(
          err instanceof Error ? err.message : "Failed to delete note",
        );
        return false;
      }
    },
    [candidateId],
  );

  return {
    notes,
    status,
    error,
    actionStatus,
    actionError,
    actionSuccess,
    addNote,
    removeNote,
  };
}

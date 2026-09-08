import { apiFetch } from "@/lib/api/client";
import type { Note, NoteCreate } from "@/types/note";

interface NotesListResponse {
  data: Note[];
  meta?: { total: number };
}

export async function getNotes(candidateId: string): Promise<Note[]> {
  const response = await apiFetch<NotesListResponse | Note[]>(
    `/records/${candidateId}/notes`,
  );

  if (Array.isArray(response)) return response;
  return response.data ?? [];
}

export async function createNote(
  candidateId: string,
  payload: NoteCreate,
): Promise<Note> {
  return apiFetch<Note>(`/records/${candidateId}/notes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteNote(
  candidateId: string,
  noteId: string,
): Promise<void> {
  await apiFetch<void>(`/records/${candidateId}/notes/${noteId}`, {
    method: "DELETE",
  });
}

export interface Note {
  id: string;
  record_id: string;
  content: string;
  created_at: string;
}

export interface NoteCreate {
  content: string;
}

import type { Note } from '@/lib/models/note'

export type CreateNoteParams = {
  content: string
}

export interface NoteRepository {
  list(): Promise<Note[]>
  create(params: CreateNoteParams): Promise<Note>
}

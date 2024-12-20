import type { Note } from '../models/note'

export class NoteConverter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fromPocketbase(record: any): Note {
    return {
      id: record.id,
      content: record.content,
      createdAt: new Date(record.created),
      updatedAt: new Date(record.updated),
      author: undefined,
    }
  }
}

import type { CreateNoteParams, NoteRepository } from '@/lib/contracts/note-repository'
import type { Note } from '@/lib/models/note'
import { pb } from '@/lib/pocketbase'
import { NoteConverter } from '../converters/note-converter'

export class PocketbaseNoteRepository implements NoteRepository {
  private converter: NoteConverter

  constructor() {
    this.converter = new NoteConverter()
  }

  async list(): Promise<Note[]> {
    const records = await pb.collection('notes').getFullList({
      sort: '-created',
    })

    console.info('fetched notes', {
      count: records.length,
    })

    return records.map(this.converter.fromPocketbase)
  }

  async create(params: CreateNoteParams): Promise<Note> {
    const record = await pb.collection('notes').create({
      content: params.content,
      user: pb.authStore.record?.id,
    })

    console.info('created note', {
      id: record.id,
    })

    return this.converter.fromPocketbase(record)
  }
}

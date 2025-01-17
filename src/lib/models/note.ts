import type { User } from './user'

export type Note = {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  author?: User
}

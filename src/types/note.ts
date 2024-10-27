import { z } from 'zod'

import { noteSchema } from '@/validations'

import { TTime } from './common'

export type TNoteForm = z.infer<typeof noteSchema>

export type TCreateNoteRequest = {} & TNoteForm

export type TUpdateNoteRequest = { id: string } & TNoteForm

export type TNoteResponse = {
  id: string
  title: string
  content: string
  createdAt: TTime
  updatedAt: TTime
}

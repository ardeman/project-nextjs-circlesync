import { z } from 'zod'

import { noteSchema } from '@/validations'

export type TNoteRequest = z.infer<typeof noteSchema>

import * as z from 'zod'
export const noteSchema = z.object({
  title: z.string(),
  content: z.string().min(1, { message: 'Content is required' }),
})

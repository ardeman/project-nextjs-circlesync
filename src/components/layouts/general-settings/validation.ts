import * as z from 'zod'
export const schema = z.object({
  displayName: z.string().min(1, 'Display name is required.'),
})

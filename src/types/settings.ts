import { z } from 'zod'

import { generalSettingSchema } from '@/validations'

export type TUpdateProfileRequest = z.infer<typeof generalSettingSchema>
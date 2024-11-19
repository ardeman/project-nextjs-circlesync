import { Dispatch, SetStateAction } from 'react'

import { TNoteResponse } from '@/types'

export type TFormProps = {
  selectedNote?: TNoteResponse
  setSelectedNote: Dispatch<SetStateAction<TNoteResponse | undefined>>
}

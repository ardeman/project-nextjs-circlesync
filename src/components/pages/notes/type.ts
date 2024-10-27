import { Dispatch, SetStateAction } from 'react'

export type TFormProps = {
  selectedNote?: string
  setSelectedNote: Dispatch<SetStateAction<string | undefined>>
}

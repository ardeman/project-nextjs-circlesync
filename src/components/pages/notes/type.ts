import { Dispatch, MouseEvent, SetStateAction } from 'react'

import { TNoteResponse } from '@/types'

export type TFormProps = {
  selectedNote?: TNoteResponse
  setSelectedNote: Dispatch<SetStateAction<TNoteResponse | undefined>>
}

export type THandleDeleteNote = {
  event: MouseEvent<HTMLButtonElement>
  note: TNoteResponse
}

export type THandlePinNote = {
  event: MouseEvent<HTMLButtonElement>
  note: TNoteResponse
  isPinned: boolean
}

export type TCardProps = {
  isPinned: boolean
  note: TNoteResponse
  handleEditNote: (note: TNoteResponse) => void
  handleDeleteNote: (props: THandleDeleteNote) => void
  handlePinNote: (props: THandlePinNote) => void
  handleUnlinkNote: (props: THandleDeleteNote) => void
}

export type TNoteConfirmation = {
  kind: string
  detail: TNoteResponse
}

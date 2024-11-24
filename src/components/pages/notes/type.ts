import { Dispatch, MouseEvent, SetStateAction } from 'react'

import { TNoteResponse } from '@/types'

export type TFormProps = {
  selectedNote?: TNoteResponse
  setSelectedNote: Dispatch<SetStateAction<TNoteResponse | undefined>>
  notes?: TNoteResponse[]
  handleDeleteNote: (props: THandleModifyNote) => void
  handlePinNote: (props: THandlePinNote) => void
  handleUnlinkNote: (props: THandleModifyNote) => void
  handleShareNote: (props: THandleModifyNote) => void
}

export type THandleModifyNote = {
  event: MouseEvent<HTMLButtonElement>
  note: TNoteResponse
}

export type THandlePinNote = {
  isPinned: boolean
} & THandleModifyNote

export type TCardProps = {
  note: TNoteResponse
  handleEditNote: (note: TNoteResponse) => void
  handleDeleteNote: (props: THandleModifyNote) => void
  handlePinNote: (props: THandlePinNote) => void
  handleUnlinkNote: (props: THandleModifyNote) => void
  handleShareNote: (props: THandleModifyNote) => void
}

export type TNoteConfirmation = {
  kind: string
  detail: TNoteResponse
}

export type TActionProps = {
  isOwner: boolean
  isEditable?: boolean
  isPinned?: boolean
  note: TNoteResponse
  handleDeleteNote: (props: THandleModifyNote) => void
  handlePinNote: (props: THandlePinNote) => void
  handleUnlinkNote: (props: THandleModifyNote) => void
  handleShareNote: (props: THandleModifyNote) => void
  className?: string
}

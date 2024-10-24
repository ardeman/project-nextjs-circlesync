import { Dispatch, ReactNode, SetStateAction } from 'react'

export type TProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  children: ReactNode
  title?: string
  description?: string
}

import {
  ElementType,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from 'react'

export type TButtonProps<T extends ElementType = 'button'> = {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'blue' | 'red'
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: HTMLAttributes<HTMLButtonElement>['className']
  containerClassName?: HTMLAttributes<HTMLDivElement>['className']
  disabled?: boolean
  children: ReactNode
  isLoading?: boolean
  error?: string
  as?: T
}

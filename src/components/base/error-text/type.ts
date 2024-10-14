import { HTMLAttributes, ReactNode } from 'react'

export type TProps = {
  className?: HTMLAttributes<HTMLDivElement>['className']
  children: ReactNode
}

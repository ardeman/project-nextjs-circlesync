import { HTMLAttributes } from 'react'

export type TProps = {
  className?: HTMLAttributes<HTMLDivElement>['className']
}

export type TSearchRequest = {
  query: string
}

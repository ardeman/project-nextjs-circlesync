import { twMerge } from 'tailwind-merge'

import { TProps } from './type'

export const ErrorText = (props: TProps) => {
  const { className, children } = props
  return (
    <div
      className={twMerge('text-sm text-red-600 dark:text-red-400', className)}
    >
      {children}
    </div>
  )
}

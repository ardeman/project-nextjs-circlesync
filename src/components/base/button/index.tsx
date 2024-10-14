import { PiSpinnerBallDuotone } from 'react-icons/pi'
import { twMerge } from 'tailwind-merge'

import { ErrorText } from '@/components/base'
import { Button as ShadcnButton } from '@/components/ui'

import { TButtonProps } from './type'

export const Button = (props: TButtonProps) => {
  const {
    disabled,
    children,
    isLoading,
    className,
    type = 'button',
    onClick,
    error,
    containerClassName,
  } = props
  return (
    <div className={twMerge('grid space-y-1', containerClassName)}>
      <ShadcnButton
        onClick={onClick}
        type={type}
        className={twMerge(
          'flex items-center justify-center gap-2',
          // 'flex h-11 w-full items-center justify-center gap-2 rounded transition duration-150 hover:shadow focus:outline-none disabled:opacity-50',
          className
        )}
        disabled={disabled}
      >
        <PiSpinnerBallDuotone
          className={isLoading ? 'animate-spin text-lg' : 'hidden'}
        />
        {!isLoading && children}
      </ShadcnButton>
      {error && <ErrorText className="text-center">{error}</ErrorText>}
    </div>
  )
}

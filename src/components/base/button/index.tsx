import { PiSpinnerGapDuotone } from 'react-icons/pi'
import { twMerge } from 'tailwind-merge'

import { ErrorText } from '@/components/base'
import { Button as UIButton } from '@/components/ui'

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
    variant,
  } = props
  return (
    <div className={twMerge('grid space-y-1', containerClassName)}>
      <UIButton
        variant={variant}
        onClick={onClick}
        type={type}
        className={twMerge('flex items-center justify-center gap-2', className)}
        disabled={disabled}
      >
        <PiSpinnerGapDuotone
          className={isLoading ? 'animate-spin text-lg' : 'hidden'}
        />
        {!isLoading && children}
      </UIButton>
      {error && <ErrorText className="text-center">{error}</ErrorText>}
    </div>
  )
}

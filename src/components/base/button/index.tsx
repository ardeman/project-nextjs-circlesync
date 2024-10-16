import { PiSpinnerGapDuotone } from 'react-icons/pi'

import { Button as UIButton } from '@/components/ui'
import { cn } from '@/utils'

import { TButtonProps } from './type'

export const Button = (props: TButtonProps) => {
  const {
    disabled,
    children,
    isLoading,
    className,
    type = 'button',
    onClick,
    containerClassName,
    variant,
  } = props
  return (
    <div className={cn('grid space-y-1', containerClassName)}>
      <UIButton
        variant={variant}
        onClick={onClick}
        type={type}
        className={cn('flex items-center justify-center gap-2', className)}
        disabled={disabled}
      >
        <PiSpinnerGapDuotone
          className={isLoading ? 'animate-spin text-lg' : 'hidden'}
        />
        {!isLoading && children}
      </UIButton>
    </div>
  )
}

import { PiSpinnerBallDuotone } from 'react-icons/pi'
import { twMerge } from 'tailwind-merge'

import { ErrorText } from '../error-text'

import { variants } from './data'
import { TButtonProps } from './type'

export const Button = (props: TButtonProps) => {
  const {
    disabled,
    children,
    isLoading,
    className,
    variant = 'blue',
    type = 'button',
    onClick,
    error,
    containerClassName,
  } = props
  return (
    <div className={twMerge('grid space-y-1', containerClassName)}>
      <button
        onClick={onClick}
        type={type}
        className={twMerge(
          'flex h-11 w-full items-center justify-center gap-2 rounded text-white focus:outline-none disabled:opacity-50',
          variants[variant],
          className
        )}
        disabled={disabled}
      >
        <PiSpinnerBallDuotone
          className={isLoading ? 'animate-spin text-lg' : 'hidden'}
        />
        {!isLoading && children}
      </button>
      {error && <ErrorText className="text-center">{error}</ErrorText>}
    </div>
  )
}

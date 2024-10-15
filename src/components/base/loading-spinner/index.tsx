import { useEffect, useState } from 'react'

import { metadata } from '@/data'
import { cn, getRandomIndex } from '@/utils'

import { IconComponent, icons } from './data'
import { TProps } from './type'

export const LoadingSpinner = (props: TProps) => {
  const { classname } = props
  const [counter, setCounter] = useState(getRandomIndex(icons.length, -1))
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Start animation as soon as component mounts
    setAnimate(true)

    // Change the icon at the end of each animation cycle
    const interval = setInterval(() => {
      setCounter((prevCounter) => getRandomIndex(icons.length, prevCounter))
      // Reset animation state to trigger re-render
      setAnimate(false) // Stop animation
      setTimeout(() => setAnimate(true), 50) // Restart animation after a brief moment
    }, 3000) // Keep this at 3000ms

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={cn(
        'bg-muted/40 flex min-h-dvh items-center justify-center',
        classname
      )}
    >
      <div className="absolute flex h-24 w-24 flex-col items-center justify-center">
        <div
          className={cn(
            'flex h-48 w-24 origin-bottom justify-center text-5xl',
            animate ? 'animate-rotate' : 'opacity-0'
          )}
        >
          <IconComponent counter={counter} />
        </div>
        <span className="absolute bottom-0 whitespace-nowrap text-base font-semibold">
          {metadata.title?.toString()}
        </span>
      </div>
    </div>
  )
}

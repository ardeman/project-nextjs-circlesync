import { useEffect, useState } from 'react'
import {
  FaFighterJet,
  FaGamepad,
  FaHeadphones,
  FaCubes,
  FaPaw,
  FaRocket,
  FaTicketAlt,
  FaOpencart,
  FaCodepen,
} from 'react-icons/fa'
import { twMerge } from 'tailwind-merge'

const icons = [
  FaFighterJet,
  FaGamepad,
  FaHeadphones,
  FaCubes,
  FaPaw,
  FaRocket,
  FaTicketAlt,
  FaOpencart,
  FaCodepen,
]

export const LoadingSpinner = () => {
  const [counter, setCounter] = useState(0)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Start animation as soon as component mounts
    setAnimate(true)

    // Change the icon at the end of each animation cycle
    const interval = setInterval(() => {
      setCounter((prevCounter) =>
        prevCounter === icons.length - 1 ? 0 : prevCounter + 1
      )
      // Reset animation state to trigger re-render
      setAnimate(false) // Stop animation
      setTimeout(() => setAnimate(true), 50) // Restart animation after a brief moment
    }, 3000) // Keep this at 3000ms

    return () => clearInterval(interval)
  }, [])

  const IconComponent = icons[counter]

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="absolute flex h-24 w-24 flex-col items-center justify-center">
        <div
          className={twMerge(
            'flex h-48 w-24 origin-bottom justify-center text-5xl',
            animate ? 'animate-rotate' : 'opacity-0'
          )}
        >
          <IconComponent className="" />
        </div>
        <span className="absolute bottom-0 text-base font-semibold">
          Loading...
        </span>
      </div>
    </div>
  )
}
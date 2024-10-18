'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5) // Set initial countdown time to 5 seconds

  useEffect(() => {
    // Set an interval to decrease the countdown every second
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown! - 1)
    }, 1000)
    // Redirect to home page after countdown reaches 0
    if (countdown === 0) {
      router.push('/')
    }
    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval)
  }, [countdown, router])

  return (
    <div className="bg-muted/40 flex min-h-dvh items-center justify-center">
      <Card className="min-h-fit rounded-md border">
        <CardHeader>
          <CardTitle className="text-destructive">404</CardTitle>
          <CardDescription>This page could not be found.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Redirecting to the home page in{' '}
            <span className="text-destructive font-bold">{countdown}</span>{' '}
            seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

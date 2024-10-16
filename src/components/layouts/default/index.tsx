'use client'

import '@/styles/globals.css'
import { usePathname, useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect } from 'react'

import { LoadingSpinner } from '@/components/base'
import { ToastAction, Toaster } from '@/components/ui'
import { useFirebase } from '@/contexts'
import { toast } from '@/hooks'
import { middleware } from '@/utils'

export const DefaultLayout = (props: PropsWithChildren) => {
  const { children } = props
  const { user, isLoading, error, setError } = useFirebase()
  const { push } = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      middleware({ user, push, pathname })
    }
  }, [user, isLoading, push, pathname])

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        description: error,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => setError(undefined)}
          >
            Try again
          </ToastAction>
        ),
      })
    }
  }, [error, setError])

  return (
    <div className="bg-background text-foreground">
      {isLoading ? (
        <LoadingSpinner classname="flex" />
      ) : (
        <div className="block">{children}</div>
      )}
      <Toaster />
    </div>
  )
}

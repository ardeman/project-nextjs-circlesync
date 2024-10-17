'use client'

import '@/styles/globals.css'
import { usePathname, useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect } from 'react'

import { LoadingSpinner } from '@/components/base'
import { Toaster } from '@/components/ui'
import { useFirebase } from '@/contexts'
import { useAuthUser } from '@/hooks'
import { middleware } from '@/utils'

export const DefaultLayout = (props: PropsWithChildren) => {
  const { children } = props
  const { isLoading } = useFirebase()
  const {
    data: userData,
    isLoading: userIsLoading,
    isFetching: userIsFetching,
  } = useAuthUser()
  const { push } = useRouter()
  const pathname = usePathname()
  const isUserLoading = userIsLoading || userIsFetching

  useEffect(() => {
    if (!isUserLoading) {
      middleware({ userData, push, pathname })
    }
  }, [userData, isUserLoading, push, pathname])

  return (
    <div className="bg-background text-foreground">
      {isLoading || isUserLoading ? (
        <LoadingSpinner classname="flex" />
      ) : (
        <div className="block">{children}</div>
      )}
      <Toaster />
    </div>
  )
}

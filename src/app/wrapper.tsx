'use client'

import { usePathname, useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect } from 'react'

import { LoadingSpinner } from '@/components/base'
import { Toaster } from '@/components/ui'
import { useFirebase } from '@/contexts'
import { useAuthUser } from '@/hooks'
import { middleware } from '@/utils'

export const Wrapper = (props: PropsWithChildren) => {
  const { children } = props
  const { isLoading } = useFirebase()
  const { data: user, isLoading: userIsLoading } = useAuthUser()
  const { push } = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!userIsLoading) {
      middleware({ user, push, pathname })
    }
  }, [user, userIsLoading, push, pathname])

  return (
    <div
      className="bg-background text-foreground"
      vaul-drawer-wrapper="true"
    >
      {isLoading || userIsLoading ? (
        <LoadingSpinner classname="flex" />
      ) : (
        <div className="block">{children}</div>
      )}
      <Toaster />
    </div>
  )
}

'use client'

import { logEvent } from 'firebase/analytics'
import { usePathname, useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect } from 'react'
import { useAnalytics, useUser } from 'reactfire'

import { LoadingSpinner } from '@/components/base'
import { Toaster } from '@/components/ui'
import { middleware } from '@/utils'

export const Wrapper = (props: PropsWithChildren) => {
  const { children } = props
  const { status, data: user } = useUser()
  const { push } = useRouter()
  const pathname = usePathname()
  const analytics = useAnalytics()

  useEffect(() => {
    if (status !== 'loading') {
      middleware({ user, push, pathname })
    }

    if (analytics && process.env.NODE_ENV === 'production') {
      logEvent(analytics, 'page_view', { page_path: pathname })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status, push, pathname])

  return (
    <div
      className="bg-background text-foreground"
      vaul-drawer-wrapper="true"
    >
      {status === 'loading' ? (
        <LoadingSpinner classname="flex" />
      ) : (
        <div className="block">{children}</div>
      )}
      <Toaster />
    </div>
  )
}

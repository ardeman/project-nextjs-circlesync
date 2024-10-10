'use client'

import { usePathname, useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect } from 'react'

import { useFirebaseAuth } from '@/hooks'
import { middleware } from '@/utils'

export const DefaultLayout = (props: PropsWithChildren) => {
  const { children } = props
  const { user, loading } = useFirebaseAuth()
  const { push } = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    middleware({ user, loading, push, pathname })
  }, [user, loading, push, pathname])

  return <>{children}</>
}

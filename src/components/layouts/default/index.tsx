'use client'

import '@/styles/globals.css'
import { usePathname, useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect } from 'react'

import { LoadingSpinner } from '@/components/base'
import { useFirebaseAuth } from '@/hooks'
import { middleware } from '@/utils'

export const DefaultLayout = (props: PropsWithChildren) => {
  const { children } = props
  const { user, isLoading } = useFirebaseAuth()
  const { push } = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      middleware({ user, push, pathname })
    }
  }, [user, isLoading, push, pathname])

  return (
    <div className="bg-background text-foreground">
      <LoadingSpinner classname={isLoading ? 'flex' : 'hidden'} />
      <div className={isLoading ? 'hidden' : 'block'}>{children}</div>
    </div>
  )
}

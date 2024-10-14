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
    <div className="bg-slate-100 text-stone-900 selection:bg-gray-900 selection:text-white dark:bg-slate-900 dark:text-slate-400 dark:selection:bg-sky-400 dark:selection:text-sky-900">
      <LoadingSpinner classname={isLoading ? 'flex' : 'hidden'} />
      <div className={isLoading ? 'hidden' : 'block'}>{children}</div>
    </div>
  )
}

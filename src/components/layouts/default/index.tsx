'use client'

import '@/styles/globals.css'
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
    if (!loading) {
      middleware({ user, push, pathname })
    }
  }, [user, loading, push, pathname])

  return (
    <html lang="en">
      <body className="bg-slate-100 leading-relaxed text-stone-900 antialiased selection:bg-gray-900 selection:text-white dark:bg-slate-900 dark:text-slate-400 dark:selection:bg-sky-400 dark:selection:text-sky-900">
        {children}
      </body>
    </html>
  )
}

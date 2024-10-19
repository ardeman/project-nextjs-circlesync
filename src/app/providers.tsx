'use client'

import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { logEvent } from 'firebase/analytics'
import { usePathname, useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect, useState } from 'react'

import { LoadingSpinner } from '@/components/base'
import { Toaster } from '@/components/ui'
import { firebaseAnalytics } from '@/configs'
import { useFirebase } from '@/contexts'
import { FirebaseProvider, ThemeProvider } from '@/contexts'
import { useAuthUser } from '@/hooks'
import { middleware } from '@/utils'

export const Providers = (props: PropsWithChildren) => {
  const { children } = props
  const { isLoading } = useFirebase()
  const { data: user, isLoading: userIsLoading } = useAuthUser()
  const { push } = useRouter()
  const pathname = usePathname()
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    if (!userIsLoading) {
      middleware({ user, push, pathname })
    }
  }, [user, userIsLoading, push, pathname])

  useEffect(() => {
    if (firebaseAnalytics && process.env.NODE_ENV === 'production') {
      logEvent(firebaseAnalytics, 'page_view', { page_path: pathname })
    }
  }, [pathname])

  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="bg-background text-foreground">
            {isLoading || userIsLoading ? (
              <LoadingSpinner classname="flex" />
            ) : (
              <div className="block">{children}</div>
            )}
            <Toaster />
          </div>
        </ThemeProvider>
      </FirebaseProvider>
    </QueryClientProvider>
  )
}

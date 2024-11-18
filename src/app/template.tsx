'use client'

import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { logEvent } from 'firebase/analytics'
import { usePathname } from 'next/navigation'
import { PropsWithChildren, useEffect, useState } from 'react'

import { analytics } from '@/configs'
import { FirebaseProvider, ThemeProvider } from '@/contexts'

import { Wrapper } from './wrapper'

const Template = (props: PropsWithChildren) => {
  const { children } = props
  const pathname = usePathname()
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    if (analytics && process.env.NODE_ENV === 'production') {
      logEvent(analytics, 'page_view', { page_path: pathname })
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
          <Wrapper>{children}</Wrapper>
        </ThemeProvider>
      </FirebaseProvider>
    </QueryClientProvider>
  )
}

export default Template

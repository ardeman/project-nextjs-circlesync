'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { logEvent } from 'firebase/analytics'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { firebaseAnalytics } from '@/configs'
import { FirebaseProvider, ThemeProvider } from '@/contexts'

import { DefaultLayout } from './default-layout'

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const [queryClient] = useState(() => new QueryClient())
  const pathname = usePathname()

  useEffect(() => {
    if (firebaseAnalytics && process.env.NODE_ENV === 'production') {
      logEvent(firebaseAnalytics, 'page_view', { page_path: pathname })
    }
  }, [pathname])
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="leading-relaxed antialiased">
        <QueryClientProvider client={queryClient}>
          <FirebaseProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <DefaultLayout>{children}</DefaultLayout>
            </ThemeProvider>
          </FirebaseProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}

export default RootLayout

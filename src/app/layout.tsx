'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import { FirebaseProvider, ThemeProvider } from '@/contexts'

import { DefaultLayout } from './default-layout'

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const [queryClient] = useState(() => new QueryClient())
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

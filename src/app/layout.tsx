'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { DefaultLayout } from '@/components/layouts'
import { FirebaseProvider, ThemeProvider } from '@/contexts'

const queryClient = new QueryClient()

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
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

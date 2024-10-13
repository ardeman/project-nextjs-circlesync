'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { DefaultLayout } from '@/components/layouts'
import { FirebaseProvider } from '@/contexts'

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <FirebaseProvider>
      <QueryClientProvider client={queryClient}>
        <DefaultLayout>{children}</DefaultLayout>
      </QueryClientProvider>
    </FirebaseProvider>
  )
}

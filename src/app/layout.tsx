'use client'

import { DefaultLayout } from '@/components/layouts'
import { FirebaseProvider } from '@/contexts'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <FirebaseProvider>
      <DefaultLayout>{children}</DefaultLayout>
    </FirebaseProvider>
  )
}

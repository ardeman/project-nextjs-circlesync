'use client'

import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useState } from 'react'
import { FirebaseAppProvider } from 'reactfire'

import { firebaseConfig } from '@/configs'
import { FirebaseProvider, ThemeProvider } from '@/contexts'

import { Wrapper } from './wrapper'

const Template = (props: PropsWithChildren) => {
  const { children } = props
  const [queryClient] = useState(() => new QueryClient())

  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
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
    </FirebaseAppProvider>
  )
}

export default Template

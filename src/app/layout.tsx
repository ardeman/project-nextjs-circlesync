import { Providers } from './providers'

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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout

export { metadata } from '@/constants'

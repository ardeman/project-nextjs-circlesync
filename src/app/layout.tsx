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
      <body className="leading-relaxed antialiased">{children}</body>
    </html>
  )
}

export default RootLayout

export { metadata } from '@/constants'

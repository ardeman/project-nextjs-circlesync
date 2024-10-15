'use client'

import { ReactNode } from 'react'

import { Header } from '@/components/sections'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      {children}
    </div>
  )
}

export default DashboardLayout

import { ReactNode } from 'react'

import { Navbar } from '@/components/sections'

const DashboardTemplate = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      {children}
    </div>
  )
}

export default DashboardTemplate

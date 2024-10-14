'use client'

import { Button } from '@/components/base'
import { useFirebaseAuth } from '@/hooks'

export const HomePage = () => {
  const { user, logout } = useFirebaseAuth()

  return (
    <div className="grid min-h-dvh grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      {user && (
        <div className="text-center">
          <p className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Welcome, {user.email}
          </p>
          <Button onClick={logout}>Logout</Button>
        </div>
      )}
    </div>
  )
}

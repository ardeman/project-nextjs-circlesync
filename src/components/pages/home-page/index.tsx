'use client'

import { useFirebaseAuth } from '@/hooks'

export const HomePage = () => {
  const { user, logout } = useFirebaseAuth()

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      {user && (
        <div className="text-center">
          <p className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Welcome, {user.email}
          </p>
          <button
            type="button"
            onClick={logout}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

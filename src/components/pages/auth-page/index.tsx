'use client'

import { FC, FormEvent, useState } from 'react'

import { useFirebaseAuth } from '@/hooks'

export const AuthPage: FC = () => {
  const { register, isLoading, error, loginWithGoogle } = useFirebaseAuth()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleEmailPasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    await register(email, password)
    setIsSubmitting(false)
  }

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true)
    await loginWithGoogle()
    setIsSubmitting(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div>
          <form
            onSubmit={handleEmailPasswordSubmit}
            className="space-y-6"
          >
            <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
              Welcome
            </h2>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                placeholder="Your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50"
              disabled={isLoading || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-center text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none disabled:opacity-50"
              disabled={isLoading || isSubmitting}
            >
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

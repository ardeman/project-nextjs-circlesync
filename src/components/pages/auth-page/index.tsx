'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PiSpinnerBallDuotone } from 'react-icons/pi'

import { Input } from '@/components/base'
import { useFirebaseAuth } from '@/hooks'
import { TRegisterRequest } from '@/types'

import { schema } from './validation'

export const AuthPage: FC = () => {
  const { register, isLoading, error, loginWithGoogle } = useFirebaseAuth()
  const formMethods = useForm<TRegisterRequest>({
    resolver: zodResolver(schema),
  })
  const { handleSubmit } = formMethods
  const onSubmit = handleSubmit(async (data) => {
    register(data)
  })

  const handleGoogleSignIn = async () => {
    await loginWithGoogle()
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div>
          <FormProvider {...formMethods}>
            <form
              onSubmit={onSubmit}
              className="space-y-6"
            >
              <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
                Welcome
              </h2>

              <Input
                label="Email"
                name="email"
                placeholder="you@example.com"
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                required
              />

              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50"
                disabled={isLoading}
              >
                <PiSpinnerBallDuotone
                  className={isLoading ? 'animate-spin text-lg' : 'hidden'}
                />
                {!isLoading && 'Continue'}
              </button>
            </form>
          </FormProvider>

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
              disabled={isLoading}
            >
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

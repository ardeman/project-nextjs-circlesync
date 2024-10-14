'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'

import { Button, Input } from '@/components/base'
import { metadata } from '@/data'
import { useFirebaseAuth } from '@/hooks'
import { TRegisterRequest } from '@/types'

import { schema } from './validation'

export const AuthPage: FC = () => {
  const {
    register,
    isLoading,
    isRegisterPending,
    isGoogleLoginPending,
    error,
    loginWithGoogle,
  } = useFirebaseAuth()
  const formMethods = useForm<TRegisterRequest>({
    resolver: zodResolver(schema),
  })
  const { handleSubmit } = formMethods
  const onSubmit = handleSubmit(async (data) => {
    register(data)
  })

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="min-h-dvh w-full max-w-md rounded-lg bg-white p-8 shadow-md md:min-h-fit dark:bg-gray-800">
        <div>
          <FormProvider {...formMethods}>
            <form
              onSubmit={onSubmit}
              className="space-y-6"
            >
              <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
                {metadata.title?.toString()}
              </h2>

              <Input
                label="Email"
                name="email"
                placeholder="you@example.com"
                autoFocus
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                required
              />

              <Button
                disabled={isLoading}
                isLoading={isRegisterPending}
                type="submit"
                error={error}
              >
                Continue
              </Button>
            </form>
          </FormProvider>

          <Button
            className="mt-8"
            onClick={loginWithGoogle}
            disabled={isLoading}
            isLoading={isGoogleLoginPending}
            variant="slate"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  )
}

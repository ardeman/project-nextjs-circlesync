'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'

import { Button, Input, ModeToggle } from '@/components/base'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { useFirebase } from '@/contexts'
import { metadata } from '@/data'
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
  } = useFirebase()
  const formMethods = useForm<TRegisterRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const { handleSubmit } = formMethods
  const onSubmit = handleSubmit(async (data) => {
    register(data)
  })

  return (
    <div className="bg-muted/40 flex min-h-dvh items-center justify-center">
      <Card className="min-h-dvh w-full max-w-md rounded-none md:min-h-fit md:rounded-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{metadata.title?.toString()}</CardTitle>
            <ModeToggle />
          </div>
        </CardHeader>
        <CardContent>
          <FormProvider {...formMethods}>
            <form
              onSubmit={onSubmit}
              className="space-y-6"
            >
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
        </CardContent>
        <CardFooter>
          <Button
            containerClassName="w-full"
            variant="outline"
            onClick={loginWithGoogle}
            disabled={isLoading}
            isLoading={isGoogleLoginPending}
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

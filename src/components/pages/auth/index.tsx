'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeClosed } from 'lucide-react'
import { FC, useEffect, useState } from 'react'
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
import { metadata } from '@/constants'
import { useFirebase } from '@/contexts'
import { TRegisterRequest } from '@/types'

import { schema } from './validation'

export const AuthPage: FC = () => {
  const [disabled, setDisabled] = useState(false)
  const [passwordType, setPasswordType] = useState('password')
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
    setDisabled(true)
    register(data)
  })
  const togglePassword = () => {
    setPasswordType((prev) => (prev === 'password' ? 'text' : 'password'))
  }

  useEffect(() => {
    if (error) {
      setDisabled(false)
    }
  }, [error])

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
                disabled={disabled}
              />
              <Input
                label="Password"
                name="password"
                type={passwordType}
                required
                disabled={disabled}
                rightNode={({ className }) =>
                  passwordType === 'password' ? (
                    <EyeClosed
                      className={className}
                      onClick={togglePassword}
                    />
                  ) : (
                    <Eye
                      className={className}
                      onClick={togglePassword}
                    />
                  )
                }
              />
              <Button
                disabled={isLoading || disabled}
                isLoading={isRegisterPending}
                type="submit"
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
            disabled={isLoading || disabled}
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

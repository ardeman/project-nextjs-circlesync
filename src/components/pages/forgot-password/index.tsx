'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { sendPasswordResetEmail } from 'firebase/auth'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Button, Input, ModeToggle } from '@/components/base'
import {
  Button as UIButton,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { firebaseAuth } from '@/configs'
import { firebaseAuthError } from '@/constants'
import { toast } from '@/hooks'
import { TEmailRequest } from '@/types'

import { schema } from './validation'

export const ForgotPasswordPage: FC = () => {
  const [disabled, setDisabled] = useState(false)
  const [timerForgotPassword, setTimerForgotPassword] = useState<
    number | undefined
  >()
  const formMethods = useForm<TEmailRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  })
  const { handleSubmit } = formMethods
  const onSubmit = handleSubmit(async (data) => {
    setDisabled(true)
    mutateForgotPassword(data)
  })

  const { mutate: mutateForgotPassword, isPending: isForgotPasswordPending } =
    useMutation({
      mutationFn: async (data: TEmailRequest) => {
        if (!firebaseAuth) {
          throw new Error('Firebase Auth is not initialized.')
        }
        await sendPasswordResetEmail(firebaseAuth, data.email)
      },
      onSuccess: () => {
        toast({
          description: 'Password reset email has been sent.',
        })
        setTimerForgotPassword(30)
      },
      onError: (error: unknown) => {
        let message = String(error)
        if (error instanceof FirebaseError) {
          message =
            firebaseAuthError.find((item) => item.code === error.code)
              ?.message || error.message
        }
        toast({
          variant: 'destructive',
          description: message,
        })
      },
      onSettled: () => {
        setDisabled(false)
      },
    })

  useEffect(() => {
    if (timerForgotPassword === 0) {
      setTimerForgotPassword(undefined)
    } else if (timerForgotPassword) {
      const timer = setTimeout(() => {
        setTimerForgotPassword((prev) => prev! - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [timerForgotPassword])

  return (
    <div className="bg-muted/40 flex min-h-dvh items-center justify-center">
      <Card className="min-h-dvh w-full max-w-md rounded-none border-none md:min-h-fit md:rounded-md md:border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="grid">
              <CardTitle>Forgot password</CardTitle>
              <CardDescription>
                Enter your email address to reset your password
              </CardDescription>
            </div>
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
                required
                disabled={disabled}
              />
              <Button
                disabled={disabled || !!timerForgotPassword}
                isLoading={isForgotPasswordPending}
                type="submit"
              >
                Continue {timerForgotPassword && `(${timerForgotPassword})`}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="grid space-y-4">
          <div className="text-center text-sm">
            Back to{' '}
            <UIButton
              variant="link"
              className="p-0"
              asChild
            >
              <Link href="/auth/sign-in">Sign in</Link>
            </UIButton>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeClosed } from 'lucide-react'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'

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
import { metadata } from '@/constants'
import { useLogin, useLoginGoogle } from '@/hooks'
import { TSignInRequest } from '@/types'
import { signInSchema } from '@/validations'

export const SignInPage: FC = () => {
  const [disabled, setDisabled] = useState(false)
  const [passwordType, setPasswordType] = useState('password')
  const formMethods = useForm<TSignInRequest>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const { handleSubmit } = formMethods
  const onSubmit = handleSubmit(async (data) => {
    setDisabled(true)
    mutateLogin(data)
  })
  const togglePassword = () => {
    setPasswordType((prev) => (prev === 'password' ? 'text' : 'password'))
  }

  const {
    mutate: mutateLogin,
    isPending: isLoginPending,
    isError: isLoginError,
  } = useLogin()

  const {
    mutate: mutateLoginGoogle,
    isPending: isLoginGooglePending,
    isError: isLoginGoogleError,
  } = useLoginGoogle()

  const handleLoginGoogle = () => {
    mutateLoginGoogle()
    setDisabled(true)
  }

  useEffect(() => {
    if (isLoginError || isLoginGoogleError) {
      setDisabled(false)
    }
  }, [isLoginError, isLoginGoogleError])

  return (
    <div className="bg-muted/40 flex min-h-dvh items-center justify-center">
      <Card className="min-h-dvh w-full max-w-md rounded-none border-none shadow-none md:min-h-fit md:rounded-md md:border md:shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="grid">
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                to continue to {metadata.title?.toString()}
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
                autoFocus
                required
                disabled={disabled}
              />
              <Input
                label="Password"
                name="password"
                type={passwordType}
                hint={
                  <Link
                    href="/auth/forgot-password"
                    className="block text-right hover:underline"
                  >
                    Forgot your password?
                  </Link>
                }
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
                disabled={disabled}
                isLoading={isLoginPending}
                type="submit"
              >
                Continue
              </Button>
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="grid space-y-4">
          <Button
            containerClassName="w-full"
            variant="outline"
            onClick={handleLoginGoogle}
            disabled={disabled}
            isLoading={isLoginGooglePending}
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <UIButton
              variant="link"
              asChild
            >
              <Link href="/auth/sign-up">Sign up</Link>
            </UIButton>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

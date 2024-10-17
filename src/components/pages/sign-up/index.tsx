'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth'
import { Eye, EyeClosed } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
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
import { useFirebase } from '@/contexts'
import { toast, useQueryActions } from '@/hooks'
import { TSignUpRequest } from '@/types'

import { schema } from './validation'

export const SignUpPage: FC = () => {
  const { refresh } = useRouter()
  const { invalidateQueries: invalidateUser } = useQueryActions(['auth-user'])
  const [disabled, setDisabled] = useState(false)
  const [passwordType, setPasswordType] = useState('password')
  const { isLoading } = useFirebase()
  const formMethods = useForm<TSignUpRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const { handleSubmit } = formMethods
  const onSubmit = handleSubmit(async (data) => {
    setDisabled(true)
    mutateRegister(data)
  })
  const togglePassword = () => {
    setPasswordType((prev) => (prev === 'password' ? 'text' : 'password'))
  }

  const { mutate: mutateRegister, isPending: isRegisterPending } = useMutation({
    mutationFn: async (data: TSignUpRequest) => {
      await createUserWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      )
      if (firebaseAuth.currentUser) {
        updateProfile(firebaseAuth.currentUser, {
          displayName: data.displayName,
        })
        sendEmailVerification(firebaseAuth.currentUser)
      } else {
        throw new Error('No user is currently signed in.')
      }
    },
    onSuccess: () => {
      invalidateUser()
      toast({
        description: 'Please check your email to verify your account.',
      })
      refresh()
    },
    onError: (error: unknown) => {
      let message = String(error)
      if (error instanceof FirebaseError) {
        message =
          firebaseAuthError.find((item) => item.code === error.code)?.message ||
          error.message
      }
      setDisabled(false)
      toast({
        variant: 'destructive',
        description: message,
      })
    },
  })

  return (
    <div className="bg-muted/40 flex min-h-dvh items-center justify-center">
      <Card className="min-h-dvh w-full max-w-md rounded-none md:min-h-fit md:rounded-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="grid">
              <CardTitle>Sign up</CardTitle>
              <CardDescription>
                Enter your information to create an account
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
                label="Display Name"
                name="displayName"
                placeholder="Display Name"
                autoFocus
                required
                disabled={disabled}
              />
              <Input
                label="Email"
                name="email"
                placeholder="you@example.com"
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
              <Input
                label="Confirm Password"
                name="confirmPassword"
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
        <CardFooter className="grid">
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <UIButton
              variant="link"
              asChild
            >
              <Link href="/sign-in">Sign in</Link>
            </UIButton>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { Eye, EyeClosed } from 'lucide-react'
import { FC, useState } from 'react'
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
import { firebaseAuth } from '@/configs'
import { firebaseAuthError, metadata } from '@/constants'
import { useFirebase } from '@/contexts'
import { toast, useQueryActions } from '@/hooks'
import { TRegisterRequest } from '@/types'

import { schema } from './validation'

export const AuthPage: FC = () => {
  const provider = new GoogleAuthProvider()
  const { invalidateQueries: invalidateUser } = useQueryActions(['auth-user'])
  const [disabled, setDisabled] = useState(false)
  const [passwordType, setPasswordType] = useState('password')
  const { isLoading } = useFirebase()
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
    mutateRegister(data)
  })
  const togglePassword = () => {
    setPasswordType((prev) => (prev === 'password' ? 'text' : 'password'))
  }

  const { mutate: mutateGoogleLogin, isPending: isGoogleLoginPending } =
    useMutation({
      mutationFn: () => signInWithPopup(firebaseAuth, provider),
      onMutate: () => {
        setDisabled(true)
      },
      onSuccess: () => {
        invalidateUser()
      },
      onError: (error: unknown) => {
        let message = String(error)
        if (error instanceof FirebaseError) {
          message =
            firebaseAuthError.find((item) => item.code === error.code)
              ?.message || error.message
        }
        setDisabled(false)
        toast({
          variant: 'destructive',
          description: message,
        })
      },
    })

  const { mutate: mutateRegister, isPending: isRegisterPending } = useMutation({
    mutationFn: (data: TRegisterRequest) =>
      createUserWithEmailAndPassword(firebaseAuth, data.email, data.password),
    onSuccess: () => {
      invalidateUser()
    },
    onError: (
      error: unknown,
      variables: { email: string; password: string }
    ) => {
      let message = ''
      if (error instanceof FirebaseError) {
        const action = firebaseAuthError.find(
          (item) => item.code === error.code
        )?.action
        if (action === 'signin') {
          mutateLogin(variables)
        } else {
          message =
            firebaseAuthError.find((item) => item.code === error.code)
              ?.message || error.message
        }
      } else {
        message = String(error)
      }
      if (message) {
        setDisabled(false)
        toast({
          variant: 'destructive',
          description: message,
        })
      }
    },
  })

  const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
    mutationFn: (data: TRegisterRequest) =>
      signInWithEmailAndPassword(firebaseAuth, data.email, data.password),
    onSuccess: () => {
      invalidateUser()
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
                isLoading={isRegisterPending || isLoginPending}
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
            onClick={() => mutateGoogleLogin()}
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

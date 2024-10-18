'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import {
  GoogleAuthProvider,
  linkWithPopup,
  sendEmailVerification,
  verifyBeforeUpdateEmail,
} from 'firebase/auth'
import { BadgeAlert, BadgeCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'

import { Button, Input } from '@/components/base'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui'
import { firebaseAuth } from '@/configs'
import { firebaseAuthError, metadata } from '@/constants'
import { toast, useAuthUser, useQueryActions } from '@/hooks'
import { TUpdateEmailRequest } from '@/types'
import { cn } from '@/utils'

import { schema } from './validation'

export const AccountSettingsPage = () => {
  const provider = new GoogleAuthProvider()
  const { invalidateQueries: invalidateUser } = useQueryActions(['auth-user'])
  const [disabled, setDisabled] = useState(false)
  const [timerEmailVerify, setTimerEmailVerify] = useState<number | undefined>()
  const [timerUpdateEmail, setTimerUpdateEmail] = useState<number | undefined>()
  const { data: userData } = useAuthUser()
  const formMethods = useForm<TUpdateEmailRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: userData?.email || '',
    },
  })
  const userGoogleProvider = userData?.providerData.find(
    (provider) => provider.providerId === 'google.com'
  )
  const { handleSubmit, watch } = formMethods
  const watchEmail = watch('email')
  const onSubmit = handleSubmit(async (data) => {
    setDisabled(true)
    mutateUpdateEmail(data)
  })

  const { mutate: mutateUpdateEmail, isPending: isUpdateEmailPending } =
    useMutation({
      mutationFn: (data: TUpdateEmailRequest) => {
        if (firebaseAuth.currentUser) {
          return verifyBeforeUpdateEmail(firebaseAuth.currentUser, data.email)
        } else {
          throw new Error('No user is currently signed in.')
        }
      },
      onSuccess: () => {
        toast({
          description: 'Your email has been updated successfully.',
        })
        setTimerUpdateEmail(30)
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
    if (timerUpdateEmail === 0) {
      setTimerUpdateEmail(undefined)
      window.location.reload()
    } else if (timerUpdateEmail) {
      const timer = setTimeout(() => {
        setTimerUpdateEmail((prev) => prev! - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [timerUpdateEmail])

  const {
    mutate: mutateSendEmailVerification,
    isPending: isSendEmailVerificationPending,
  } = useMutation({
    mutationFn: () => {
      if (firebaseAuth.currentUser) {
        return sendEmailVerification(firebaseAuth.currentUser)
      } else {
        throw new Error('No user is currently signed in.')
      }
    },
    onMutate: () => {
      setDisabled(true)
    },
    onSuccess: () => {
      toast({
        description: 'Verification email has been sent successfully.',
      })
      setTimerEmailVerify(30)
    },
    onError: (error: unknown) => {
      let message = String(error)
      if (error instanceof FirebaseError) {
        message =
          firebaseAuthError.find((item) => item.code === error.code)?.message ||
          error.message
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
    if (timerEmailVerify === 0) {
      setTimerEmailVerify(undefined)
      window.location.reload()
    } else if (timerEmailVerify) {
      const timer = setTimeout(() => {
        setTimerEmailVerify((prev) => prev! - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [timerEmailVerify])

  const { mutate: mutateLinkGoogle, isPending: isLinkGooglePending } =
    useMutation({
      mutationFn: () => {
        if (firebaseAuth.currentUser) {
          return linkWithPopup(firebaseAuth.currentUser, provider)
        } else {
          throw new Error('No user is currently signed in.')
        }
      },
      onMutate: () => {
        setDisabled(true)
      },
      onSuccess: () => {
        toast({
          description: 'Your Google account has been linked successfully.',
        })
        invalidateUser()
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

  return (
    <div className="grid gap-6">
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Change email address</CardTitle>
          <CardDescription>Update your email address.</CardDescription>
        </CardHeader>
        <FormProvider {...formMethods}>
          <form onSubmit={onSubmit}>
            <CardContent className="flex items-end space-x-4">
              <Input
                label="Email"
                name="email"
                disabled={disabled || !userData?.emailVerified}
                placeholder="Display Name"
                className="w-full"
                rightNode={({ className }) =>
                  watchEmail === userData?.email && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {userData?.emailVerified ? (
                            <BadgeCheck
                              className={cn(className, 'text-green-500')}
                            />
                          ) : (
                            <BadgeAlert
                              className={cn(className, 'text-red-500')}
                            />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          {userData?.emailVerified
                            ? 'Email verified'
                            : 'Email not verified'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                }
              />
              {!userData?.emailVerified && (
                <Button
                  className="w-fit"
                  disabled={disabled || !!timerEmailVerify}
                  type="button"
                  isLoading={isSendEmailVerificationPending}
                  onClick={() => mutateSendEmailVerification()}
                >
                  Verify Email {timerEmailVerify && `(${timerEmailVerify})`}
                </Button>
              )}
            </CardContent>
            <CardFooter className="space-x-4 border-t px-6 py-4">
              <Button
                disabled={
                  isUpdateEmailPending ||
                  disabled ||
                  !userData?.emailVerified ||
                  !!timerUpdateEmail
                }
                isLoading={isUpdateEmailPending}
                type="submit"
              >
                Save {timerUpdateEmail && `(${timerUpdateEmail})`}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
      <Card x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-1">
            <span>Link Google account</span>
          </CardTitle>
          <CardDescription>
            After linking your Google account, you can sign in to{' '}
            {metadata.title?.toString()} with your Google account, in addition
            to using your email and password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            containerClassName="w-full sm:w-fit"
            variant="outline"
            onClick={() => mutateLinkGoogle()}
            disabled={disabled || !!userGoogleProvider}
            isLoading={isLinkGooglePending}
          >
            <FcGoogle className="text-xl" />
            {userGoogleProvider
              ? `Linked to ${userGoogleProvider.email}`
              : 'Link your Google account'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

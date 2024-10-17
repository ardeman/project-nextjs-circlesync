'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { sendEmailVerification, verifyBeforeUpdateEmail } from 'firebase/auth'
import { BadgeAlert, BadgeCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

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
import { firebaseAuthError } from '@/constants'
import { toast, useAuthUser } from '@/hooks'
import { TUpdateEmailRequest } from '@/types'
import { cn } from '@/utils'

import { schema } from './validation'

export const AccountSettingsPage = () => {
  const { refresh } = useRouter()
  const [disabled, setDisabled] = useState(false)
  const [timerVerification, setTimerVerification] = useState<
    number | undefined
  >()
  const { data: userData } = useAuthUser()
  const formMethods = useForm<TUpdateEmailRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: userData?.email || '',
    },
  })
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
      setTimerVerification(30)
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
    if (timerVerification === 0) {
      setTimerVerification(undefined)
      refresh()
    } else if (timerVerification) {
      const timer = setTimeout(() => {
        setTimerVerification((prev) => prev! - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [timerVerification, refresh])

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
                  disabled={disabled || !!timerVerification}
                  type="button"
                  isLoading={isSendEmailVerificationPending}
                  onClick={() => mutateSendEmailVerification()}
                >
                  Verify Email {timerVerification && `(${timerVerification})`}
                </Button>
              )}
            </CardContent>
            <CardFooter className="space-x-4 border-t px-6 py-4">
              <Button
                disabled={
                  isUpdateEmailPending || disabled || !userData?.emailVerified
                }
                isLoading={isUpdateEmailPending}
                type="submit"
              >
                Save
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
      <Card x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle>Link Google account</CardTitle>
          <CardDescription>
            Link your Google account to use single sign-on.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <form className="flex flex-col gap-4">
            <Input
              placeholder="Project Name"
              defaultValue="/content/plugins"
            />
          </form> */}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { updateProfile } from 'firebase/auth'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Button, Input } from '@/components/base'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { firebaseAuth } from '@/configs'
import { firebaseAuthError } from '@/constants'
import { toast, useAuthUser, useQueryActions } from '@/hooks'
import { TUpdateProfileRequest } from '@/types'

import { schema } from './validation'

export const GeneralSettingsPage = () => {
  const [disabled, setDisabled] = useState(false)
  const { invalidateQueries: invalidateUser } = useQueryActions(['auth-user'])
  const { data: userData } = useAuthUser()
  const formMethods = useForm<TUpdateProfileRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: userData?.displayName,
    },
  })
  const { handleSubmit } = formMethods
  const onSubmit = handleSubmit(async (data) => {
    setDisabled(true)
    mutateUpdateProfile(data)
  })

  const { mutate: mutateUpdateProfile, isPending: isUpdateProfilePending } =
    useMutation({
      mutationFn: (data: TUpdateProfileRequest) => {
        if (firebaseAuth.currentUser) {
          return updateProfile(firebaseAuth.currentUser, {
            displayName: data.displayName,
          })
        } else {
          throw new Error('No user is currently signed in.')
        }
      },
      onSuccess: () => {
        invalidateUser()
        toast({
          description: 'Your profile has been updated successfully.',
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

  return (
    <div className="grid gap-6">
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your profile information.</CardDescription>
        </CardHeader>
        <FormProvider {...formMethods}>
          <form onSubmit={onSubmit}>
            <CardContent>
              <Input
                label="Display Name"
                name="displayName"
                disabled={disabled}
                placeholder="Display Name"
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                disabled={isUpdateProfilePending || disabled}
                isLoading={isUpdateProfilePending}
                type="submit"
              >
                Save
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  )
}

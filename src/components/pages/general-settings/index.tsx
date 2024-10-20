'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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
} from '@/components/ui'
import { useAuthUser, useUpdateProfile } from '@/hooks'
import { TUpdateProfileRequest } from '@/types'

import { schema } from './validation'

export const GeneralSettingsPage = () => {
  const [disabled, setDisabled] = useState(false)
  const { data: userData } = useAuthUser()
  const formMethods = useForm<TUpdateProfileRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: userData?.displayName || '',
    },
  })
  const { handleSubmit } = formMethods
  const onSubmit = handleSubmit(async (data) => {
    setDisabled(true)
    mutateUpdateProfile(data)
  })

  const {
    mutate: mutateUpdateProfile,
    isPending: isUpdateProfilePending,
    isSuccess: isUpdateProfileSuccess,
    isError: isUpdateProfileError,
  } = useUpdateProfile()

  useEffect(() => {
    if (isUpdateProfileError || isUpdateProfileSuccess) {
      setDisabled(false)
    }
  }, [isUpdateProfileSuccess, isUpdateProfileError])

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

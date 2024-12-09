'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'

import { toast } from '@/hooks'
import { TShareForm } from '@/types'
import { shareSchema } from '@/validations'

import { useNote } from './context'

export const Share = () => {
  const { selectedNote } = useNote()
  const formMethods = useForm<TShareForm>({
    resolver: zodResolver(shareSchema),
    values: {
      writers: selectedNote?.permissions?.write || [],
      readers: selectedNote?.permissions?.read || [],
    },
  })
  const { handleSubmit } = formMethods

  const onSubmit = handleSubmit(async (data) => {
    toast({
      description: JSON.stringify(data, null, 2),
    })
  })

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={onSubmit}
        className="group/form is-shown space-y-4"
      ></form>
    </FormProvider>
  )
}

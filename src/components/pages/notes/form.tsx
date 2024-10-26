import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Button, Input, Textarea } from '@/components/base'
import { TNoteRequest } from '@/types'
import { noteSchema } from '@/validations'

import { TFormProps } from './type'

export const Form = (props: TFormProps) => {
  const { selectedNote } = props
  const [disabled, setDisabled] = useState(false)
  const formMethods = useForm<TNoteRequest>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })
  const { handleSubmit } = formMethods
  const onSubmit = handleSubmit(async (data) => {
    setDisabled(true)
    // mutateLogin(data)
    console.log(selectedNote, data) // eslint-disable-line no-console
  })

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={onSubmit}
        className="space-y-4"
      >
        <Input
          name="title"
          placeholder="Title"
          inputClassName="border-none ring-0 text-xl font-semibold focus-visible:ring-0 rounded-none p-0"
        />
        <Textarea
          name="content"
          placeholder="Content"
          inputClassName="border-none ring-0 focus-visible:ring-0 rounded-none p-0"
          autoResize={true}
        />
        <Button
          disabled={disabled}
          // isLoading={isMutateNotePending}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </FormProvider>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Button, Input } from '@/components/base'
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
        className="space-y-6"
      >
        <Input
          name="title"
          label="Title"
          placeholder="Title"
        />
        <Input
          name="content"
          label="Content"
          placeholder="Content"
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

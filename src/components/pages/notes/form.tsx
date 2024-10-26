import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'

import { Input, Textarea } from '@/components/base'
import { TNoteRequest } from '@/types'
import { noteSchema } from '@/validations'

import { TFormProps } from './type'

export const Form = (props: TFormProps) => {
  const { selectedNote } = props
  const formMethods = useForm<TNoteRequest>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })
  const { handleSubmit } = formMethods
  const onSubmit = handleSubmit(async (data) => {
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
          inputClassName="border-none ring-0 text-xl font-semibold focus:ring-0 rounded-none p-0 focus:shadow-none focus:outline-none"
          autoFocus={true}
        />
        <Textarea
          name="content"
          placeholder="Content"
          inputClassName="border-none ring-0 focus:ring-0 rounded-none p-0 focus:shadow-none focus:outline-none"
        />
      </form>
    </FormProvider>
  )
}

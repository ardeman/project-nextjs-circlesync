'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Textarea } from '@/components/base'
import {
  useCreateNote,
  useDebounce,
  useQueryActions,
  useUpdateNote,
} from '@/hooks'
import { useGetNote } from '@/hooks'
import { TNoteForm } from '@/types'
import { noteSchema } from '@/validations'

import { TFormProps } from './type'

export const Form = (props: TFormProps) => {
  const { selectedNote, setSelectedNote } = props
  const { mutate: mutateCreateNote, data } = useCreateNote()
  const { mutate: mutateUpdateNote } = useUpdateNote()
  const { invalidateQueries: invalidateNote } = useQueryActions(['note'])
  const { data: noteData, isFetching } = useGetNote(selectedNote || '')
  const formMethods = useForm<TNoteForm>({
    resolver: zodResolver(noteSchema),
    values: {
      title: noteData?.title || '',
      content: noteData?.content || '',
    },
  })
  const {
    handleSubmit,
    watch,
    formState: { isDirty },
  } = formMethods
  const watchTitle = watch('title')
  const watchContent = watch('content')

  const onSubmit = handleSubmit(async (data) => {
    if (selectedNote) {
      mutateUpdateNote({ id: selectedNote, ...data })
      return
    }
    mutateCreateNote(data)
  })

  useDebounce({
    trigger: () => onSubmit(),
    watch: [watchTitle, watchContent],
    condition: isDirty && (watchTitle.length > 0 || watchContent.length > 0),
  })

  useEffect(() => {
    if (data && !selectedNote) {
      setSelectedNote(data.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selectedNote])

  useEffect(() => {
    if (selectedNote) {
      invalidateNote()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNote])

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={onSubmit}
        className="space-y-4"
      >
        <Textarea
          disabled={isFetching}
          name="title"
          placeholder="Title"
          inputClassName="border-none ring-0 text-xl font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none p-0 focus-visible:shadow-none focus:outline-none resize-none min-h-0"
          autoFocus
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              formMethods.setFocus('content')
            }
          }}
        />
        <Textarea
          disabled={isFetching}
          name="content"
          placeholder="Content"
          inputClassName="border-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none p-0 focus-visible:shadow-none focus:outline-none"
        />
      </form>
    </FormProvider>
  )
}

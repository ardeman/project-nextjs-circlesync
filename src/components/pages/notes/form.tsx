'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { forwardRef, useImperativeHandle } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Textarea } from '@/components/base'
import { useCreateNote, useDebounce, useUpdateNote, useUserData } from '@/hooks'
import { TNoteForm } from '@/types'
import { formatDate, getDateLabel } from '@/utils'
import { noteSchema } from '@/validations'

import { Action } from './action'
import { useNote } from './context'
import { TFormProps } from './type'

export const Form = forwardRef((props: TFormProps, ref) => {
  const { notes } = props
  const { selectedNote } = useNote()
  const note = notes?.find((n) => n.id === selectedNote?.id)
  const dateLabel = note ? getDateLabel(note.updatedAt?.seconds) : ''
  const date = note
    ? formatDate(note.updatedAt?.seconds || note.createdAt.seconds)
    : ''
  const { data: userData } = useUserData()
  const isPinned = note?.isPinned
  const isCollaborator = note?.collaborators?.includes(userData?.uid)
  const isOwner = note?.owner === userData?.uid
  const isEditable = isOwner || isCollaborator
  const { mutate: mutateCreateNote } = useCreateNote()
  const { mutate: mutateUpdateNote } = useUpdateNote()
  const formMethods = useForm<TNoteForm>({
    resolver: zodResolver(noteSchema),
    values: {
      title: selectedNote?.title || '',
      content: selectedNote?.content || '',
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
    if ((data.title.length === 0 && data.content.length === 0) || !isDirty) {
      return
    }
    if (selectedNote) {
      mutateUpdateNote({ id: selectedNote.id, ...data })
      return
    }
    mutateCreateNote(data)
  })

  useDebounce({
    trigger: () => onSubmit(),
    watch: [watchTitle, watchContent],
    condition: !!selectedNote,
  })

  // Expose the submit function to the parent component via ref
  useImperativeHandle(ref, () => ({
    submit: () => onSubmit(),
  }))

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={onSubmit}
        className="group/form is-shown space-y-4"
      >
        {note && (
          <Action
            note={note}
            isOwner={isOwner}
            isEditable={isEditable}
            isPinned={isPinned}
          />
        )}
        <Textarea
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
          name="content"
          placeholder="Content"
          inputClassName="border-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none p-0 focus-visible:shadow-none focus:outline-none resize-none"
        />
      </form>
      <span className="text-muted-foreground flex justify-center text-xs">
        {dateLabel} {date}
      </span>
    </FormProvider>
  )
})
Form.displayName = 'Form'

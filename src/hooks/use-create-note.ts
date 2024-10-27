import { useMutation } from '@tanstack/react-query'

import { createNote } from '@/firestore'
import { TCreateNoteRequest } from '@/types'

import { useQueryActions } from './use-query-actions'
import { toast } from './use-toast'

export const useCreateNote = () => {
  const { invalidateQueries: invalidateNotes } = useQueryActions(['notes'])
  return useMutation({
    mutationFn: (data: TCreateNoteRequest) => createNote(data),
    onSuccess: () => {
      invalidateNotes()
    },
    onError: (error: unknown) => {
      const message = String(error)
      toast({
        variant: 'destructive',
        description: message,
      })
    },
  })
}

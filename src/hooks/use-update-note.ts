import { useMutation } from '@tanstack/react-query'

import { updateNote } from '@/firestore'
import { TUpdateNoteRequest } from '@/types'

import { useQueryActions } from './use-query-actions'
import { toast } from './use-toast'

export const useUpdateNote = () => {
  const { invalidateQueries: invalidateNotes } = useQueryActions(['notes'])
  return useMutation({
    mutationFn: (data: TUpdateNoteRequest) => updateNote(data),
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

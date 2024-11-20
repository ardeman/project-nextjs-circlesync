import { useMutation } from '@tanstack/react-query'

import { ToastAction } from '@/components/ui'
import { deleteNote } from '@/firestore'
import { TNoteResponse } from '@/types'

import { useCreateNote } from './use-create-note'
import { useQueryActions } from './use-query-actions'
import { toast } from './use-toast'

export const useDeleteNote = () => {
  const { invalidateQueries: invalidateNotes } = useQueryActions(['notes'])
  const { mutate: mutateCreateNote } = useCreateNote()

  return useMutation({
    mutationFn: (note: TNoteResponse) => deleteNote(note),
    onSuccess: (note: TNoteResponse) => {
      invalidateNotes()
      toast({
        description: 'Note deleted successfully',
        action: (
          <ToastAction
            altText="Undo"
            onClick={() => mutateCreateNote(note)}
          >
            Undo
          </ToastAction>
        ),
      })
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

import { useMutation } from '@tanstack/react-query'

import { unlinkNote } from '@/firestore'
import { TNoteResponse } from '@/types'

import { useQueryActions } from './use-query-actions'
import { toast } from './use-toast'

export const useUnlinkNote = () => {
  const { invalidateQueries: invalidateNotes } = useQueryActions(['notes'])
  return useMutation({
    mutationFn: (data: TNoteResponse) => unlinkNote(data),
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

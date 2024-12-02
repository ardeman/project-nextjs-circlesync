import { useMutation } from '@tanstack/react-query'
import { deleteDoc, doc } from 'firebase/firestore'
import { useFirestore, useUser } from 'reactfire'

import { ToastAction } from '@/components/ui'
import { TNoteResponse } from '@/types'

import { useCreateNote } from './use-create-note'
import { toast } from './use-toast'

export const useDeleteNote = () => {
  const firestore = useFirestore()
  const { data: user } = useUser()
  const { mutate: mutateCreateNote } = useCreateNote()
  return useMutation({
    mutationFn: async (note: TNoteResponse) => {
      if (!firestore) {
        throw new Error('Firebase Firestore is not initialized.')
      }
      if (!user) {
        throw new Error('No user is currently signed in.')
      }
      const { id } = note
      const ref = doc(firestore, 'notes', id)
      await deleteDoc(ref)
      return note
    },
    onSuccess: (note: TNoteResponse) => {
      const { isPinned: _isPinned, id: _id, ...data } = note
      toast({
        description: 'Note deleted successfully',
        action: (
          <ToastAction
            altText="Undo"
            onClick={() => mutateCreateNote(data)}
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

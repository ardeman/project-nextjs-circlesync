import { useMutation } from '@tanstack/react-query'
import { doc, updateDoc } from 'firebase/firestore'
import { useFirestore, useUser } from 'reactfire'

import { TPinNoteRequest } from '@/types'

import { toast } from './use-toast'

export const usePinNote = () => {
  const firestore = useFirestore()
  const { data: user } = useUser()
  return useMutation({
    mutationFn: async (data: TPinNoteRequest) => {
      if (!firestore) {
        throw new Error('Firebase Firestore is not initialized.')
      }
      if (!user) {
        throw new Error('No user is currently signed in.')
      }
      const { note, isPinned } = data
      const pinnedBy = new Set(note.pinnedBy || [])
      if (isPinned) {
        pinnedBy.add(user.uid)
      } else {
        pinnedBy.delete(user.uid)
      }

      const ref = doc(firestore, 'notes', note.id)
      return await updateDoc(ref, {
        pinnedBy: [...pinnedBy],
        updatedAt: new Date(),
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

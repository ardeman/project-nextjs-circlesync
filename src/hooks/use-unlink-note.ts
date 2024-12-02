import { useMutation } from '@tanstack/react-query'
import { doc, updateDoc } from 'firebase/firestore'
import { useFirestore, useUser } from 'reactfire'

import { TNoteResponse } from '@/types'

import { toast } from './use-toast'

export const useUnlinkNote = () => {
  const firestore = useFirestore()
  const { data: user } = useUser()
  return useMutation({
    mutationFn: async (note: TNoteResponse) => {
      if (!firestore) {
        throw new Error('Firebase Firestore is not initialized.')
      }
      if (!user) {
        throw new Error('No user is currently signed in.')
      }
      const { id, collaborators, spectators } = note
      const data = {
        collaborators: collaborators?.filter((c) => c !== user?.uid) || [],
        spectators: spectators?.filter((s) => s !== user?.uid) || [],
      }

      const ref = doc(firestore, 'notes', id)
      return await updateDoc(ref, {
        ...data,
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

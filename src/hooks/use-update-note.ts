import { useMutation } from '@tanstack/react-query'
import { doc, updateDoc } from 'firebase/firestore'
import { useFirestore, useUser } from 'reactfire'

import { TUpdateNoteRequest } from '@/types'

import { toast } from './use-toast'

export const useUpdateNote = () => {
  const firestore = useFirestore()
  const { data: user } = useUser()
  return useMutation({
    mutationFn: async (data: TUpdateNoteRequest) => {
      if (!firestore) {
        throw new Error('Firebase Firestore is not initialized.')
      }
      if (!user) {
        throw new Error('No user is currently signed in.')
      }
      const { id, ...rest } = data
      const ref = doc(firestore, 'notes', id)
      return await updateDoc(ref, {
        ...rest,
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

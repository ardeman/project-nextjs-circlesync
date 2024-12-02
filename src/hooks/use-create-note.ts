import { useMutation } from '@tanstack/react-query'
import { addDoc, collection } from 'firebase/firestore'
import { useFirestore, useUser } from 'reactfire'

import { TCreateNoteRequest } from '@/types'

import { toast } from './use-toast'

export const useCreateNote = () => {
  const firestore = useFirestore()
  const { data: user } = useUser()
  return useMutation({
    mutationFn: async (data: TCreateNoteRequest) => {
      if (!firestore) {
        throw new Error('Firebase Firestore is not initialized.')
      }
      if (!user) {
        throw new Error('No user is currently signed in.')
      }
      const ref = collection(firestore, 'notes')
      return await addDoc(ref, {
        ...data,
        owner: user.uid,
        createdAt: new Date(),
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

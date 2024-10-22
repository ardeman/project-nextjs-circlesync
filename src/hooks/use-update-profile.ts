import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { doc, updateDoc } from 'firebase/firestore'

import { firebaseAuth, firebaseDb } from '@/configs'
import { firebaseAuthError } from '@/constants'
import { TUpdateProfileRequest } from '@/types'

import { useQueryActions } from './use-query-actions'
import { toast } from './use-toast'

export const useUpdateProfile = () => {
  const { invalidateQueries: invalidateCurrentUser } = useQueryActions([
    'current-user',
  ])
  return useMutation({
    mutationFn: async (data: TUpdateProfileRequest) => {
      if (!firebaseAuth?.currentUser || !firebaseDb) {
        throw new Error('Firebase is not initialized.')
      }

      // Reference to the user's document in Firestore
      const userRef = doc(firebaseDb, 'users', firebaseAuth?.currentUser.uid)

      // Update the displayName in Firestore
      await updateDoc(userRef, {
        displayName: data.displayName,
      })
    },
    onSuccess: () => {
      toast({
        description: 'Your profile has been updated successfully.',
      })
      invalidateCurrentUser()
    },
    onError: (error: unknown) => {
      let message = String(error)
      if (error instanceof FirebaseError) {
        message =
          firebaseAuthError.find((item) => item.code === error.code)?.message ||
          error.message
      }
      toast({
        variant: 'destructive',
        description: message,
      })
    },
  })
}

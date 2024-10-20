import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

import { firebaseAuth, firebaseDb } from '@/configs'
import { firebaseAuthError } from '@/constants'
import { TSignInRequest } from '@/types'

import { useQueryActions } from './use-query-actions'
import { toast } from './use-toast'

export const useLogin = () => {
  const { invalidateQueries: invalidateUser } = useQueryActions(['auth-user'])
  return useMutation({
    mutationFn: async (data: TSignInRequest) => {
      if (!firebaseAuth) {
        throw new Error('Firebase Auth is not initialized.')
      }
      if (!firebaseDb) {
        throw new Error('Firebase Firestore is not initialized.')
      }

      // Sign in with email and password
      const result = await signInWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      )
      const user = result.user

      if (user) {
        // Check if user exists in Firestore
        const userRef = doc(firebaseDb, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()

        // If user data doesn't exist, store it
        if (userData && userData.email !== user.email) {
          await updateDoc(userRef, {
            email: user.email,
          })
        }
      }
    },
    onSuccess: () => {
      invalidateUser()
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

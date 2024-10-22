import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

import { firebaseAuth, firebaseDb } from '@/configs'
import { firebaseAuthError } from '@/constants'

import { useQueryActions } from './use-query-actions'
import { toast } from './use-toast'

export const useLoginGoogle = () => {
  const provider = new GoogleAuthProvider()
  const { invalidateQueries: invalidateUser } = useQueryActions(['auth-user'])
  return useMutation({
    mutationFn: async () => {
      if (!firebaseAuth || !firebaseDb) {
        throw new Error('Firebase is not initialized.')
      }

      // Sign in with Google
      const result = await signInWithPopup(firebaseAuth, provider)
      const user = result.user

      if (user) {
        // Check if user exists in Firestore
        const userRef = doc(firebaseDb, 'users', user.uid)
        const userSnap = await getDoc(userRef)

        // If user data doesn't exist, store it
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString(),
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

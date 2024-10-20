import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

import { firebaseAuth, firebaseDb } from '@/configs'
import { firebaseAuthError } from '@/constants'
import { TSignUpRequest } from '@/types'

import { useQueryActions } from './use-query-actions'
import { toast } from './use-toast'

export const useRegister = () => {
  const { refresh } = useRouter()
  const { invalidateQueries: invalidateUser } = useQueryActions(['auth-user'])
  return useMutation({
    mutationFn: async (data: TSignUpRequest) => {
      if (!firebaseAuth) {
        throw new Error('Firebase Auth is not initialized.')
      }
      if (!firebaseDb) {
        throw new Error('Firebase Firestore is not initialized.')
      }
      // Create the user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      )
      const user = userCredential.user

      if (user) {
        // Update the user's profile with the display name
        await updateProfile(user, {
          displayName: data.displayName,
        })

        // Send email verification
        await sendEmailVerification(user)

        // Store user data in Firestore
        await setDoc(doc(firebaseDb, 'users', user.uid), {
          uid: user.uid,
          displayName: data.displayName,
          email: data.email,
          createdAt: new Date().toISOString(),
        })
      } else {
        throw new Error('No user is currently signed in.')
      }
    },
    onSuccess: () => {
      invalidateUser()
      toast({
        description: 'Please check your email to verify your account.',
      })
      refresh()
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

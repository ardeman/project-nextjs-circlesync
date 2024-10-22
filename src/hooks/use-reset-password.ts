import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { sendPasswordResetEmail } from 'firebase/auth'

import { firebaseAuth } from '@/configs'
import { firebaseAuthError } from '@/constants'

import { toast } from './use-toast'

export const useResetPassword = () => {
  return useMutation({
    mutationFn: () => {
      if (!firebaseAuth?.currentUser?.email) {
        throw new Error('No user is currently signed in.')
      }
      return sendPasswordResetEmail(
        firebaseAuth,
        firebaseAuth.currentUser.email
      )
    },
    onSuccess: () => {
      toast({
        description: 'Password reset email has been sent.',
      })
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

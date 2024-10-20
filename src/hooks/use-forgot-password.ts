import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { sendPasswordResetEmail } from 'firebase/auth'

import { firebaseAuth } from '@/configs'
import { firebaseAuthError } from '@/constants'
import { TEmailRequest } from '@/types'

import { toast } from './use-toast'

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: TEmailRequest) => {
      if (!firebaseAuth) {
        throw new Error('Firebase Auth is not initialized.')
      }
      await sendPasswordResetEmail(firebaseAuth, data.email)
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

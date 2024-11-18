import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { sendPasswordResetEmail } from 'firebase/auth'

import { auth } from '@/configs'
import { authError } from '@/constants'

import { toast } from './use-toast'

export const useResetPassword = () => {
  return useMutation({
    mutationFn: () => {
      if (!auth?.currentUser?.email) {
        throw new Error('No user is currently signed in.')
      }
      return sendPasswordResetEmail(auth, auth.currentUser.email)
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
          authError.find((item) => item.code === error.code)?.message ||
          error.message
      }
      toast({
        variant: 'destructive',
        description: message,
      })
    },
  })
}

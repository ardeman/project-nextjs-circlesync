import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { sendEmailVerification } from 'firebase/auth'

import { auth } from '@/configs'
import { authError } from '@/constants'

import { toast } from './use-toast'

export const useEmailVerification = () => {
  return useMutation({
    mutationFn: () => {
      if (!auth?.currentUser) {
        throw new Error('No user is currently signed in.')
      }
      return sendEmailVerification(auth.currentUser)
    },
    onSuccess: () => {
      toast({
        description: 'Verification email has been sent successfully.',
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

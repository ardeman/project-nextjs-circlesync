import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { sendEmailVerification } from 'firebase/auth'

import { firebaseAuth } from '@/configs'
import { firebaseAuthError } from '@/constants'

import { toast } from './use-toast'

export const useEmailVerification = () => {
  return useMutation({
    mutationFn: () => {
      if (!firebaseAuth?.currentUser) {
        throw new Error('No user is currently signed in.')
      }
      return sendEmailVerification(firebaseAuth.currentUser)
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

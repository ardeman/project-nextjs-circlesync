import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { verifyBeforeUpdateEmail } from 'firebase/auth'

import { firebaseAuth } from '@/configs'
import { firebaseAuthError } from '@/constants'
import { TEmailRequest } from '@/types'

import { toast } from './use-toast'

export const useUpdateEmail = () => {
  return useMutation({
    mutationFn: (data: TEmailRequest) => {
      if (firebaseAuth?.currentUser) {
        return verifyBeforeUpdateEmail(firebaseAuth.currentUser, data.email)
      } else {
        throw new Error('No user is currently signed in.')
      }
    },
    onSuccess: () => {
      toast({
        description: 'Your email has been updated successfully.',
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

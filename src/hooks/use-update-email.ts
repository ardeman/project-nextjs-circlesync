import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { verifyBeforeUpdateEmail } from 'firebase/auth'

import { auth } from '@/configs'
import { authError } from '@/constants'
import { TEmailRequest } from '@/types'

import { toast } from './use-toast'

export const useUpdateEmail = () => {
  return useMutation({
    mutationFn: async (data: TEmailRequest) => {
      if (!auth?.currentUser) {
        throw new Error('No user is currently signed in.')
      }

      await verifyBeforeUpdateEmail(auth.currentUser, data.email)
    },
    onSuccess: () => {
      toast({
        description: 'Please check your email to verify the new email address.',
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

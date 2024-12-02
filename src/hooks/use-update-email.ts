import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { verifyBeforeUpdateEmail } from 'firebase/auth'
import { useUser } from 'reactfire'

import { authError } from '@/constants'
import { TEmailRequest } from '@/types'

import { toast } from './use-toast'

export const useUpdateEmail = () => {
  const { data: user } = useUser()
  return useMutation({
    mutationFn: async (data: TEmailRequest) => {
      if (!user) {
        throw new Error('No user is currently signed in.')
      }

      await verifyBeforeUpdateEmail(user, data.email)
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

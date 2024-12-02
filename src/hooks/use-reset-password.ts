import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useAuth, useUser } from 'reactfire'

import { authError } from '@/constants'

import { toast } from './use-toast'

export const useResetPassword = () => {
  const { data: user } = useUser()
  const auth = useAuth()
  return useMutation({
    mutationFn: () => {
      if (!user?.email) {
        throw new Error('No user is currently signed in.')
      }
      return sendPasswordResetEmail(auth, user.email)
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

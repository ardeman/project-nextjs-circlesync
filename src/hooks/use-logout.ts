import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { signOut } from 'firebase/auth'
import { useAuth } from 'reactfire'

import { authError } from '@/constants'

import { toast } from './use-toast'

export const useLogout = () => {
  const auth = useAuth()
  return useMutation({
    mutationFn: async () => {
      await signOut(auth)
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

import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { GoogleAuthProvider, linkWithPopup } from 'firebase/auth'
import { useUser } from 'reactfire'

import { authError } from '@/constants'

import { toast } from './use-toast'

export const useLinkGoogle = () => {
  const provider = new GoogleAuthProvider()
  const { data: auth } = useUser()
  return useMutation({
    mutationFn: () => {
      if (!auth) {
        throw new Error('No user is currently signed in.')
      }
      return linkWithPopup(auth, provider)
    },
    onSuccess: () => {
      toast({
        description: 'Your Google account has been linked successfully.',
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

import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { GoogleAuthProvider, linkWithPopup } from 'firebase/auth'

import { firebaseAuth } from '@/configs'
import { firebaseAuthError } from '@/constants'

import { useQueryActions } from './use-query-actions'
import { toast } from './use-toast'

export const useLinkGoogle = () => {
  const provider = new GoogleAuthProvider()
  const { invalidateQueries: invalidateUser } = useQueryActions(['auth-user'])
  return useMutation({
    mutationFn: () => {
      if (!firebaseAuth?.currentUser) {
        throw new Error('No user is currently signed in.')
      }
      return linkWithPopup(firebaseAuth.currentUser, provider)
    },
    onSuccess: () => {
      toast({
        description: 'Your Google account has been linked successfully.',
      })
      invalidateUser()
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

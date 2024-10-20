import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { firebaseAuth } from '@/configs'
import { firebaseAuthError } from '@/constants'
import { TSignInRequest } from '@/types'

import { useQueryActions } from './use-query-actions'
import { toast } from './use-toast'

export const useLogin = () => {
  const { invalidateQueries: invalidateUser } = useQueryActions(['auth-user'])
  return useMutation({
    mutationFn: (data: TSignInRequest) => {
      if (!firebaseAuth) {
        throw new Error('Firebase Auth is not initialized.')
      }
      return signInWithEmailAndPassword(firebaseAuth, data.email, data.password)
    },
    onSuccess: () => {
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

import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { updateProfile } from 'firebase/auth'
import { useRouter } from 'next/navigation'

import { firebaseAuth } from '@/configs'
import { firebaseAuthError } from '@/constants'
import { TUpdateProfileRequest } from '@/types'

import { toast } from './use-toast'

export const useUpdateProfile = () => {
  const { refresh } = useRouter()
  return useMutation({
    mutationFn: (data: TUpdateProfileRequest) => {
      if (firebaseAuth?.currentUser) {
        return updateProfile(firebaseAuth.currentUser, {
          displayName: data.displayName,
        })
      } else {
        throw new Error('No user is currently signed in.')
      }
    },
    onSuccess: () => {
      toast({
        description: 'Your profile has been updated successfully.',
      })
      refresh()
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

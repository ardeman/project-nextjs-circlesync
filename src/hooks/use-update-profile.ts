import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'

import { authError } from '@/constants'
import { updateProfile } from '@/firestore'
import { TUpdateProfileRequest } from '@/types'

import { useQueryActions } from './use-query-actions'
import { toast } from './use-toast'

export const useUpdateProfile = () => {
  const { invalidateQueries: invalidateCurrentUser } = useQueryActions([
    'current-user',
  ])
  return useMutation({
    mutationFn: (data: TUpdateProfileRequest) => updateProfile(data),
    onSuccess: () => {
      toast({
        description: 'Your profile has been updated successfully.',
      })
      invalidateCurrentUser()
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

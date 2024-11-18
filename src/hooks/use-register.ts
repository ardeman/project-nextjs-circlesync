import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { useRouter } from 'next/navigation'

import { authError } from '@/constants'
import { register } from '@/firestore'
import { TSignUpRequest } from '@/types'

import { useQueryActions } from './use-query-actions'
import { toast } from './use-toast'

export const useRegister = () => {
  const { refresh } = useRouter()
  const { invalidateQueries: invalidateUser } = useQueryActions(['auth-user'])
  return useMutation({
    mutationFn: (data: TSignUpRequest) => register(data),
    onSuccess: () => {
      invalidateUser()
      toast({
        description: 'Please check your email to verify your account.',
      })
      refresh()
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

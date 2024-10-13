import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth'
import { useState } from 'react'

import { firebaseAuth } from '@/configs'
import { firebaseAuthError } from '@/data'

import { useAuthUser } from './use-auth-user'
import { useQueryActions } from './use-query-actions'

type TFirebaseAuthReturn = {
  user?: User | null
  isLoading: boolean
  error: string | null
  register: (email: string, password: string) => void
  loginWithGoogle: () => void
  logout: () => void
}

export const useFirebaseAuth = (): TFirebaseAuthReturn => {
  const { data: user, isLoading: isUserLoading } = useAuthUser()
  const [error, setError] = useState<string | null>(null)
  const provider = new GoogleAuthProvider()
  const { invalidateQueries: invalidateUser } = useQueryActions(['auth-user'])

  // Handle email/password registration
  const { mutate: mutateRegister, isPending: isRegisterPending } = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      createUserWithEmailAndPassword(firebaseAuth, data.email, data.password),
    onSuccess: () => {
      setError(null)
      invalidateUser()
    },
    onError: (
      error: unknown,
      variables: { email: string; password: string }
    ) => {
      if (error instanceof FirebaseError || error instanceof Error) {
        const code = error instanceof FirebaseError ? error.code : ''
        const action = firebaseAuthError.find(
          (item) => item.code === code
        )?.action
        if (action === 'signin') {
          mutateLogin({
            email: variables.email,
            password: variables.password,
          })
        } else {
          const message =
            firebaseAuthError.find((item) => item.code === code)?.message ||
            error.message
          setError(message)
        }
      } else {
        setError(String(error))
      }
    },
  })

  // Handle email/password login
  const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      signInWithEmailAndPassword(firebaseAuth, data.email, data.password),
    onSuccess: () => {
      setError(null)
      invalidateUser()
    },
    onError: (error: unknown) => {
      if (error instanceof FirebaseError || error instanceof Error) {
        const code = error instanceof FirebaseError ? error.code : ''
        const message =
          firebaseAuthError.find((item) => item.code === code)?.message ||
          error.message
        setError(message)
      } else {
        setError(String(error))
      }
    },
  })

  // Handle Google Sign-In
  const { mutate: mutateGoogleLogin, isPending: isGoogleLoginPending } =
    useMutation({
      mutationFn: () => signInWithPopup(firebaseAuth, provider),
      onSuccess: () => {
        setError(null)
        invalidateUser()
      },
      onError: (error: unknown) => {
        if (error instanceof FirebaseError || error instanceof Error) {
          const code = error instanceof FirebaseError ? error.code : ''
          const message =
            firebaseAuthError.find((item) => item.code === code)?.message ||
            error.message
          setError(message)
        } else {
          setError(String(error))
        }
      },
    })

  // Handle user logout
  const { mutate: mutateLogout, isPending: isLogoutPending } = useMutation({
    mutationFn: () => signOut(firebaseAuth),
    onSuccess: () => {
      setError(null)
      invalidateUser()
    },
    onError: (error: unknown) => {
      if (error instanceof FirebaseError || error instanceof Error) {
        setError(error.message)
      } else {
        setError(String(error))
      }
    },
  })

  return {
    user,
    isLoading:
      isUserLoading ||
      isRegisterPending ||
      isLoginPending ||
      isGoogleLoginPending ||
      isLogoutPending,
    error,
    register: (email, password) => mutateRegister({ email, password }),
    loginWithGoogle: () => mutateGoogleLogin(),
    logout: () => mutateLogout(),
  }
}

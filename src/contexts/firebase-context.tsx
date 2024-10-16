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
import { useRouter } from 'next/navigation'
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react'

import { firebaseAuth } from '@/configs'
import { firebaseAuthError } from '@/data'
import { useAuthUser, useQueryActions } from '@/hooks'
import { TRegisterRequest } from '@/types'

type TFirebaseContextValue = {
  user?: User | null
  isLoading: boolean
  isRegisterPending: boolean
  isGoogleLoginPending: boolean
  isLogoutPending: boolean
  error?: string
  setError: Dispatch<SetStateAction<string | undefined>>
  register: (data: TRegisterRequest) => void
  loginWithGoogle: () => void
  logout: () => void
}

const FirebaseContext = createContext<TFirebaseContextValue | undefined>(
  undefined
)

const FirebaseProvider = (props: PropsWithChildren) => {
  const { children } = props
  const { data: user, isLoading: isUserLoading } = useAuthUser()
  const [error, setError] = useState<string | undefined>()
  const provider = new GoogleAuthProvider()
  const { invalidateQueries: invalidateUser } = useQueryActions(['auth-user'])
  const { push } = useRouter()

  // Handle email/password registration
  const { mutate: mutateRegister, isPending: isRegisterPending } = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      createUserWithEmailAndPassword(firebaseAuth, data.email, data.password),
    onMutate: () => {
      setError(undefined)
    },
    onSuccess: () => {
      push('/')
      invalidateUser()
    },
    onError: (
      error: unknown,
      variables: { email: string; password: string }
    ) => {
      if (error instanceof FirebaseError) {
        const action = firebaseAuthError.find(
          (item) => item.code === error.code
        )?.action
        if (action === 'signin') {
          mutateLogin(variables)
        } else {
          const message =
            firebaseAuthError.find((item) => item.code === error.code)
              ?.message || error.message
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
    onMutate: () => {
      setError(undefined)
    },
    onSuccess: () => {
      push('/')
      invalidateUser()
    },
    onError: (error: unknown) => {
      if (error instanceof FirebaseError) {
        const message =
          firebaseAuthError.find((item) => item.code === error.code)?.message ||
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
      onMutate: () => {
        setError(undefined)
      },
      onSuccess: () => {
        push('/')
        invalidateUser()
      },
      onError: (error: unknown) => {
        if (error instanceof FirebaseError) {
          const message =
            firebaseAuthError.find((item) => item.code === error.code)
              ?.message || error.message
          setError(message)
        } else {
          setError(String(error))
        }
      },
    })

  // Handle user logout
  const { mutate: mutateLogout, isPending: isLogoutPending } = useMutation({
    mutationFn: () => signOut(firebaseAuth),
    onMutate: () => {
      push('/')
      setError(undefined)
    },
    onSuccess: () => {
      invalidateUser()
    },
    onError: (error: unknown) => {
      if (error instanceof FirebaseError) {
        const message =
          firebaseAuthError.find((item) => item.code === error.code)?.message ||
          error.message
        setError(message)
      } else {
        setError(String(error))
      }
    },
  })
  const value = {
    user,
    isLoading: isUserLoading || isLogoutPending,
    isRegisterPending: isRegisterPending || isLoginPending,
    isGoogleLoginPending,
    isLogoutPending,
    error,
    setError,
    register: mutateRegister,
    loginWithGoogle: () => mutateGoogleLogin(),
    logout: () => mutateLogout(),
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
}

const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
}

export { FirebaseProvider, useFirebase }

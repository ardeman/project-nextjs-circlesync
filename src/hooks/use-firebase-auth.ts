import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth'
import { useEffect, useState } from 'react'

import { firebaseAuth } from '@/configs'
import { firebaseAuthError } from '@/data'

type TFirebaseAuthReturn = {
  user: User | null
  isLoading: boolean
  error: string | null
  register: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

export const useFirebaseAuth = (): TFirebaseAuthReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const provider = new GoogleAuthProvider()

  // Handle email/password registration
  const register = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password)
      setError(null)
    } catch (error: unknown) {
      if (error instanceof FirebaseError || error instanceof Error) {
        const code = error instanceof FirebaseError ? error.code : ''
        const action = firebaseAuthError.find(
          (item) => item.code === code
        )?.action

        if (action === 'signin') {
          login(email, password)
          return
        }

        const message =
          firebaseAuthError.find((item) => item.code === code)?.message ||
          error.message
        setError(message)
      } else {
        setError(String(error))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle email/password login
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password)
      setError(null)
    } catch (error: unknown) {
      if (error instanceof FirebaseError || error instanceof Error) {
        const code = error instanceof FirebaseError ? error.code : ''
        const message =
          firebaseAuthError.find((item) => item.code === code)?.message ||
          error.message
        setError(message)
      } else {
        setError(String(error))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google Sign-In and linking accounts if necessary
  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await signInWithPopup(firebaseAuth, provider)
      setError(null)
    } catch (error: unknown) {
      if (error instanceof FirebaseError || error instanceof Error) {
        const code = error instanceof FirebaseError ? error.code : ''
        const message =
          firebaseAuthError.find((item) => item.code === code)?.message ||
          error.message
        setError(message)
      } else {
        setError(String(error))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle user logout
  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await signOut(firebaseAuth)
      setError(null)
    } catch (error: unknown) {
      if (error instanceof FirebaseError || error instanceof Error) {
        setError(error.message)
      } else {
        setError(String(error))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return {
    user,
    isLoading,
    error,
    register,
    loginWithGoogle,
    logout,
  }
}

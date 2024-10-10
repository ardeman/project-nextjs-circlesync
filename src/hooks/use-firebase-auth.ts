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
  loading: boolean
  error: string | null
  register: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

export const useFirebaseAuth = (): TFirebaseAuthReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const provider = new GoogleAuthProvider()

  // Handle email/password registration
  const register = async (email: string, password: string): Promise<void> => {
    setLoading(true)
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
      setLoading(false)
    }
  }

  // Handle email/password login
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true)
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
      setLoading(false)
    }
  }

  // Handle Google Sign-In and linking accounts if necessary
  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true)
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
      setLoading(false)
    }
  }

  // Handle user logout
  const logout = async (): Promise<void> => {
    setLoading(true)
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
      setLoading(false)
    }
  }

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return {
    user,
    loading,
    error,
    register,
    loginWithGoogle,
    logout,
  }
}

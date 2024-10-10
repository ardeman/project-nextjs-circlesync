import { Auth } from 'firebase/auth'
import { Firestore } from 'firebase/firestore'
import { createContext, PropsWithChildren, useContext } from 'react'

import { firebaseAuth, firebaseDb } from '@/configs'

type FirebaseContextValue = {
  firebaseAuth: Auth
  firebaseDb: Firestore
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
)

const FirebaseProvider = (props: PropsWithChildren) => {
  const { children } = props
  const value = { firebaseAuth, firebaseDb }

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

import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { PropsWithChildren } from 'react'
import {
  AnalyticsProvider,
  AuthProvider,
  FirestoreProvider,
  useFirebaseApp,
} from 'reactfire'

export const FirebaseProvider = (props: PropsWithChildren) => {
  const { children } = props

  const firestoreInstance = getFirestore(useFirebaseApp())
  const authInstance = getAuth(useFirebaseApp())
  const analyticsInstance = getAnalytics(useFirebaseApp())

  return (
    <AnalyticsProvider sdk={analyticsInstance}>
      <AuthProvider sdk={authInstance}>
        <FirestoreProvider sdk={firestoreInstance}>
          {children}
        </FirestoreProvider>
      </AuthProvider>
    </AnalyticsProvider>
  )
}

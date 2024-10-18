import { Analytics, getAnalytics, isSupported } from 'firebase/analytics'
import { FirebaseApp, initializeApp } from 'firebase/app'
import { Auth, getAuth } from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env
    .NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID as string,
}

// Initialize Firebase app and services
let firebaseApp: FirebaseApp | null = null
let firebaseAnalytics: Analytics | null = null
let firebaseAuth: Auth | null = null
let firebaseDb: Firestore | null = null

// Ensure that Firebase is only initialized on the client side
if (typeof window !== 'undefined') {
  try {
    firebaseApp = initializeApp(firebaseConfig)
    firebaseAuth = getAuth(firebaseApp)
    firebaseDb = getFirestore(firebaseApp)

    // Async function to initialize Analytics if supported
    const initializeAnalytics = async () => {
      try {
        const supported = await isSupported()
        if (supported) {
          firebaseAnalytics = getAnalytics(firebaseApp!)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error initializing Firebase Analytics:', error)
      }
    }

    initializeAnalytics() // Call the async function
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error initializing Firebase app:', error)
  }
}

export { firebaseAuth, firebaseDb, firebaseAnalytics }

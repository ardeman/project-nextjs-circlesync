import { doc, getDoc } from 'firebase/firestore'

import { firebaseAuth, firebaseDb } from '@/configs' // Assuming your Firestore is configured here

// Function to fetch user data from Firestore
export const fetchUserData = async () => {
  if (!firebaseAuth) {
    throw new Error('Firebase Auth is not initialized.')
  }
  if (!firebaseDb) {
    throw new Error('Firebase Firestore is not initialized.')
  }
  const user = firebaseAuth.currentUser
  if (!user) {
    throw new Error('No authenticated user found.')
  }

  const userRef = doc(firebaseDb, 'users', user.uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    throw new Error('User data not found in Firestore.')
  }

  return userSnap.data()
}

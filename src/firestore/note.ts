import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'

import { firebaseAuth, firebaseDb } from '@/configs'
import {
  TCreateNoteRequest,
  TNoteResponse,
  TPinNoteRequest,
  TUpdateNoteRequest,
} from '@/types'

export const fetchNotes = async () => {
  if (!firebaseDb) {
    throw new Error('Firebase DB is not initialized')
  }
  if (!firebaseAuth?.currentUser) {
    throw new Error('No user is currently signed in.')
  }

  const notesQuery = query(
    collection(firebaseDb, 'notes'),
    where('owner', '==', firebaseAuth.currentUser.uid)
    // where('sharedWith', 'array-contains', firebaseAuth?.currentUser.uid)
  )
  const notesSnapshot = await getDocs(notesQuery)
  // Map over the snapshot documents, including both data and ID
  return notesSnapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      ...data,
      id: doc.id, // Get document ID
    } as TNoteResponse
  })
}

export const fetchNote = async (noteId: string) => {
  if (!firebaseDb) {
    throw new Error('Firebase Firestore is not initialized.')
  }
  if (!firebaseAuth?.currentUser) {
    throw new Error('No user is currently signed in.')
  }
  const noteRef = doc(firebaseDb, 'notes', noteId)
  const noteSnap = await getDoc(noteRef)
  if (!noteSnap.exists()) {
    throw new Error('Note not found.')
  }
  const data = noteSnap.data()
  return {
    ...data,
    id: noteSnap.id,
  } as TNoteResponse
}

export const createNote = async (noteData: TCreateNoteRequest) => {
  if (!firebaseDb) {
    throw new Error('Firebase Firestore is not initialized.')
  }
  if (!firebaseAuth?.currentUser) {
    throw new Error('No user is currently signed in.')
  }
  const noteRef = collection(firebaseDb, 'notes')
  return await addDoc(noteRef, {
    ...noteData,
    owner: firebaseAuth.currentUser.uid,
    createdAt: new Date(),
  })
}

export const updateNote = async (noteData: TUpdateNoteRequest) => {
  const { id, ...rest } = noteData
  if (!firebaseDb) {
    throw new Error('Firebase Firestore is not initialized.')
  }
  if (!firebaseAuth?.currentUser) {
    throw new Error('No user is currently signed in.')
  }
  const noteRef = doc(firebaseDb, 'notes', id)
  return await updateDoc(noteRef, {
    ...rest,
    updatedAt: new Date(),
  })
}

export const pinNote = async (noteData: TPinNoteRequest) => {
  const { id, ...rest } = noteData
  if (!firebaseDb) {
    throw new Error('Firebase Firestore is not initialized.')
  }
  if (!firebaseAuth?.currentUser) {
    throw new Error('No user is currently signed in.')
  }
  const noteRef = doc(firebaseDb, 'notes', id)
  return await updateDoc(noteRef, {
    ...rest,
    updatedAt: new Date(),
  })
}

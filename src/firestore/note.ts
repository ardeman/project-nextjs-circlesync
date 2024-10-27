import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore'

import { firebaseAuth, firebaseDb } from '@/configs'
import { TCreateNoteRequest, TNoteResponse, TUpdateNoteRequest } from '@/types'

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
      id: doc.id, // Get document ID
      title: data.title,
      content: data.content,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
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
    id: noteSnap.id,
    title: data.title,
    content: data.content,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
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
    updatedAt: new Date(),
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
  return await setDoc(noteRef, {
    ...rest,
    owner: firebaseAuth.currentUser.uid,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

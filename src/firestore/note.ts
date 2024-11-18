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

import { auth, firestore } from '@/configs'
import {
  TCreateNoteRequest,
  TNoteResponse,
  TPinNoteRequest,
  TUpdateNoteRequest,
} from '@/types'

export const fetchNotes = async () => {
  if (!firestore) {
    throw new Error('Firebase DB is not initialized')
  }
  if (!auth?.currentUser) {
    throw new Error('No user is currently signed in.')
  }

  const notesQuery = query(
    collection(firestore, 'notes'),
    where('owner', '==', auth.currentUser.uid)
    // where('sharedWith', 'array-contains', auth?.currentUser.uid)
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
  if (!firestore) {
    throw new Error('Firebase Firestore is not initialized.')
  }
  if (!auth?.currentUser) {
    throw new Error('No user is currently signed in.')
  }
  const noteRef = doc(firestore, 'notes', noteId)
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
  if (!firestore) {
    throw new Error('Firebase Firestore is not initialized.')
  }
  if (!auth?.currentUser) {
    throw new Error('No user is currently signed in.')
  }
  const noteRef = collection(firestore, 'notes')
  return await addDoc(noteRef, {
    ...noteData,
    owner: auth.currentUser.uid,
    createdAt: new Date(),
  })
}

export const updateNote = async (noteData: TUpdateNoteRequest) => {
  const { id, ...rest } = noteData
  if (!firestore) {
    throw new Error('Firebase Firestore is not initialized.')
  }
  if (!auth?.currentUser) {
    throw new Error('No user is currently signed in.')
  }
  const noteRef = doc(firestore, 'notes', id)
  return await updateDoc(noteRef, {
    ...rest,
    updatedAt: new Date(),
  })
}

export const pinNote = async (noteData: TPinNoteRequest) => {
  const { id, ...rest } = noteData
  if (!firestore) {
    throw new Error('Firebase Firestore is not initialized.')
  }
  if (!auth?.currentUser) {
    throw new Error('No user is currently signed in.')
  }
  const noteRef = doc(firestore, 'notes', id)
  return await updateDoc(noteRef, {
    ...rest,
    updatedAt: new Date(),
  })
}

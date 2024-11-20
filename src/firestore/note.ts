import {
  addDoc,
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  where,
  or,
  deleteDoc,
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
    or(
      where('owner', '==', auth.currentUser.uid),
      where('collaborators', 'array-contains', auth.currentUser.uid),
      where('spectators', 'array-contains', auth.currentUser.uid)
    )
  )
  const snap = await getDocs(notesQuery)

  // Map over the snapshot documents, including both data and ID
  return snap.docs.map((doc) => {
    const data = doc.data()
    return {
      ...data,
      id: doc.id, // Get document ID
    } as TNoteResponse
  })
}

export const createNote = async (data: TCreateNoteRequest) => {
  if (!firestore) {
    throw new Error('Firebase Firestore is not initialized.')
  }
  if (!auth?.currentUser) {
    throw new Error('No user is currently signed in.')
  }
  const ref = collection(firestore, 'notes')
  return await addDoc(ref, {
    ...data,
    owner: auth.currentUser.uid,
    createdAt: new Date(),
  })
}

export const updateNote = async (data: TUpdateNoteRequest) => {
  const { id, ...rest } = data
  if (!firestore) {
    throw new Error('Firebase Firestore is not initialized.')
  }
  if (!auth?.currentUser) {
    throw new Error('No user is currently signed in.')
  }
  const ref = doc(firestore, 'notes', id)
  return await updateDoc(ref, {
    ...rest,
    updatedAt: new Date(),
  })
}

export const pinNote = async (data: TPinNoteRequest) => {
  const { id, ...rest } = data
  if (!firestore) {
    throw new Error('Firebase Firestore is not initialized.')
  }
  if (!auth?.currentUser) {
    throw new Error('No user is currently signed in.')
  }
  const ref = doc(firestore, 'notes', id)
  return await updateDoc(ref, {
    ...rest,
    updatedAt: new Date(),
  })
}

export const deleteNote = async (note: TNoteResponse) => {
  const { id } = note
  if (!firestore) {
    throw new Error('Firebase Firestore is not initialized.')
  }
  if (!auth?.currentUser) {
    throw new Error('No user is currently signed in.')
  }
  const ref = doc(firestore, 'notes', id)
  await deleteDoc(ref)
  return note
}

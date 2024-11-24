'use client'

import Masonry from 'masonry-layout'
import { useEffect, useRef, useState } from 'react'

import { Button, Modal } from '@/components/base'
import {
  toast,
  useDeleteNote,
  useGetNotes,
  usePinNote,
  useUnlinkNote,
} from '@/hooks'
import { TNoteResponse } from '@/types'

import { Card } from './card'
import { Form } from './form'
import { TNoteConfirmation, THandleModifyNote, THandlePinNote } from './type'

export const NotesPage = () => {
  const [openForm, setOpenForm] = useState(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [selectedNote, setSelectedNote] = useState<TNoteResponse>()
  const [selectedConfirmation, setSelectedConfirmation] =
    useState<TNoteConfirmation>()
  const { data: notesData } = useGetNotes()
  const { mutate: mutatePinNote } = usePinNote()
  const { mutate: mutateDeleteNote } = useDeleteNote()
  const { mutate: mutateUnlinkNote } = useUnlinkNote()
  const masonryRefPinned = useRef(null)
  const masonryRefRegular = useRef(null)
  const formRef = useRef<{ submit: () => void } | null>(null)

  const handleCreateNote = () => {
    setOpenForm(true)
    setSelectedNote(undefined)
  }

  const handleEditNote = (note: TNoteResponse) => {
    setOpenForm(true)
    setSelectedNote(note)
  }

  const handleModalClose = () => {
    setOpenForm(false)
    // Only submit the form if no `selectedNote` is present
    if (!selectedNote) {
      formRef.current?.submit() // Trigger the form submission through a ref
    }
  }

  const handleConfirm = () => {
    setOpenConfirmation(false)
    setOpenForm(false)
    if (!selectedConfirmation?.detail || !selectedConfirmation.kind) return
    if (selectedConfirmation?.kind === 'Delete') {
      mutateDeleteNote(selectedConfirmation.detail)
    }
    if (selectedConfirmation?.kind === 'Unlink') {
      mutateUnlinkNote(selectedConfirmation.detail)
    }
  }

  const handleDeleteNote = (props: THandleModifyNote) => {
    const { event, note } = props
    event.stopPropagation() // Prevents the Card's onClick from triggering
    setOpenConfirmation(true)
    setSelectedConfirmation({
      kind: 'Delete',
      detail: note,
    })
  }

  const handleUnlinkNote = (props: THandleModifyNote) => {
    const { event, note } = props
    event.stopPropagation() // Prevents the Card's onClick from triggering
    setOpenConfirmation(true)
    setSelectedConfirmation({
      kind: 'Unlink',
      detail: note,
    })
  }

  const handlePinNote = (props: THandlePinNote) => {
    const { event, note, isPinned } = props
    event.stopPropagation() // Prevents the Card's onClick from triggering
    mutatePinNote({ note, isPinned })
  }

  const handleShareNote = (props: THandleModifyNote) => {
    const { event, note } = props
    event.stopPropagation() // Prevents the Card's onClick from triggering

    setOpenForm(false)
    toast({
      title: 'Feature in progress',
      description: (
        <p>
          This feature is currently in progress.
          <pre>{JSON.stringify(note, null, 2)}</pre>
        </p>
      ),
    })
  }

  useEffect(() => {
    if (masonryRefPinned?.current) {
      new Masonry(masonryRefPinned.current, {
        itemSelector: '.masonry-item-pinned',
        gutter: 16,
        horizontalOrder: true,
        fitWidth: true,
      })
    }
    if (masonryRefRegular?.current) {
      new Masonry(masonryRefRegular.current, {
        itemSelector: '.masonry-item-regular',
        gutter: 16,
        horizontalOrder: true,
        fitWidth: true,
      })
    }
  }, [notesData])

  return (
    <main className="bg-muted/40 flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Button
        containerClassName="flex justify-center md:static md:transform-none fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        className="w-full max-w-md"
        onClick={handleCreateNote}
      >
        Add Note
      </Button>
      <div className="flex justify-center">
        <div
          ref={masonryRefPinned}
          className="masonry-grid mx-auto max-w-screen-2xl" // Sets max width to control masonry width
        >
          {notesData
            ?.filter((note) => note.isPinned)
            ?.sort(
              (a, b) =>
                (b.updatedAt?.seconds || b.createdAt?.seconds) -
                (a.updatedAt?.seconds || a.createdAt?.seconds)
            )
            .map((note) => (
              <Card
                note={note}
                handleDeleteNote={handleDeleteNote}
                handleEditNote={handleEditNote}
                handlePinNote={handlePinNote}
                handleUnlinkNote={handleUnlinkNote}
                handleShareNote={handleShareNote}
                key={note.id}
              />
            ))}
        </div>
      </div>
      <div className="flex justify-center">
        <div
          ref={masonryRefRegular}
          className="masonry-grid mx-auto max-w-screen-2xl" // Sets max width to control masonry width
        >
          {notesData
            ?.filter((note) => !note.isPinned)
            ?.sort(
              (a, b) =>
                (b.updatedAt?.seconds || b.createdAt?.seconds) -
                (a.updatedAt?.seconds || a.createdAt?.seconds)
            )
            .map((note) => (
              <Card
                note={note}
                handleDeleteNote={handleDeleteNote}
                handleEditNote={handleEditNote}
                handlePinNote={handlePinNote}
                handleUnlinkNote={handleUnlinkNote}
                handleShareNote={handleShareNote}
                key={note.id}
              />
            ))}
        </div>
      </div>

      <Modal
        open={openForm}
        setOpen={setOpenForm}
        onClose={handleModalClose}
      >
        <Form
          ref={formRef}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          notes={notesData}
          handleDeleteNote={handleDeleteNote}
          handlePinNote={handlePinNote}
          handleUnlinkNote={handleUnlinkNote}
          handleShareNote={handleShareNote}
        />
      </Modal>

      <Modal
        open={openConfirmation}
        setOpen={setOpenConfirmation}
        handleConfirm={handleConfirm}
        variant="destructive"
      >
        <strong>{selectedConfirmation?.kind} this note?</strong>
        {selectedConfirmation?.detail.title && (
          <p className="text-xl">{selectedConfirmation.detail.title}</p>
        )}
        {selectedConfirmation?.detail.content && (
          <p>{selectedConfirmation.detail.content}</p>
        )}
      </Modal>
    </main>
  )
}

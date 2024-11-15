'use client'

import { Pin, Trash } from 'lucide-react'
import Masonry from 'masonry-layout'
import { useEffect, useRef, useState, MouseEvent } from 'react'

import { Button, Modal } from '@/components/base'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { useGetNotes, usePinNote } from '@/hooks'

import { Form } from './form'

export const NotesPage = () => {
  const [openForm, setOpenForm] = useState(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [selectedNote, setSelectedNote] = useState<string>()
  const [selectedConfirmation, setSelectedConfirmation] = useState({
    kind: '',
    id: '',
    description: '',
  })
  const { data: notesData } = useGetNotes()
  const { mutate: mutatePinNote } = usePinNote()
  const masonryRefPinned = useRef(null)
  const masonryRefRegular = useRef(null)
  const formRef = useRef<{ submit: () => void } | null>(null)

  const handleCreateNote = () => {
    setOpenForm(true)
    setSelectedNote(undefined)
  }

  const handleEditNote = (id: string) => {
    setOpenForm(true)
    setSelectedNote(id)
  }

  const handleModalClose = () => {
    setOpenForm(false)
    // Only submit the form if no `selectedNote` is present
    if (!selectedNote) {
      formRef.current?.submit() // Trigger the form submission through a ref
    }
  }

  const handleConfirmDelete = () => {
    setOpenConfirmation(false)
  }

  const handleDeleteNote = ({
    event,
    id,
    title,
    content,
  }: {
    event: MouseEvent<SVGSVGElement>
    id: string
    title?: string
    content?: string
  }) => {
    event.stopPropagation() // Prevents the Card's onClick from triggering
    setOpenConfirmation(true)
    setSelectedConfirmation({
      id,
      kind: 'Delete',
      description: title || content || '',
    })
  }

  const handlePinNote = ({
    event,
    id,
    isPinned,
  }: {
    event: MouseEvent<SVGSVGElement>
    id: string
    isPinned: boolean
  }) => {
    event.stopPropagation() // Prevents the Card's onClick from triggering
    const data = {
      isPinned,
    }
    mutatePinNote({ id: id, ...data })
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
                key={note.id}
                className="masonry-item-pinned relative mb-4 w-full sm:max-w-xs"
                onClick={() => handleEditNote(note.id)}
              >
                <div className="absolute right-1 top-1 flex gap-2">
                  <Trash
                    className="ring-offset-background focus:ring-ring bg-accent text-muted-foreground h-4 w-16 cursor-pointer rounded-full opacity-100 transition-opacity hover:text-red-500 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none sm:w-4 sm:opacity-30"
                    onClick={(event) =>
                      handleDeleteNote({
                        event,
                        id: note.id,
                        title: note.title,
                        content: note.content,
                      })
                    }
                  />
                  <Pin
                    className="ring-offset-background focus:ring-ring bg-accent text-muted-foreground h-4 w-16 cursor-pointer rounded-full text-yellow-500 opacity-30 transition-opacity hover:opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none sm:w-4 sm:opacity-100"
                    onClick={(event) =>
                      handlePinNote({ event, id: note.id, isPinned: false })
                    }
                  />
                </div>
                <CardHeader>
                  <CardDescription className="text-xs">
                    {note.updatedAt?.seconds ? 'Edited' : 'Created'}{' '}
                    {new Date(
                      (note.updatedAt?.seconds || note.createdAt.seconds) * 1000
                    ).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </CardDescription>
                  {note.title && <CardTitle>{note.title}</CardTitle>}
                </CardHeader>
                {note.content && (
                  <CardContent>
                    <p className="whitespace-pre-wrap">{note.content}</p>
                  </CardContent>
                )}
              </Card>
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
                key={note.id}
                className="masonry-item-regular relative mb-4 w-full sm:max-w-xs"
                onClick={() => handleEditNote(note.id)}
              >
                <div className="absolute right-1 top-1 flex gap-2">
                  <Trash
                    className="ring-offset-background focus:ring-ring bg-accent text-muted-foreground h-4 w-16 cursor-pointer rounded-full opacity-100 transition-opacity hover:text-red-500 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none sm:w-4 sm:opacity-30"
                    onClick={(event) =>
                      handleDeleteNote({
                        event,
                        id: note.id,
                        title: note.title,
                        content: note.content,
                      })
                    }
                  />
                  <Pin
                    className="ring-offset-background focus:ring-ring bg-accent text-muted-foreground h-4 w-16 cursor-pointer rounded-full opacity-100 transition-opacity hover:text-yellow-500 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none sm:w-4 sm:opacity-30"
                    onClick={(event) =>
                      handlePinNote({ event, id: note.id, isPinned: true })
                    }
                  />
                </div>
                <CardHeader>
                  <CardDescription className="text-xs">
                    {note.updatedAt?.seconds ? 'Edited' : 'Created'}{' '}
                    {new Date(
                      (note.updatedAt?.seconds || note.createdAt.seconds) * 1000
                    ).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </CardDescription>
                  {note.title && <CardTitle>{note.title}</CardTitle>}
                </CardHeader>
                {note.content && (
                  <CardContent>
                    <p className="whitespace-pre-wrap">{note.content}</p>
                  </CardContent>
                )}
              </Card>
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
        />
      </Modal>

      <Modal
        open={openConfirmation}
        setOpen={setOpenConfirmation}
        handleConfirm={handleConfirmDelete}
      >
        <strong>{selectedConfirmation.kind} this note?</strong>
        {selectedConfirmation.description}
      </Modal>
    </main>
  )
}

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
import { useGetNotes } from '@/hooks'

import { Form } from './form'

export const NotesPage = () => {
  const [openForm, setOpenForm] = useState(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [selectedNote, setSelectedNote] = useState<string>()
  const [selectedConfirmation, setSelectedConfirmation] = useState({
    kind: '',
    id: '',
  })
  const { data: notesData } = useGetNotes()
  const masonryRef = useRef(null)
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

  const handleDeleteNote = (event: MouseEvent<SVGSVGElement>, id: string) => {
    event.stopPropagation() // Prevents the Card's onClick from triggering
    setOpenConfirmation(true)
    setSelectedConfirmation({ id, kind: 'delete' })
  }

  const handlePinNote = (event: MouseEvent<SVGSVGElement>, id: string) => {
    event.stopPropagation() // Prevents the Card's onClick from triggering
    setOpenConfirmation(true)
    setSelectedConfirmation({ id, kind: 'pin' })
  }

  useEffect(() => {
    if (masonryRef.current) {
      new Masonry(masonryRef.current, {
        itemSelector: '.masonry-item',
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
          ref={masonryRef}
          className="masonry-grid mx-auto max-w-screen-2xl" // Sets max width to control masonry width
        >
          {notesData
            ?.sort((a, b) => b.updatedAt.seconds - a.updatedAt.seconds)
            .map((note) => (
              <Card
                key={note.id}
                className="masonry-item mb-4 w-full sm:max-w-xs"
                onClick={() => handleEditNote(note.id)}
              >
                <div className="absolute right-1 top-1 flex gap-2">
                  <Pin
                    className="ring-offset-background focus:ring-ring bg-accent text-muted-foreground h-4 w-16 cursor-pointer rounded-full opacity-100 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none sm:w-4 sm:opacity-30"
                    onClick={(e) => handlePinNote(e, note.id)}
                  />
                  <Trash
                    className="ring-offset-background focus:ring-ring bg-accent text-muted-foreground h-4 w-16 cursor-pointer rounded-full opacity-100 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none sm:w-4 sm:opacity-30"
                    onClick={(e) => handleDeleteNote(e, note.id)}
                  />
                </div>
                <CardHeader>
                  <CardDescription>
                    Edited{' '}
                    {new Date(note.updatedAt.seconds * 1000).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </CardDescription>
                  {note.title && <CardTitle>{note.title}</CardTitle>}
                </CardHeader>
                {note.content && (
                  <CardContent>
                    <p>{note.content}</p>
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
      >
        Are you sure you want to {selectedConfirmation.kind} this note:{' '}
        {selectedConfirmation.id}?
      </Modal>
    </main>
  )
}

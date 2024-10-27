'use client'

import { useState } from 'react'

import { Button, Modal } from '@/components/base'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { useGetNotes } from '@/hooks'

import { Form } from './form'

export const NotesPage = () => {
  const [open, setOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<string>()
  const { data: notesData } = useGetNotes()

  const handleCreateNote = () => {
    setOpen(true)
    setSelectedNote(undefined)
  }

  const handleEditNote = (id: string) => {
    setOpen(true)
    setSelectedNote(id)
  }

  return (
    <main className="bg-muted/40 flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Button
        containerClassName="flex justify-center md:static md:transform-none fixed bottom-4 left-1/2 -translate-x-1/2"
        className="w-full max-w-md"
        onClick={handleCreateNote}
      >
        Add Note
      </Button>
      <div className="columns-1 space-y-4 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6">
        {notesData
          ?.sort((a, b) => b.updatedAt.seconds - a.updatedAt.seconds)
          .map((note) => (
            <Card
              key={note.id}
              className="break-inside-avoid"
              onClick={() => handleEditNote(note.id)}
            >
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{note.content}</p>
              </CardContent>
              <CardFooter>
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
              </CardFooter>
            </Card>
          ))}
      </div>

      <Modal
        open={open}
        setOpen={setOpen}
      >
        <Form
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
        />
      </Modal>
    </main>
  )
}

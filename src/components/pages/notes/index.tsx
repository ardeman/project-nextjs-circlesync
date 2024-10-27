'use client'

import Masonry from 'masonry-layout'
import { useEffect, useRef, useState } from 'react'

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
  const masonryRef = useRef(null)

  const handleCreateNote = () => {
    setOpen(true)
    setSelectedNote(undefined)
  }

  const handleEditNote = (id: string) => {
    setOpen(true)
    setSelectedNote(id)
  }

  useEffect(() => {
    if (masonryRef.current) {
      new Masonry(masonryRef.current, {
        itemSelector: '.masonry-item',
        columnWidth: '.masonry-item',
        gutter: 16,
        horizontalOrder: true,
      })
    }
  }, [notesData])

  return (
    <main className="bg-muted/40 flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Button
        containerClassName="flex justify-center md:static md:transform-none fixed bottom-4 left-1/2 -translate-x-1/2"
        className="w-full max-w-md"
        onClick={handleCreateNote}
      >
        Add Note
      </Button>
      <div
        ref={masonryRef}
        className="masonry-grid"
      >
        {notesData
          ?.sort((a, b) => b.updatedAt.seconds - a.updatedAt.seconds)
          .map((note) => (
            <Card
              key={note.id}
              className="masonry-item mb-4"
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

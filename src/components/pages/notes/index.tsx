'use client'

import { useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'

import {
  Button as UIButton,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui'

const getRandomContent = () => {
  const words = [
    'lorem',
    'ipsum',
    'dolor',
    'sit',
    'amet',
    'consectetur',
    'adipiscing',
    'elit',
    'sed',
    'do',
    'eiusmod',
    'tempor',
    'incididunt',
    'ut',
    'labore',
    'et',
    'dolore',
    'magna',
    'aliqua',
  ]
  const sentenceLength = Math.floor(Math.random() * 20) + 5 // Random sentence length between 5 and 25 words
  const content = Array.from({ length: sentenceLength })
    .fill('')
    .map(() => words[Math.floor(Math.random() * words.length)])
    .join(' ')
  return content.charAt(0).toUpperCase() + content.slice(1) + '.'
}

export const NotesPage = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [open, setOpen] = useState(false)

  const notes = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    title: `Note ${i + 1}`,
    content: getRandomContent(),
  }))

  return (
    <main className="bg-muted/40 flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="columns-1 space-y-4 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6">
        {notes.map((note) => (
          <Card
            key={note.id}
            className="break-inside-avoid"
            onClick={() => setOpen(true)}
          >
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{note.content}</p>
            </CardContent>
            <CardFooter>
              <CardDescription>Edited Mmm DD, YYYY</CardDescription>
            </CardFooter>
          </Card>
        ))}
      </div>

      {isDesktop ? (
        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            {/* <ProfileForm /> */}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={open}
          onOpenChange={setOpen}
        >
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Edit profile</DrawerTitle>
              <DrawerDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DrawerDescription>
            </DrawerHeader>
            {/* <ProfileForm className="px-4" /> */}
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <UIButton variant="outline">Cancel</UIButton>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </main>
  )
}

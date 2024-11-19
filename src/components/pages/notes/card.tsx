import { Pin, Trash } from 'lucide-react'

import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { cn } from '@/utils'

import { TCardProps } from './type'

export const Card = (props: TCardProps) => {
  const { note, handleEditNote, handleDeleteNote, handlePinNote, isPinned } =
    props
  return (
    <UICard
      className={cn(
        isPinned ? 'masonry-item-pinned' : 'masonry-item-regular',
        'group relative mb-4 w-full sm:max-w-xs'
      )}
      onClick={() => handleEditNote(note)}
    >
      <div className="absolute right-1 top-1 flex justify-between gap-2 sm:-left-1 sm:-right-1 sm:-top-1">
        <Trash
          className="ring-offset-background focus:ring-ring bg-accent text-muted-foreground h-4 w-16 cursor-pointer rounded-full opacity-100 transition-all duration-300 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none group-hover:opacity-100 sm:w-4 sm:opacity-0"
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
          className={cn(
            isPinned
              ? 'hover:text-muted-foreground rotate-45 text-yellow-500 hover:rotate-0 sm:opacity-100'
              : 'text-muted-foreground hover:rotate-45 hover:text-yellow-500 sm:opacity-0',
            'ring-offset-background focus:ring-ring bg-accent h-4 w-16 cursor-pointer rounded-full opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none group-hover:opacity-100 sm:w-4'
          )}
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
    </UICard>
  )
}

import { Pin, Trash } from 'lucide-react'

import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { useUserData } from '@/hooks'
import { cn } from '@/utils'

import { TCardProps } from './type'

export const Card = (props: TCardProps) => {
  const { note, handleEditNote, handleDeleteNote, handlePinNote, isPinned } =
    props
  const { data: userData } = useUserData()
  const isEditable =
    note.owner === userData?.uid || note.collaborators?.includes(userData?.uid)
  return (
    <UICard
      className={cn(
        isEditable ? 'group' : '',
        isPinned ? 'masonry-item-pinned' : 'masonry-item-regular',
        'relative mb-4 w-full sm:max-w-xs'
      )}
      onClick={() => isEditable && handleEditNote(note)}
    >
      <div
        className={cn(
          isEditable ? 'flex' : 'hidden',
          'absolute right-1 top-1 justify-between gap-2 sm:-left-1 sm:-right-1 sm:-top-1'
        )}
      >
        <Trash
          className="ring-offset-background focus:ring-ring bg-accent text-muted-foreground h-4 w-16 cursor-pointer rounded-full opacity-100 transition-all duration-300 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none group-hover:opacity-100 sm:w-4 sm:opacity-0"
          onClick={(event) =>
            handleDeleteNote({
              event,
              note,
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
            handlePinNote({ event, note, isPinned: !isPinned })
          }
        />
      </div>
      <CardHeader>
        <CardDescription className="flex justify-between text-xs">
          <span>
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
          </span>
          <span>{!isEditable && 'Read-only'}</span>
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

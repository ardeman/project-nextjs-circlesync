import { Eye, Forward, Pin, Trash } from 'lucide-react'

import { Button } from '@/components/base'
import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { useUserData } from '@/hooks'
import { cn, formatDate, getDateLabel } from '@/utils'

import { TCardProps } from './type'

export const Card = (props: TCardProps) => {
  const {
    note,
    handleEditNote,
    handleDeleteNote,
    handlePinNote,
    handleUnlinkNote,
    isPinned,
  } = props
  const { data: userData } = useUserData()
  const isCollaborator = note.collaborators?.includes(userData?.uid)
  const isOwner = note.owner === userData?.uid
  const isEditable = isOwner || isCollaborator
  const dateLabel = getDateLabel(note.updatedAt?.seconds)
  const date = formatDate(note.updatedAt?.seconds || note.createdAt.seconds)
  const buttonClassName =
    'ring-offset-background focus:ring-ring bg-accent text-muted-foreground h-5 w-full rounded-full p-0 opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none group-hover/card:opacity-100 sm:opacity-0'
  return (
    <UICard
      className={cn(
        isPinned ? 'masonry-item-pinned' : 'masonry-item-regular',
        'group/card relative mb-4 w-full sm:max-w-xs'
      )}
      onClick={() => isEditable && handleEditNote(note)}
    >
      <div
        className={cn(
          'absolute bottom-1 left-1 right-1 flex justify-between gap-1'
        )}
      >
        {isOwner ? (
          <Button
            variant="outline"
            onClick={(event) =>
              handleDeleteNote({
                event,
                note,
              })
            }
            containerClassName="flex-1 flex items-center"
            className={cn(buttonClassName, 'hover:text-red-500')}
          >
            <Trash className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={(event) =>
              handleUnlinkNote({
                event,
                note,
              })
            }
            containerClassName="flex-1 flex items-center"
            className={cn(buttonClassName, 'hover:text-red-500')}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {isEditable && (
          <Button
            variant="outline"
            onClick={(event) => {
              event.stopPropagation()
            }}
            containerClassName="flex-1 flex items-center"
            className={buttonClassName}
          >
            <Forward className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="outline"
          onClick={(event) =>
            handlePinNote({ event, note, isPinned: !isPinned })
          }
          containerClassName="flex-1 flex items-center"
          className={cn(
            buttonClassName,
            isPinned
              ? 'hover:text-muted-foreground text-yellow-500 sm:opacity-100'
              : 'text-muted-foreground hover:text-yellow-500 sm:opacity-0',
            'group/button'
          )}
        >
          <Pin
            className={cn(
              isPinned
                ? 'rotate-45 group-hover/button:rotate-0'
                : 'group-hover/button:rotate-45',
              'h-4 w-4 transition-all duration-300'
            )}
          />
        </Button>
      </div>
      <CardHeader>
        <CardDescription className="flex justify-between text-xs">
          <span>
            {dateLabel} {date}
          </span>
          <span>{isEditable ? isCollaborator && 'Shared' : 'Read-only'}</span>
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

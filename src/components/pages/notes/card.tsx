import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { useUserData } from '@/hooks'
import { cn, formatDate, getDateLabel } from '@/utils'

import { Action } from './action'
import { TCardProps } from './type'

export const Card = (props: TCardProps) => {
  const {
    note,
    handleEditNote,
    handleDeleteNote,
    handlePinNote,
    handleUnlinkNote,
  } = props
  const { data: userData } = useUserData()
  const isPinned = note.isPinned
  const isCollaborator = note.collaborators?.includes(userData?.uid)
  const isOwner = note.owner === userData?.uid
  const isEditable = isOwner || isCollaborator
  const dateLabel = getDateLabel(note.updatedAt?.seconds)
  const date = formatDate(note.updatedAt?.seconds || note.createdAt.seconds)

  return (
    <UICard
      className={cn(
        isPinned ? 'masonry-item-pinned' : 'masonry-item-regular',
        'group/card relative mb-4 w-full sm:max-w-xs'
      )}
      onClick={() => isEditable && handleEditNote(note)}
    >
      <Action
        className="absolute bottom-1 left-1 right-1"
        note={note}
        isOwner={isOwner}
        isEditable={isEditable}
        isPinned={isPinned}
        handleDeleteNote={handleDeleteNote}
        handlePinNote={handlePinNote}
        handleUnlinkNote={handleUnlinkNote}
      />
      <CardHeader className="pb-4">
        <CardDescription className="flex justify-between text-xs">
          <span>
            {dateLabel} {date}
          </span>
          <span>{isEditable ? isCollaborator && 'Shared' : 'Read-only'}</span>
        </CardDescription>
        {note.title && <CardTitle className="text-xl">{note.title}</CardTitle>}
      </CardHeader>
      {note.content && (
        <CardContent>
          <p className="whitespace-pre-wrap text-sm">{note.content}</p>
        </CardContent>
      )}
    </UICard>
  )
}

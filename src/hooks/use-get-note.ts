import { useQuery } from '@tanstack/react-query'

import { auth } from '@/configs'
import { fetchNote } from '@/firestore'

// Custom hook to fetch current user data
export const useGetNote = (noteId: string) => {
  return useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNote(noteId),
    enabled: !!auth?.currentUser && !!noteId, // Only run the query if the user is authenticated
    retry: false, // Disable retries since there's no user when not logged in
  })
}

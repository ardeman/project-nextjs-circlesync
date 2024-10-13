import { useQuery } from '@tanstack/react-query'
import { onAuthStateChanged, User } from 'firebase/auth'

import { firebaseAuth } from '@/configs'

export const useAuthUser = () => {
  return useQuery<User | null>({
    queryKey: ['auth-user'],
    queryFn: () =>
      new Promise<User | null>((resolve) => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
          resolve(currentUser) // Resolve the current user or null
        })

        // Cleanup the listener when the query is no longer needed
        return () => unsubscribe()
      }),
  })
}

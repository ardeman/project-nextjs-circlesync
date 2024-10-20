import { useQuery } from '@tanstack/react-query'

import { firebaseAuth } from '@/configs'
import { fetchUserData } from '@/firestore'

// Custom hook to fetch current user data
export const useUserData = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: fetchUserData,
    enabled: !!firebaseAuth?.currentUser, // Only run the query if the user is authenticated
    retry: false, // Disable retries since there's no user when not logged in
  })
}

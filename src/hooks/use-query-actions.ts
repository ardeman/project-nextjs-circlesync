import { QueryKey, useQueryClient } from '@tanstack/react-query'

export const useQueryActions = (queryKey: QueryKey) => {
  const queryClient = useQueryClient()

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey })
  }

  const resetQueries = () => {
    queryClient.resetQueries({ queryKey })
  }

  const removeQueries = () => {
    queryClient.removeQueries({ queryKey })
  }

  return {
    invalidateQueries,
    resetQueries,
    removeQueries,
  }
}
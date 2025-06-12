// hooks/useDeleteOffre.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchingDeleteOffre } from '../fetchingData/FetchDeleteOffre';

export const useDeleteOffre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => fetchingDeleteOffre(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['offres']);
    },
    onError: (error) => {
      console.error('Error deleting offre:', error.message || error);
    },
  });
};

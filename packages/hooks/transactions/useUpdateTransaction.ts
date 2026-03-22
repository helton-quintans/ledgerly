import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransaction } from "@ledgerly/services/transactionsService";

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

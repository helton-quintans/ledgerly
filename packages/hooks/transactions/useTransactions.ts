import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@ledgerly/services/transactionsService";

export function useTransactions(params: any) {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => getTransactions(params),
  });
}

import { getTransactions } from "@ledgerly/services/transactionsService";
import { useQuery } from "@tanstack/react-query";

export function useTransactions(params: any) {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => getTransactions(params),
  });
}

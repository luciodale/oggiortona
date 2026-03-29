import { useCallback } from "react";
import { useQueryClient, useIsFetching } from "@tanstack/react-query";

export function useRefresh(queryKeys: Array<ReadonlyArray<string>>) {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  const handleRefresh = useCallback(function handleRefresh() {
    for (const key of queryKeys) {
      queryClient.invalidateQueries({ queryKey: key });
    }
  }, [queryClient, queryKeys]);

  return { isRefreshing: isFetching > 0, handleRefresh };
}

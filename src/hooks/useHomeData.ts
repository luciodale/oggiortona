import { useQuery } from "@tanstack/react-query";
import type { HomePageData } from "../utils/homeData";

export function useHomeData() {
  return useQuery<HomePageData>({
    queryKey: ["home"],
    queryFn: () => fetch("/api/home").then((res) => res.json()),
  });
}

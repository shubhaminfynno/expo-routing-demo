import { fetchPhotos, type RandomUser } from "@/api/restClient";
import { getJson, setJson } from "@/storage/mmkv";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

export function usePhotos() {
  const PAGE_SIZE = 50;
  const CACHE_KEY = "random_users_pages";

  const cached = useMemo(() => {
    return getJson<{ pages: RandomUser[][] }>(CACHE_KEY, null);
  }, []);

  const query = useInfiniteQuery({
    queryKey: ["randomUsers"],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchPhotos(pageParam, PAGE_SIZE);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
    },
    initialData:
      cached && Array.isArray(cached.pages) && cached.pages.length > 0
        ? {
            pageParams: cached.pages.map((_, idx) => idx + 1),
            pages: cached.pages,
          }
        : undefined,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data?.pages) {
      setJson(CACHE_KEY, { pages: query.data.pages });
    }
  }, [query.data?.pages]);

  const flattened = useMemo(
    () => query.data?.pages.flat() ?? [],
    [query.data?.pages]
  );

  return {
    ...query,
    flattened,
  };
}

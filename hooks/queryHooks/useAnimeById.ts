import { graphQLClientAnimes } from "@/api/graphQlClient";
import { GET_ANIME_BY_ID } from "@/graphQl/getAnimes";
import { useQuery } from "@tanstack/react-query";

export function useAnimeById(id: number) {
  return useQuery({
    queryKey: ["anime", id],
    queryFn: async () => {
      const data = await graphQLClientAnimes.request(GET_ANIME_BY_ID, { id });
      return data.Media;
    },
    enabled: !!id,
  });
}


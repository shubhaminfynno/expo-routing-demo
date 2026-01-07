import { graphQLClientAnimes } from "@/api/graphQlClient";
import { GET_ANIMES } from "@/graphQl/getAnimes";
import { useQuery } from "@tanstack/react-query";

export function useAnimes() {
  return useQuery({
    queryKey: ["animes"],
    queryFn: async () => {
      const data = await graphQLClientAnimes.request(GET_ANIMES);
      return data.Page.media;
    },
  });
}

import { graphQLClientGraphqlZero } from "@/api/graphQlClient";
import { GET_GRAPHQL_ZERO_POSTS } from "@/graphQl/graphqlZero";
import { getItemFromStorage } from "@/helper";
import { useQuery } from "@tanstack/react-query";

const STORAGE_KEY = "graphqlZeroCreatedPosts";

export function useGraphqlZeroPosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["graphqlZeroPosts", page, limit],
    queryFn: async () => {
      const data = await graphQLClientGraphqlZero.request(
        GET_GRAPHQL_ZERO_POSTS,
        { page, limit }
      );

      // Get created/updated posts from local storage
      const localPosts = (await getItemFromStorage(STORAGE_KEY)) || [];

      // Merge: local posts first (created/updated), then API posts
      const apiPosts = data.posts?.data ?? [];
      const combinedList = [...localPosts, ...apiPosts];

      return {
        list: combinedList,
        localPosts,
        apiPosts,
        meta: data.posts?.meta,
      };
    },
  });
}

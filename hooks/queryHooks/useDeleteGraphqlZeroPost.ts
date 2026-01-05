import { graphQLClientGraphqlZero } from "@/api/graphQlClient";
import { DELETE_GRAPHQL_ZERO_POST } from "@/graphQl/graphqlZero";
import { getItemFromStorage, setItemInStorage } from "@/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const STORAGE_KEY = "graphqlZeroCreatedPosts";

export function useDeleteGraphqlZeroPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteGraphqlZeroPost"],
    mutationFn: async (id: string | number) => {
      try {
        await graphQLClientGraphqlZero.request(DELETE_GRAPHQL_ZERO_POST, {
          id: String(id),
        });
      } catch (error) {
        console.log("Delete from API failed (might be local post)", error);
      }

      const localPosts = (await getItemFromStorage(STORAGE_KEY)) || [];
      const updatedPosts = localPosts.filter(
        (post: any) => String(post.id) !== String(id)
      );
      await setItemInStorage(STORAGE_KEY, updatedPosts);

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graphqlZeroPosts"] });
    },
  });
}

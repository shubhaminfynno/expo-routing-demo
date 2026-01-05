import { graphQLClientGraphqlZero } from "@/api/graphQlClient";
import { CREATE_GRAPHQL_ZERO_POST } from "@/graphQl/graphqlZero";
import { getItemFromStorage, setItemInStorage } from "@/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const STORAGE_KEY = "graphqlZeroCreatedPosts";

type CreatePostInput = {
  title: string;
  body: string;
};

export function useCreateGraphqlZeroPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createGraphqlZeroPost"],
    mutationFn: async (input: CreatePostInput) => {
      let createdPost;
      try {
        const data = await graphQLClientGraphqlZero.request(
          CREATE_GRAPHQL_ZERO_POST,
          { input }
        );
        createdPost = data.createPost;
      } catch (error) {
        createdPost = {
          id: `local_${Date.now()}`,
          title: input.title,
          body: input.body,
        };
      }

      const localPosts = (await getItemFromStorage(STORAGE_KEY)) || [];
      await setItemInStorage(STORAGE_KEY, [createdPost, ...localPosts]);

      return createdPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graphqlZeroPosts"] });
    },
  });
}

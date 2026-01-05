import { gql } from "graphql-request";

export const GET_GRAPHQL_ZERO_POSTS = gql`
  query GetGraphqlZeroPosts($page: Int = 1, $limit: Int = 10) {
    posts(options: { paginate: { page: $page, limit: $limit } }) {
      data {
        id
        title
        body
        user {
          name
        }
      }
      meta {
        totalCount
      }
    }
  }
`;

export const CREATE_GRAPHQL_ZERO_POST = gql`
  mutation CreateGraphqlZeroPost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      body
    }
  }
`;

export const DELETE_GRAPHQL_ZERO_POST = gql`
  mutation DeleteGraphqlZeroPost($id: ID!) {
    deletePost(id: $id)
  }
`;

export const UPDATE_GRAPHQL_ZERO_POST = gql`
  mutation UpdateGraphqlZeroPost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      body
    }
  }
`;

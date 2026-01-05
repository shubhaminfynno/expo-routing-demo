import { GraphQLClient } from "graphql-request";

export const graphQLClientCountries = new GraphQLClient(
  "https://countries.trevorblades.com/",
  {
    headers: {},
  }
);

export const graphQLClientAnimes = new GraphQLClient(
  "https://graphql.anilist.co/",
  {
    headers: {},
  }
);

export const graphQLClientGraphqlZero = new GraphQLClient(
  "https://graphqlzero.almansi.me/api",
  {
    headers: {},
  }
);

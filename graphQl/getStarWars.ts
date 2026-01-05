import { gql } from "graphql-request";

export const GET_STAR_WARS = gql`
  query {
    allPeople {
      people {
        name
        gender
        height
      }
    }
  }
`;

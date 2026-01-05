import { gql } from "graphql-request";

export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      emoji
      capital
      continent {
        name
      }
    }
  }
`;

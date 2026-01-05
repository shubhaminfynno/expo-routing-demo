import { graphQLClientCountries } from "@/api/graphQlClient";
import { GET_COUNTRIES } from "@/graphQl/getCountries";
import { useQuery } from "@tanstack/react-query";

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const data = await graphQLClientCountries.request(GET_COUNTRIES);
      return data.countries;
    },
  });
}

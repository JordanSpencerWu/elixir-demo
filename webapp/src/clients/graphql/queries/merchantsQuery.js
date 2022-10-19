import { gql } from "@apollo/client";

import { merchantFields } from "../fragments/merchantFields";

export default gql`
  query merchants($search: MerchantSearch, $limit: Int, $skip: Int) {
    merchants(search: $search, limit: $limit, skip: $skip) {
      entries {
        __typename
        ... on Merchant {
          ...MerchantFields
        }
      }
      offset
      totalRows
    }
  }
  ${merchantFields}
`;

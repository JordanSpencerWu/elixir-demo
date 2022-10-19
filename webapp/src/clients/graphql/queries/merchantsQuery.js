import { gql } from "@apollo/client";

import { merchantFields } from "../fragments/merchantFields";

export default gql`
  query merchants($search: MerchantSearch) {
    merchants(search: $search) {
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

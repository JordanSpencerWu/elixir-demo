import { gql } from "@apollo/client";

import { companyFields } from "../fragments/companyFields";

export default gql`
  query {
    companies {
      entries {
        __typename
        ... on Company {
          ...CompanyFields
        }
      }
      offset
      total_rows
    }
  }
  ${companyFields}
`;

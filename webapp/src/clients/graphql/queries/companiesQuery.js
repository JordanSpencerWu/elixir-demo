import { gql } from "@apollo/client";

import { companyFields } from "../fragments/companyFields";

export default gql`
  query companies($limit: Int, $skip: Int) {
    companies(limit: $limit, skip: $skip) {
      entries {
        __typename
        ... on Company {
          ...CompanyFields
        }
      }
      offset
      totalRows
    }
  }
  ${companyFields}
`;

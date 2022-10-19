import { gql } from "@apollo/client";

import { companyFields } from "../fragments/companyFields";

export const operationName = "companies";

export default gql`
  query ${operationName}($limit: Int, $skip: Int, $search: CompanySearch) {
    companies(limit: $limit, skip: $skip, search: $search) {
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

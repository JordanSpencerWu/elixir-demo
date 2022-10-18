import { gql } from "@apollo/client";

import { companyFields } from "../fragments/companyFields";

export default gql`
  mutation updateCompany(
    $id: ID!
    $creditLine: DecimalAmount!
    $name: String!
  ) {
    updateCompany(id: $id, creditLine: $creditLine, name: $name) {
      ...CompanyFields
    }
  }
  ${companyFields}
`;

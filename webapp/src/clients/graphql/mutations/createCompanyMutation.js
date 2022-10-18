import { gql } from "@apollo/client";

import { companyFields } from "../fragments/companyFields";

export default gql`
  mutation createCompany($creditLine: DecimalAmount!, $name: String!) {
    createCompany(creditLine: $creditLine, name: $name) {
      ...CompanyFields
    }
  }
  ${companyFields}
`;

import { gql } from "@apollo/client";

import { companyFields } from "../fragments/companyFields";

export default gql`
  mutation deleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      ...CompanyFields
    }
  }
  ${companyFields}
`;

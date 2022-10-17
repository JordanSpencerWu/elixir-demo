import { gql } from "@apollo/client";

import { companyFields } from "../fragments/companyFields";

export default gql`
  query company($id: ID!) {
    company(id: $id) {
      ...CompanyFields
    }
  }
  ${companyFields}
`;

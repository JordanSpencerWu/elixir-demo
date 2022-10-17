import { gql } from "@apollo/client";

import { userFields } from "../fragments/userFields";
import { companyFields } from "../fragments/companyFields";

export default gql`
  query user($id: ID!) {
    user(id: $id) {
      ...UserFields
      company {
        ...CompanyFields
      }
    }
  }
  ${userFields}
  ${companyFields}
`;

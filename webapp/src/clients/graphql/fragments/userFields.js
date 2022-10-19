import { gql } from "@apollo/client";

import { companyFields } from "../fragments/companyFields";

export const userFields = gql`
  fragment UserFields on User {
    id
    companyId
    deleted
    dob
    firstName
    lastName
    company {
      ...CompanyFields
    }
  }
  ${companyFields}
`;

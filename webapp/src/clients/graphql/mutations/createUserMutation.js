import { gql } from "@apollo/client";

import { userFields } from "../fragments/userFields";

export default gql`
  mutation createUser(
    $companyId: ID!
    $dob: String!
    $firstName: String!
    $lastName: String!
  ) {
    createUser(
      companyId: $companyId
      dob: $dob
      firstName: $firstName
      lastName: $lastName
    ) {
      ...UserFields
    }
  }
  ${userFields}
`;

import { gql } from "@apollo/client";

import { userFields } from "../fragments/userFields";

export default gql`
  mutation updateUser(
    $id: ID!
    $companyId: ID!
    $dob: String!
    $firstName: String!
    $lastName: String!
  ) {
    updateUser(
      id: $id
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

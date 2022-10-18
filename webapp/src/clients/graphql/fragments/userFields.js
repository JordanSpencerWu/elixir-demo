import { gql } from "@apollo/client";

export const userFields = gql`
  fragment UserFields on User {
    id
    dob
    firstName
    lastName
    companyId
  }
`;

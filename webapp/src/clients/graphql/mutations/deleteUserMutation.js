import { gql } from "@apollo/client";

import { userFields } from "../fragments/userFields";

export default gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      ...UserFields
    }
  }
  ${userFields}
`;

import { gql } from "@apollo/client";

import { userFields } from "../fragments/userFields";

export default gql`
  query users($filter: UserFilter, $search: UserSearch) {
    users(filter: $filter, search: $search) {
      entries {
        __typename
        ... on User {
          ...UserFields
        }
      }
      offset
      total_rows
    }
  }
  ${userFields}
`;

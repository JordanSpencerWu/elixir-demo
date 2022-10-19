import { gql } from "@apollo/client";

import { userFields } from "../fragments/userFields";

export default gql`
  query users(
    $filter: UserFilter
    $search: UserSearch
    $limit: Int
    $skip: Int
  ) {
    users(filter: $filter, search: $search, limit: $limit, skip: $skip) {
      entries {
        __typename
        ... on User {
          ...UserFields
        }
      }
      offset
      totalRows
    }
  }
  ${userFields}
`;

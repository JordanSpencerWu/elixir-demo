import { gql } from "@apollo/client";

import { userFields } from "../fragments/userFields";

export const operationName = "users";

export default gql`
  query ${operationName}(
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

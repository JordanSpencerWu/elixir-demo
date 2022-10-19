import { gql } from "@apollo/client";

import { transactionFields } from "../fragments/transactionFields";

export default gql`
  query transactions($filter: TransactionFilter, $limit: Int, $skip: Int) {
    transactions(filter: $filter, limit: $limit, skip: $skip) {
      entries {
        ... on Transaction {
          ...TransactionFields
        }
      }
      offset
      totalRows
    }
  }
  ${transactionFields}
`;

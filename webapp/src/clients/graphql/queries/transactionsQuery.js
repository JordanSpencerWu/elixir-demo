import { gql } from "@apollo/client";

import { transactionFields } from "../fragments/transactionFields";

export default gql`
  query transactions($filter: TransactionFilter) {
    transactions(filter: $filter) {
      entries {
        ... on Transaction {
          ...TransactionFields
        }
      }
      offset
      total_rows
    }
  }
  ${transactionFields}
`;

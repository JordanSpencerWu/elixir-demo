import { gql } from "@apollo/client";

import { transactionFields } from "../fragments/transactionFields";

export default gql`
  mutation deleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      ...TransactionFields
    }
  }
  ${transactionFields}
`;

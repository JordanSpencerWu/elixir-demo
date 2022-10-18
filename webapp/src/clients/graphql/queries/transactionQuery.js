import { gql } from "@apollo/client";

import { transactionFields } from "../fragments/transactionFields";

export default gql`
  query transaction($id: ID!) {
    transaction(id: $id) {
      ...TransactionFields
    }
  }
  ${transactionFields}
`;

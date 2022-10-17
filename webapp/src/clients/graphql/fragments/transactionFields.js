import { gql } from "@apollo/client";

export const transactionFields = gql`
  fragment TransactionFields on Transaction {
    id
    amount
    credit
    debit
    description
  }
`;

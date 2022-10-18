import { gql } from "@apollo/client";

import { transactionFields } from "../fragments/transactionFields";

export default gql`
  mutation createTransaction(
    $companyId: ID!
    $userId: ID!
    $merchantId: ID!
    $amount: DecimalAmount!
    $credit: Boolean!
    $debit: Boolean!
    $description: String!
  ) {
    createTransaction(
      companyId: $companyId
      userId: $userId
      merchantId: $merchantId
      amount: $amount
      credit: $credit
      debit: $debit
      description: $description
    ) {
      ...TransactionFields
    }
  }
  ${transactionFields}
`;

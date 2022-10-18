import { gql } from "@apollo/client";

import { transactionFields } from "../fragments/transactionFields";

export default gql`
  mutation updateTransaction(
    $id: ID!
    $companyId: ID!
    $userId: ID!
    $merchantId: ID!
    $amount: DecimalAmount!
    $credit: Boolean!
    $debit: Boolean!
    $description: String!
  ) {
    updateTransaction(
      id: $id
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

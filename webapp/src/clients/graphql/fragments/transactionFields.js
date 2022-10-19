import { gql } from "@apollo/client";

import { companyFields } from "../fragments/companyFields";
import { merchantFields } from "../fragments/merchantFields";
import { userFields } from "../fragments/userFields";

export const transactionFields = gql`
  fragment TransactionFields on Transaction {
    id
    amount
    companyId
    credit
    debit
    deleted
    description
    merchantId
    userId
    company {
      ...CompanyFields
    }
    merchant {
      ...MerchantFields
    }
    user {
      ...UserFields
    }
  }
  ${companyFields}
  ${merchantFields}
  ${userFields}
`;

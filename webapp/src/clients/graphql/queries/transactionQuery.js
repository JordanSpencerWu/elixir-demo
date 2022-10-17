import { gql } from "@apollo/client";

import { companyFields } from "../fragments/companyFields";
import { merchantFields } from "../fragments/merchantFields";
import { transactionFields } from "../fragments/transactionFields";
import { userFields } from "../fragments/userFields";

export default gql`
  query transaction($id: ID!) {
    transaction(id: $id) {
      ...TransactionFields
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
  }
  ${companyFields}
  ${merchantFields}
  ${transactionFields}
  ${userFields}
`;

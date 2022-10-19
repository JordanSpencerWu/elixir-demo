import { gql } from "@apollo/client";

export const merchantFields = gql`
  fragment MerchantFields on Merchant {
    id
    deleted
    description
    name
  }
`;

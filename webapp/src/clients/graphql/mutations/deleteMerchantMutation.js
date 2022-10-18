import { gql } from "@apollo/client";

import { merchantFields } from "../fragments/merchantFields";

export default gql`
  mutation deleteMerchant($id: ID!) {
    deleteMerchant(id: $id) {
      ...MerchantFields
    }
  }
  ${merchantFields}
`;

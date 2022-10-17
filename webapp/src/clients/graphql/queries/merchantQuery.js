import { gql } from "@apollo/client";

import { merchantFields } from "../fragments/merchantFields";

export default gql`
  query merchant($id: ID!) {
    merchant(id: $id) {
      ...MerchantFields
    }
  }
  ${merchantFields}
`;

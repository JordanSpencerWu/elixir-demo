import { gql } from "@apollo/client";

import { merchantFields } from "../fragments/merchantFields";

export default gql`
  mutation updateMerchant($id: ID!, $name: String!, $description: String!) {
    updateMerchant(id: $id, name: $name, description: $description) {
      ...MerchantFields
    }
  }
  ${merchantFields}
`;

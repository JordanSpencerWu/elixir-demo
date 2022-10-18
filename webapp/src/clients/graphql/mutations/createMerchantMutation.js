import { gql } from "@apollo/client";

import { merchantFields } from "../fragments/merchantFields";

export default gql`
  mutation createMerchant($name: String!, $description: String!) {
    createMerchant(name: $name, description: $description) {
      ...MerchantFields
    }
  }
  ${merchantFields}
`;

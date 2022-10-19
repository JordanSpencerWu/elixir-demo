import { gql } from "@apollo/client";

export const companyFields = gql`
  fragment CompanyFields on Company {
    id
    availableCredit
    creditLine
    deleted
    name
  }
`;

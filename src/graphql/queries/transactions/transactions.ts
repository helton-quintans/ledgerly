import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query Transactions($page: Int, $pageSize: Int) {
    transactions(page: $page, pageSize: $pageSize) {
      transactions {
        id
        amount
        currency
        date
        category
        description
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

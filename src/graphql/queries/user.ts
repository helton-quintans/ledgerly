import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  
  fragment UserFields on User {
    id
    name
    email
  }
`;

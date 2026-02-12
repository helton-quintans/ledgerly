import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String!) {
    updateUser(id: $id, name: $name) {
      ...UserFields
    }
  }
  
  fragment UserFields on User {
    id
    name
    email
  }
`;

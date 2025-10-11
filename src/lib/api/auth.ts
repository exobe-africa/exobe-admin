import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation AdminLogin($input: LoginInput!) {
    login(input: $input) {
      id
      email
      name
      phone
      role
      token
    }
  }
`;

export const ME_QUERY = gql`
  query AdminMe {
    me {
      id
      email
      name
      phone
      role
    }
  }
`;



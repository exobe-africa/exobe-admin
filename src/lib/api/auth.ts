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

export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;



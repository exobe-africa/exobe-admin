import { gql } from "@apollo/client";

export const ADMIN_USERS_QUERY = gql`
  query AdminUsers($query: String, $role: Role, $status: Boolean) {
    searchUsers(query: $query, role: $role, isActive: $status) {
      id
      name
      email
      phone
      role
      is_active
      created_at
    }
  }
`;

export const ADMIN_RESET_USER_PASSWORD = gql`
  mutation AdminResetUserPassword($userId: String!, $newPassword: String!, $sendEmail: Boolean!) {
    adminResetUserPassword(userId: $userId, newPassword: $newPassword, sendEmail: $sendEmail)
  }
`;

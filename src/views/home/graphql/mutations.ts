import { gql } from '@apollo/client';

export const CREATE_POST = gql`
mutation CreatePost($createAdminPostInput: CreatePostInput!) {
  createPost(createAdminPostInput: $createAdminPostInput) {
    _id
    createdAt
    message
    updatedAt
  }
}
`;

export const ADMIN_CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($body: ChangePasswordInput!) {
    changePassword(body: $body) {
      message
    }
  }
`;

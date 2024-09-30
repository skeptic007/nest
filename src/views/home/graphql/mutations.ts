import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($createAdminPostInput: CreatePostInput!) {
    createPost(createAdminPostInput: $createAdminPostInput) {
      message
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: String!) {
    likePost(postID: $postId) {
      message
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation Mutation($createCommentInput: CreateCommentInput!) {
    createComment(createCommentInput: $createCommentInput) {
      message
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

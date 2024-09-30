import { gql } from '@apollo/client';

export const LIST_ALL_POSTS = gql`
  query ListHomePagePosts($paginationParams: BasePaginationParams!) {
    listHomePagePosts(paginationParams: $paginationParams) {
      data {
        _id
        commentCount
        createdAt
        hashTags
        image
        isLiked
        likeCount
        postTags {
          _id
          adminApproveStatus
          authProvider
          authProviderId
          countryCode
          createdAt
          email
          firstName
          lastName
          mfaEnabled
          middleName
          permission
          phoneNumber
          profile {
            avatar
            bio
          }
          role
          status
          theme
          updatedAt
        }
        shareCount
        status
        title
        type
        updatedAt
        user {
          _id
          adminApproveStatus
          authProvider
          authProviderId
          countryCode
          createdAt
          email
          firstName
          lastName
          mfaEnabled
          middleName
          permission
          phoneNumber
          role
          status
          theme
          updatedAt
          profile {
            avatar
            bio
          }
        }
        recentComments {
          commentedBy {
            _id
            adminApproveStatus
            authProvider
            authProviderId
            countryCode
            createdAt
            email
            firstName
            lastName
            mfaEnabled
            middleName
            permission
            phoneNumber
            role
            status
            theme
            updatedAt
            profile {
              avatar
              bio
            }
          }
          content
        }
      }
      pagination {
        hasNextPage
        total
      }
    }
  }
`;

export const GET_PRESIGNED_URL = gql`
  query Query($getPreSignedUrl: GetPreSignedUrlInputFileUpload!) {
    getPreSignedUrl(getPreSignedUrl: $getPreSignedUrl)
  }
`;

export const GET_APP_USERS = gql`
  query Query($paginationParams: BasePaginationParams!) {
    listAllAppUsres(paginationParams: $paginationParams) {
      pagination {
        hasNextPage
        total
      }
      data {
        _id
        adminApproveStatus
        authProvider
        authProviderId
        countryCode
        createdAt
        email
        firstName
        lastName
        mfaEnabled
        middleName
        permission
        phoneNumber
        profile {
          avatar
          bio
        }
        role
        status
        theme
        updatedAt
      }
    }
  }
`;

export const GET_ALL_COMMENTS = gql`
  query GetAllComments($listCommentInput: ListCommentsInput!) {
    getAllComments(listCommentInput: $listCommentInput) {
      data {
        _id
        content
        createdAt
        postId
        updatedAt
        userDetails {
          avatar
          firstName
          lastName
          middleName
        }
        userId
      }
      pagination {
        hasNextPage
        total
      }
    }
  }
`;

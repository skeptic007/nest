import { gql } from '@apollo/client';

export const LIST_ALL_POSTS = gql`
  query Query($paginationParams: BasePaginationParams!) {
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

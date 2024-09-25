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
        parentPost {
          _id
          commentCount
          createdAt
          hashTags
          image
          isLiked
          likeCount
          shareCount
          status
          title
          type
          updatedAt
        }
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
            favouritePosts
            hobbies
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

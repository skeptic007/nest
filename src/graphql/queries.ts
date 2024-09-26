import { gql } from '@apollo/client';

export const GET_PRESIGNED_URL = gql`
  query Query($getPreSignedUrl: GetPreSignedUrlInputFileUpload!) {
    getPreSignedUrl(getPreSignedUrl: $getPreSignedUrl)
  }
`;

export const GET_IMAGE_URL = gql`
  query GetImageUrl($imageUrlKey: ImageUrlKey!) {
    getImageUrl(imageUrlKey: $imageUrlKey)
  }
`;

export const GET_ME = gql`
  query Me {
    me {
      _id
      adminApproveStatus
      countryCode
      email
      firstName
      lastName
      middleName
      phoneNumber
      profile {
        avatar
      }
      role
      status
      theme
    }
  }
`;

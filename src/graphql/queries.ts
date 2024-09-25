import { gql } from '@apollo/client';

export const GET_PRESIGNED_URL = gql`
  query Query($getPreSignedUrl: GetPreSignedUrlInputFileUpload!) {
    getPreSignedUrl(getPreSignedUrl: $getPreSignedUrl)
  }
`;

export const GET_IMAGE_URL = gql`
  query Query($imageUrlKey: ImageUrlKey!) {
    getImageUrl(imageUrlKey: $imageUrlKey)
  }
`;

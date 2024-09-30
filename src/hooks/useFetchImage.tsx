import { useQuery } from '@apollo/client';
import { GET_IMAGE_URL } from 'graphql/queries';

const useFetchImage = (imageKey: string | null) => {
  const { data, loading, error } = useQuery(GET_IMAGE_URL, {
    variables: { imageUrlKey: { key: imageKey } },
    skip: !imageKey
  });

  return {
    imageUrl: data?.getImageUrl || '',
    loading,
    error
  };
};

export default useFetchImage;

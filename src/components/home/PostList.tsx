import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, CircularProgress } from '@mui/material';
import PostView from './PostView'; // Your existing Post component
import { LIST_ALL_POSTS } from 'views/home/graphql';

const LIMIT = 5;

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<>([]);
  const [paginationParams, setPaginationParams] = useState<>({
    skip: 0,
    limit: LIMIT
  });
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { loading, error, data, fetchMore } = useQuery(LIST_ALL_POSTS, {
    variables: { paginationParams },
    onCompleted: (data) => {
      const newPosts = data?.listHomePagePosts?.data || [];
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setHasNextPage(data?.listHomePagePosts?.pagination?.hasNextPage);
    }
  });

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500 &&
      !loadingMore &&
      hasNextPage
    ) {
      setLoadingMore(true);
      fetchMore({
        variables: {
          paginationParams: {
            skip: posts.length,
            limit: LIMIT
          }
        }
      }).then(() => setLoadingMore(false));
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [posts, loadingMore, hasNextPage]);

  if (loading && posts.length === 0) return <CircularProgress />;

  if (error) return <p>Error loading posts...</p>;

  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid key={post._id} item xs={12}>
          <PostView post={post} />
        </Grid>
      ))}
      {loadingMore && <CircularProgress />}
    </Grid>
  );
};

export default PostList;

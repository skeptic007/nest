import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, CircularProgress } from '@mui/material';
import PostView from './PostView'; // Your existing Post component
import { LIST_ALL_POSTS } from 'views/home/graphql';

const LIMIT = 10;

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [paginationParams] = useState({
    skip: 0,
    limit: LIMIT
  });
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Initial Query to fetch the first set of posts
  const { loading, error, fetchMore, refetch } = useQuery(LIST_ALL_POSTS, {
    variables: { paginationParams },
    onCompleted: (data) => {
      const newPosts = data?.listHomePagePosts?.data || [];
      setPosts(newPosts); // For the first query, replace the posts
      setHasNextPage(data?.listHomePagePosts?.pagination?.hasNextPage);
    }
  });

  // Handle fetching more posts when scrolling
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000 &&
      !loadingMore &&
      hasNextPage
    ) {
      console.log('handleScroll called===');
      setLoadingMore(true);
      fetchMore({
        variables: {
          paginationParams: {
            skip: posts.length, // Increase skip by posts.length to fetch the next set
            limit: LIMIT
          }
        }
      }).then(({ data }) => {
        const newPosts = data?.listHomePagePosts?.data || [];
        setPosts((prevPosts) => [...prevPosts, ...newPosts]); // Append new posts
        setHasNextPage(data?.listHomePagePosts?.pagination?.hasNextPage); // Update if there are more pages
        setLoadingMore(false);
      });
    }
  }, [fetchMore, posts.length, loadingMore, hasNextPage]);

  // Add and remove scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading && posts.length === 0) return <CircularProgress />;
  if (error) return <p>Error loading posts...</p>;

  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid key={post._id} item xs={12}>
          <PostView post={post} refetchPosts={refetch} />
        </Grid>
      ))}
      {loadingMore && (
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      )}
    </Grid>
  );
};

export default PostList;

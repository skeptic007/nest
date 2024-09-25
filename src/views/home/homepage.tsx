'use client';

import React from 'react';

// material-ui
import Grid from '@mui/material/Grid';

import Posts from 'ui-component/cards/Post';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { dispatch, useSelector } from 'store';
import { getPosts, editComment, addComment, addReply, likePost, likeComment, likeReply } from 'store/slices/user';
import { PostDataType, Reply } from 'types/user-profile';

import UpcomingEvents from 'components/home/UpcomingEvents';
import LikesAndPosts from 'components/home/LikesAndPosts';
import PinnedEvents from 'components/home/PinnedEvents';
import EventCalendar from 'components/home/EventCalendar';
import CreatePostPopup from 'components/home/CreatePost';

// ==============================|| SOCIAL PROFILE - POST ||============================== //

const HomePage = () => {
  const [posts, setPosts] = React.useState<PostDataType[]>([]);
  const userState = useSelector((state) => state.user);
  const getPost = async () => {
    dispatch(getPosts());
  };

  React.useEffect(() => {
    setPosts(userState.posts);
  }, [userState]);

  React.useEffect(() => {
    getPost();
  }, []);

  const editPost = async (id: string, commentId: string) => {
    dispatch(editComment(id, commentId));
  };

  const commentAdd = async (id: string, comment: Reply) => {
    dispatch(addComment(id, comment));
  };

  const replyAdd = async (postId: string, commentId: string, reply: Reply) => {
    dispatch(addReply(postId, commentId, reply));
  };

  const handlePostLikes = async (postId: string) => {
    dispatch(likePost(postId));
  };

  const handleCommentLikes = async (postId: string, commentId: string) => {
    dispatch(likeComment(postId, commentId));
  };

  const handleReplayLikes = async (postId: string, commentId: string, replayId: string) => {
    dispatch(likeReply(postId, commentId, replayId));
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} sm={12} md={8}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <CreatePostPopup />
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          {posts &&
            posts.map((post: PostDataType, index: number) => (
              <Grid key={post.id} item xs={12}>
                <Posts
                  key={post.id}
                  post={post}
                  editPost={editPost}
                  renderPost={getPost}
                  setPosts={setPosts}
                  commentAdd={commentAdd}
                  replyAdd={replyAdd}
                  handlePostLikes={handlePostLikes}
                  handleCommentLikes={handleCommentLikes}
                  handleReplayLikes={handleReplayLikes}
                />
              </Grid>
            ))}
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={4}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <LikesAndPosts />
          </Grid>
          <Grid item xs={12}>
            <PinnedEvents />
          </Grid>
          <Grid item xs={12}>
            <UpcomingEvents />
          </Grid>
          <Grid item xs={12}>
            <EventCalendar />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;

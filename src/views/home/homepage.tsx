'use client';

import React from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import Posts from 'ui-component/cards/Post';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { dispatch, useSelector } from 'store';
import { getPosts, editComment, addComment, addReply, likePost, likeComment, likeReply } from 'store/slices/user';

// types
import { ThemeMode } from 'types/config';
import { PostDataType, Reply } from 'types/user-profile';

// assets

import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';

import RecentActorsTwoToneIcon from '@mui/icons-material/RecentActorsTwoTone';
import { Card, CardActions, CardContent, CardMedia } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';

import UpcomingEvents from 'components/home/UpcomingEvents';

// ==============================|| SOCIAL PROFILE - POST ||============================== //
const Card1 = '/assets/images/cards/card-1.jpg';

const HomePage = () => {
  const theme = useTheme();
  const [posts, setPosts] = React.useState<PostDataType[]>([]);
  const userState = useSelector((state) => state.user);
  const getPost = async () => {
    dispatch(getPosts());
  };

  const cardStyle = {
    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'grey.50',
    border: '1px solid',
    borderColor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'grey.100'
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

  const sideAvatarSX = {
    borderRadius: '8px',
    width: 48,
    height: 48,
    fontSize: '1.5rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: theme.palette.mode === ThemeMode.DARK ? '1px solid' : 'none',
    '&>svg': {
      width: 24,
      height: 24
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} sm={12} md={8}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <TextField id="outlined-textarea" placeholder="What’s on your mind, Larry?" rows={4} fullWidth multiline />
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
            <MainCard>
              <Grid container alignItems="center" spacing={gridSpacing}>
                <Grid item>
                  <Box
                    sx={{
                      ...sideAvatarSX,
                      bgcolor: alpha(theme.palette.primary.dark, 0.1),
                      border: theme.palette.mode === ThemeMode.DARK ? '1px solid' : 'none',
                      borderColor: 'primary.main',
                      color: 'primary.dark'
                    }}
                  >
                    <PeopleAltTwoToneIcon />
                  </Box>
                </Grid>
                <Grid item xs zeroMinWidth>
                  <Typography variant="h3" color="primary" sx={{ mb: 0.625 }}>
                    239k
                  </Typography>
                  <Typography variant="body2">Posts</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ margin: '16px 0' }} />
              <Grid container alignItems="center" spacing={gridSpacing}>
                <Grid item>
                  <Box
                    sx={{
                      ...sideAvatarSX,
                      bgcolor: alpha(theme.palette.secondary.dark, 0.1),
                      borderColor: 'secondary.main',
                      color: 'secondary.dark'
                    }}
                  >
                    <RecentActorsTwoToneIcon />
                  </Box>
                </Grid>
                <Grid item xs zeroMinWidth>
                  <Typography
                    variant="h3"
                    sx={{
                      mb: 0.625,
                      color: theme.palette.mode === ThemeMode.DARK ? 'text.secondary' : 'secondary.main'
                    }}
                  >
                    234k
                  </Typography>
                  <Typography variant="body2">Likes</Typography>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <SubCard title="Pinned Events">
              <Card sx={cardStyle}>
                <CardMedia component="img" image={Card1} title="Card 1" />
                <CardContent>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Typography variant="subtitle1">Sunday Vibes</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle2">With supporting text below as a natural lead-in to additional content.</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Grid container>
                    <Grid item>
                      <Typography variant="subtitle1">Jan 1, 2025 | Kupondole</Typography>
                    </Grid>
                  </Grid>
                </CardActions>
              </Card>
            </SubCard>
          </Grid>
          <Grid item xs={12}>
            <UpcomingEvents />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;

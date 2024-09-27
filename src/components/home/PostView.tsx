import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, ButtonBase, Card, CardMedia, Collapse, Grid, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQuery } from '@apollo/client';
import { GET_IMAGE_URL, GET_ME } from 'graphql/queries';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import useConfig from 'hooks/useConfig';
import { ThemeMode } from 'types/config';
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-react';
import LikeIcon from 'components/icons/like';
import CommentIcon from 'components/icons/comment';
import ShareIcon from 'components/icons/share';
import HeartIcon from 'components/icons/heart';
import CommentView from './Comment';

type PostViewProps = {
  post: any;
};

const mockComments = [
  {
    profileImage: '/assets/images/users/avatar1', // Placeholder image URL
    commenterName: 'John Doe',
    commentText: 'This is a great post!'
  },
  {
    profileImage: '/assets/images/users/avatar2',
    commenterName: 'Jane Smith',
    commentText: 'Really insightful, thanks for sharing.'
  },
  {
    profileImage: '/assets/images/users/avatar3',
    commenterName: 'Emily Johnson',
    commentText: 'I learned something new today!'
  }
];

const PostView: React.FC<PostViewProps> = ({ post }) => {
  const theme = useTheme();
  const { mode } = useConfig();
  const isDarkMode = mode === ThemeMode.DARK;
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openComment, setOpenComment] = React.useState(false);

  const {
    data: postImageData,
    loading: postImageLoading,
    error: postImageError
  } = useQuery(GET_IMAGE_URL, {
    variables: { imageUrlKey: { key: post.image } },
    skip: !post.image
  });

  const postImageUrl = postImageData?.getImageUrl || '';

  // Fetch the profile avatar image
  const {
    data: avatarData,
    loading: avatarLoading,
    error: avatarError
  } = useQuery(GET_IMAGE_URL, {
    variables: { imageUrlKey: { key: post.user.profile.avatar } },
    skip: !post.user.profile.avatar
  });

  const avatarUrl = avatarData?.getImageUrl || '';

  // Fetch logged-in user information
  const { data: meData } = useQuery(GET_ME, { fetchPolicy: 'network-only' });
  const userData = meData?.me;

  const isPostOwner = userData?._id === post.user._id;
  // Fetch the logged-in user's profile avatar image
  const { data: userAvatarData } = useQuery(GET_IMAGE_URL, {
    variables: { imageUrlKey: { key: userData?.profile?.avatar } },
    skip: !userData?.profile?.avatar
  });
  const userAvatarUrl = userAvatarData?.getImageUrl || '';

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleChangeComment = () => setOpenComment((prev) => !prev);

  const methods = useForm();
  const { handleSubmit, reset } = methods;

  const onSubmit = async (commentData: any) => {
    reset({ comment: '' });
  };

  //to calculate time difference between current time and post created to show time ago
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    const intervalInYears = Math.floor(seconds / 31536000);
    if (intervalInYears > 1) return `${intervalInYears} years ago`;

    const intervalInMonths = Math.floor(seconds / 2592000);
    if (intervalInMonths > 1) return `${intervalInMonths} months ago`;

    const intervalInDays = Math.floor(seconds / 86400);
    if (intervalInDays > 1) return `${intervalInDays} days ago`;

    const intervalInHours = Math.floor(seconds / 3600);
    const intervalInMinutes = Math.floor((seconds % 3600) / 60);

    if (intervalInHours > 0 && intervalInMinutes > 0) {
      return `${intervalInHours} hr${intervalInHours > 1 ? 's' : ''} and ${intervalInMinutes} min${intervalInMinutes > 1 ? 's' : ''} ago`;
    } else if (intervalInHours > 0) {
      return `${intervalInHours} hr${intervalInHours > 1 ? 's' : ''} ago`;
    } else if (intervalInMinutes > 0) {
      return `${intervalInMinutes} min${intervalInMinutes > 1 ? 's' : ''} ago`;
    }

    return `${Math.floor(seconds)} sec${seconds > 1 ? 's' : ''} ago`;
  };

  if (postImageLoading || avatarLoading) return <p>Loading images...</p>;
  if (postImageError || avatarError) return <p>Error loading images</p>;

  return (
    <Card sx={{ padding: '20px', borderRadius: '15px', boxShadow: 3, marginBottom: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar alt={post.user.firstName} src={avatarUrl} />
            </Grid>
            <Grid item xs>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                {post.user.firstName} {post.user.lastName}
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant="body2" color="textSecondary" sx={{ display: 'inline', marginRight: 1 }}>
                {timeAgo(new Date(post.createdAt))} {/* Use the timeAgo function here */}
              </Typography>
              <ButtonBase onClick={handleClick}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    bgcolor: isDarkMode ? 'dark.main' : 'secondary.light',
                    color: isDarkMode ? 'warning.dark' : 'secondary.dark',
                    '&:hover': {
                      bgcolor: isDarkMode ? 'warning.dark' : 'secondary.dark',
                      color: isDarkMode ? 'grey.800' : 'secondary.light'
                    },
                    cursor: 'pointer'
                  }}
                >
                  <MoreVertTwoToneIcon />
                </Avatar>
              </ButtonBase>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {isPostOwner ? (
                  <>
                    <MenuItem onClick={handleClose}>
                      <IconPencil style={{ marginRight: 8 }} strokeWidth={1.5} size="20px" /> Edit
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <IconTrash style={{ marginRight: 8 }} strokeWidth={1.5} size="20px" /> Delete
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem onClick={handleClose}>
                    <IconEye style={{ marginRight: 8 }} strokeWidth={1.5} size="20px" /> View Profile
                  </MenuItem>
                )}
              </Menu>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {post.title}
          </Typography>
        </Grid>

        {postImageUrl && (
          <Grid item xs={12}>
            <CardMedia component="img" src={postImageUrl} alt="post image" sx={{ borderRadius: '10px', mb: 2 }} />
          </Grid>
        )}

        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Stack direction="row" spacing={2}>
              <Button variant="text" color="secondary" startIcon={<LikeIcon />}>
                {post.likeCount} Likes
              </Button>
              <Button variant="text" color="secondary" onClick={handleChangeComment} startIcon={<CommentIcon />}>
                {post.commentCount} Comments
              </Button>
              <Button variant="text" color="secondary" startIcon={<ShareIcon />} />
            </Stack>
            <Button variant="text" color="secondary" startIcon={<HeartIcon />} />
          </Stack>
        </Grid>

        <Collapse in={openComment} sx={{ width: '100%' }}>
          {openComment && (
            <Grid item xs={12} sx={{ pt: 2, ml: 2 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormProvider {...methods}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar alt={post.user.firstName} src={userAvatarUrl} />
                    <Controller
                      name="comment"
                      control={methods.control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder="Write a comment..."
                          variant="outlined"
                          margin="normal"
                          size={downMD ? 'small' : 'medium'}
                        />
                      )}
                    />
                    <Button
                      type="submit"
                      color="secondary"
                      sx={{
                        backgroundColor: theme.palette.secondary.dark, // Dark secondary main color
                        '&:hover': {
                          backgroundColor: theme.palette.secondary[800] // Optional: Add hover effect
                        }
                      }}
                      size="large"
                      variant="contained"
                    >
                      Comment
                    </Button>
                  </Stack>
                </FormProvider>
              </form>
              <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                {mockComments.map((comment, index) => (
                  <CommentView
                    key={index}
                    profileImage={comment.profileImage}
                    commenterName={comment.commenterName}
                    commentText={comment.commentText}
                  />
                ))}
              </Grid>
            </Grid>
          )}
        </Collapse>
      </Grid>
    </Card>
  );
};

export default PostView;

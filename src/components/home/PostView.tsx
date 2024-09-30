import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Button,
  ButtonBase,
  Card,
  CardMedia,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME } from 'graphql/queries';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import useConfig from 'hooks/useConfig';
import { ThemeMode } from 'types/config';
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-react';
import LikeIcon from 'components/icons/like';
import CommentIcon from 'components/icons/comment';
import ShareIcon from 'components/icons/share';
import HeartIcon from 'components/icons/heart';
import CommentView from './Comment';
import { CREATE_COMMENT, GET_ALL_COMMENTS } from 'views/home/graphql';
import useFetchImage from 'hooks/useFetchImage';
import { timeAgo } from 'utils/timeAgo';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';

const fallbackProfile = '/assets/images/users/loadingprofile.jpg';

type PostViewProps = {
  post: any;
  refetchPosts: any;
};

const PostView: React.FC<PostViewProps> = ({ post, refetchPosts }) => {
  const theme = useTheme();
  const { mode } = useConfig();
  const isDarkMode = mode === ThemeMode.DARK;
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openComment, setOpenComment] = React.useState(false);
  const [allComments, setAllComments] = React.useState<any[]>([]);
  const [showMoreComments, setShowMoreComments] = React.useState(false);
  const dispatch = useDispatch();

  const { loading: loadingMoreComments, refetch: fetchMoreComments } = useQuery(GET_ALL_COMMENTS, {
    variables: {
      listCommentInput: {
        id: post._id,
        limit: 15,
        skip: 0
      }
    },
    skip: true, // We will trigger manually when needed
    onCompleted: (data) => {
      setAllComments(data.getAllComments.data);
    }
  });

  const handleViewMoreComments = async () => {
    await fetchMoreComments();
    setShowMoreComments(true);
  };

  const [createComment] = useMutation(CREATE_COMMENT, {
    onCompleted: (data) => {
      dispatch(
        openSnackbar({
          open: true,
          message: data.createComment.message,
          variant: 'alert',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
          alert: { color: 'success' }
        })
      );
      refetchPosts(); // Optionally refetch comments
    },
    onError: (error: any) => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to comment',
          variant: 'alert',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
          alert: { color: 'error' }
        })
      );
    }
  });

  // Combine recent comments and fetched all comments (if "View More" is clicked)
  const commentsToDisplay = showMoreComments ? allComments : post.recentComments;

  // Fetch post image
  const { imageUrl: postImageUrl, loading: postImageLoading, error: postImageError } = useFetchImage(post.image);

  // Fetch post author's avatar
  const { imageUrl: avatarUrl, loading: avatarLoading, error: avatarError } = useFetchImage(post.user.profile.avatar);

  // Fetch logged-in user information
  const { data: meData } = useQuery(GET_ME, { fetchPolicy: 'network-only' });
  const userData = meData?.me;

  const isPostOwner = userData?._id === post.user._id;

  // Fetch logged-in user's avatar
  const { imageUrl: userAvatarUrl } = useFetchImage(userData?.profile?.avatar);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleChangeComment = () => setOpenComment((prev) => !prev);

  const methods = useForm();
  const { handleSubmit, reset } = methods;

  const onSubmit = async (commentData: any) => {
    try {
      await createComment({ variables: { createCommentInput: { postId: post._id, content: commentData.comment } } });
      reset({ comment: '' });
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to comment',
          variant: 'alert',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
          alert: { color: 'error' }
        })
      );
    }
  };
  if (postImageLoading || avatarLoading) return <CircularProgress />;
  if (postImageError || avatarError) return <p>Error loading images</p>;

  return (
    <Card sx={{ padding: '20px', borderRadius: '15px', boxShadow: 3, marginBottom: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar alt={post.user.firstName} src={avatarUrl || fallbackProfile} />
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
            <IconButton color="secondary">
              <HeartIcon width={30} height={30} />
            </IconButton>
          </Stack>
        </Grid>

        <Collapse in={openComment} sx={{ width: '100%' }}>
          {openComment && (
            <Grid item xs={12} sx={{ pt: 2, ml: 2 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormProvider {...methods}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar alt={post.user.firstName} src={userAvatarUrl || fallbackProfile} />
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
            </Grid>
          )}
        </Collapse>
        {commentsToDisplay?.map((comment: any) => <CommentView key={comment.id} comment={comment} />)}

        {post.commentCount > post.recentComments.length && !showMoreComments && (
          <Grid item xs={12} sx={{ mt: 2, textAlign: 'center' }}>
            <Button onClick={handleViewMoreComments} disabled={loadingMoreComments}>
              {loadingMoreComments ? <CircularProgress size={24} /> : <Typography variant="body2">View More Comments</Typography>}
            </Button>
          </Grid>
        )}

        {showMoreComments && (
          <Grid item xs={12} sx={{ mt: 2, textAlign: 'center' }}>
            <Button onClick={() => setShowMoreComments(false)}>
              <Typography variant="body2">View Less Comments</Typography>
            </Button>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

export default PostView;

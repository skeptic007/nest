import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, ButtonBase, Card, CardMedia, Collapse, Grid, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQuery } from '@apollo/client';
import { GET_IMAGE_URL } from 'graphql/queries';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';

type PostViewProps = {
  post: any;
};

const avatarImage = '/assets/images/users';

const PostView: React.FC<PostViewProps> = ({ post }) => {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openComment, setOpenComment] = React.useState(false);

  const { data, loading, error } = useQuery(GET_IMAGE_URL, {
    variables: { imageUrlKey: { key: post.image } },
    skip: !post.image
  });

  const imageUrl = data?.getImageUrl || '';

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleChangeComment = () => setOpenComment((prev) => !prev);

  const methods = useForm();
  const { handleSubmit, reset } = methods;

  const onSubmit = async (commentData: any) => {
    reset({ comment: '' });
  };
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hrs ago`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} mins ago`;
    return `${seconds} secs ago`;
  };

  if (loading) return <p>Loading image...</p>;
  if (error) return <p>Error loading image</p>;

  return (
    <Card sx={{ padding: '20px', borderRadius: '15px', boxShadow: 3, marginBottom: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar alt={post.user.firstName} src={`${avatarImage}/${post.user._id}`} />
            </Grid>
            <Grid item xs>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                {post.user.firstName} {post.user.lastName}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                {timeAgo(new Date(post.createdAt))} {/* Use the timeAgo function here */}
              </Typography>
              <ButtonBase onClick={handleClick}>
                <Avatar variant="rounded" sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
                  <MoreVertTwoToneIcon />
                </Avatar>
              </ButtonBase>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleClose}>Edit</MenuItem>
                <MenuItem onClick={handleClose}>Delete</MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {post.title}
          </Typography>
        </Grid>

        {imageUrl && (
          <Grid item xs={12}>
            <CardMedia component="img" src={imageUrl} alt="post image" sx={{ borderRadius: '10px', maxHeight: 400, mb: 2 }} />
          </Grid>
        )}

        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Button variant="text" startIcon={<ThumbUpAltTwoToneIcon />}>
              {post.likeCount} Likes
            </Button>
            <Button variant="text" onClick={handleChangeComment} startIcon={<ChatBubbleTwoToneIcon />}>
              {post.commentCount} Comments
            </Button>
          </Stack>
        </Grid>

        <Collapse in={openComment}>
          <Grid item xs={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormProvider {...methods}>
                <Controller
                  name="comment"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Write a comment..."
                      variant="outlined"
                      margin="normal"
                      size={downMD ? 'small' : 'medium'}
                    />
                  )}
                />
              </FormProvider>
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Add Comment
              </Button>
            </form>
          </Grid>
        </Collapse>
      </Grid>
    </Card>
  );
};

export default PostView;

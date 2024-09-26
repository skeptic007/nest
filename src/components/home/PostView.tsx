import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, ButtonBase, CardMedia, Collapse, Grid, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQuery } from '@apollo/client';

// icons
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import { GET_IMAGE_URL } from 'graphql/queries';

// Define post type

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
    skip: !post.image, // Skip query if no image is available
  });

  const imageUrl = data?.getImageUrl || '';

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleChangeComment = () => setOpenComment((prev) => !prev);

  const methods = useForm();
  const { handleSubmit, reset } = methods;

  const onSubmit = async (commentData: any) => {
    // handle comment submission logic
    reset({ comment: '' });
  };

  if (loading) return <p>Loading image...</p>;
  if (error) return <p>Error loading image</p>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px', marginBottom: '20px' }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container wrap="nowrap" alignItems="center" spacing={1}>
            <Grid item>
              <Avatar alt={post.user.firstName} src={`${avatarImage}/${post.user._id}`} />
            </Grid>
            <Grid item xs>
              <Typography variant="h5">
                {post.user.firstName} {post.user.lastName}
              </Typography>
              <Typography variant="caption">
                <FiberManualRecordIcon sx={{ width: '10px', height: '10px', opacity: 0.5, mx: 1 }} />
                {new Date(post.createdAt).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item>
              <ButtonBase onClick={handleClick}>
                <Avatar variant="rounded">
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
          <Typography variant="h6">{post.title}</Typography>
        </Grid>

        {imageUrl && (
          <Grid item xs={12}>
            <CardMedia component="img" src={imageUrl} alt="post image" sx={{ borderRadius: '10px', maxHeight: 400 }} />
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
              <Button type="submit">Add Comment</Button>
            </form>
          </Grid>
        </Collapse>
      </Grid>
    </div>
  );
};

export default PostView;

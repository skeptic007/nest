import { useState, ChangeEvent } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMutation } from '@apollo/client';
import ImageUpload from 'components/icons/imageupload';
import UserTag from 'components/icons/usertag';
import { handleFileUpload } from 'utils/image-upload';
import { CREATE_POST } from 'views/home/graphql';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';

// Mock user data
const mockUsers = [
  { id: 1, name: 'Albert', avatar: '/path-to-avatar1.png' },
  { id: 2, name: 'Jane Doe', avatar: '/path-to-avatar2.png' },
  { id: 3, name: 'John Smith', avatar: '/path-to-avatar3.png' }
];

const ComposeDialog = () => {
  const [open, setOpen] = useState(false);
  const [isTagging, setIsTagging] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState([]); // To store tagged users
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null); // Store the image path
  const [imageUploadStatus, setImageUploadStatus] = useState<'uploading' | 'success' | 'error' | null>(null);
  const dispatch = useDispatch();

  const profile = {
    name: 'John Doe',
    avatar: 'assets/images/users/avatar-1.png'
  };

  const [createPost] = useMutation(CREATE_POST);

  const handleClickOpen = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    setImagePath(null);
  };

  const handleTagUserClick = () => setIsTagging(true);
  const handleBackToPost = () => setIsTagging(false);

  const handleTagUser = (user: any) => {
    if (!taggedUsers.includes(user)) {
      setTaggedUsers([...taggedUsers, user]);
    }
  };

  const handleUntagUser = (userId: number) => {
    setTaggedUsers(taggedUsers.filter((user) => user.id !== userId));
  };

  const formik = useFormik({
    initialValues: {
      content: ''
    },
    validationSchema: Yup.object({
      content: Yup.string().required('Content is required')
    }),
    onSubmit: async (values) => {
      if (!imageFile) {
        console.error('Image is required for the post');
        return;
      }

      try {
        // Upload image file when submitting the post
        const path = await handleFileUpload(imageFile, {
          setImageUploadStatus,
          setImage: setImageFile,
          setSnackbarMessage: (msg) => console.log(msg),
          setSnackbarSeverity: () => {},
          setSnackbarOpen: () => {}
        });

        if (path) {
          // Send post data to the backend
          const response = await createPost({
            variables: {
              createAdminPostInput: {
                title: values.content,
                image: path, // Use the uploaded image path
                hashTags: [], // Empty for now
                postTags: [] // Empty for now
              }
            }
          });

          console.log('Post created:', response);
          if (response?.data?.createPost) {
            dispatch(
              openSnackbar({
                open: true,
                message: response.data.createPost.message,
                variant: 'alert',
                anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                alert: { color: 'success' }
              })
            );
            handleCloseDialog();
          }
        } else {
          console.error('Failed to upload image');
          dispatch(
            openSnackbar({
              open: true,
              message: 'Failed to upload image',
              variant: 'alert',
              anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
              alert: { color: 'error' }
            })
          );
        }
      } catch (error: any) {
        console.error('Error creating post:', error);
        dispatch(
          openSnackbar({
            open: true,
            message: error.message || 'Error creating post',
            variant: 'alert',
            anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
            alert: { color: 'error' }
          })
        );
      }
    }
  });

  return (
    <>
      <TextField
        id="outlined-textarea"
        placeholder="What’s on your mind?"
        fullWidth
        multiline
        onClick={handleClickOpen}
        InputProps={{ readOnly: true }}
      />
      <Dialog open={open} keepMounted onClose={handleCloseDialog}>
        <DialogContent>
          {!isTagging ? (
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                {/* Post title */}
                <Grid item xs={12} display="flex" justifyContent="space-between">
                  <Typography variant="h5">Create Post</Typography>
                  <CloseIcon onClick={handleCloseDialog} />
                </Grid>
                <Grid item xs={12} display="flex" alignItems="center">
                  <Avatar alt="User" src={profile.avatar} />
                  <Typography variant="h6" sx={{ marginLeft: 2 }}>
                    {profile.name}
                  </Typography>
                </Grid>

                {/* Textarea for Content */}
                <Grid item xs={12}>
                  <TextField
                    id="content-textarea"
                    placeholder="What’s on your mind?"
                    fullWidth
                    multiline
                    rows={5}
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    name="content"
                    error={formik.touched.content && Boolean(formik.errors.content)}
                    helperText={formik.touched.content && formik.errors.content}
                  />
                </Grid>

                {/* Display Selected Image */}
                {selectedImage && (
                  <Grid item xs={12} textAlign="center">
                    <Box position="relative" display="inline-block">
                      <Avatar variant="rounded" src={selectedImage} alt="Selected Image" sx={{ width: 130, height: 130, margin: 'auto' }} />
                      //{' '}
                      <CloseIcon
                        onClick={handleRemoveImage}
                        sx={{
                          position: 'absolute',
                          top: -15,
                          right: -15,
                          cursor: 'pointer',
                          backgroundColor: '#ECECEC',
                          color: '#8E8E93',
                          borderRadius: '50px',
                          fontSize: '30px',
                          padding: '5px',
                          zIndex: 1
                        }}
                      />
                    </Box>
                  </Grid>
                )}

                {/* Image Upload and Tag User */}
                <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                  {/* Left side icons */}
                  <Box display="flex" alignItems="center">
                    <IconButton component="label">
                      <ImageUpload />
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </IconButton>

                    <IconButton onClick={handleTagUserClick}>
                      <UserTag />
                    </IconButton>
                  </Box>

                  {/* Right side Post button */}
                  <Button variant="contained" color="primary" type="submit" disabled={imageUploadStatus === 'uploading'}>
                    {imageUploadStatus === 'uploading' ? 'Uploading...' : 'Post'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          ) : (
            /* Tagging logic here */
            <Grid container spacing={2}>
              <Grid item xs={12} display="flex" justifyContent="space-between">
                <IconButton onClick={handleBackToPost}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6">Tag User</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField id="search-contact" placeholder="Search Contact" fullWidth variant="outlined" />
              </Grid>
              {/* Display Tagged Users */}
              {taggedUsers.length > 0 && (
                <Grid item xs={12}>
                  {taggedUsers.map((user: any) => (
                    <Box key={user.id} display="inline-flex" alignItems="center" sx={{ marginRight: 1 }}>
                      <Avatar src={user.avatar} alt={user.name} sx={{ width: 30, height: 30 }} />
                      <Typography sx={{ marginLeft: 1 }}>{user.name}</Typography>
                      <IconButton onClick={() => handleUntagUser(user.id)} sx={{ marginLeft: 1 }}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Grid>
              )}
              {/* Mock user list */}
              {mockUsers.map((user) => (
                <Grid item xs={12} key={user.id} display="flex" alignItems="center">
                  <Avatar src={user.avatar} alt={user.name} />
                  <Typography sx={{ marginLeft: 2 }}>{user.name}</Typography>
                  <Button variant="outlined" sx={{ marginLeft: 'auto' }} onClick={() => handleTagUser(user)}>
                    Tag
                  </Button>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ComposeDialog;

import { useState, ChangeEvent, useEffect } from 'react';
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
import { useMutation, useQuery } from '@apollo/client';
import ImageUpload from 'components/icons/imageupload';
import UserTag from 'components/icons/usertag';
import { handleFileUpload } from 'utils/image-upload';
import { CREATE_POST } from 'views/home/graphql';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { GET_IMAGE_URL, GET_ME } from 'graphql/queries';

// Mock user data
const mockUsers = [
  { id: 1, name: 'Albert', avatar: '/path-to-avatar1.png' },
  { id: 2, name: 'Jane Doe', avatar: '/path-to-avatar2.png' },
  { id: 3, name: 'John Smith', avatar: '/path-to-avatar3.png' }
];

type UserType = {
  id: number;
  name: string;
  avatar: string;
};

const ComposeDialog = () => {
  const [open, setOpen] = useState(false);
  const [isTagging, setIsTagging] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState<UserType[]>([]); // To store tagged users
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPostDisabled, setIsPostDisabled] = useState(true); // Track button disable state
  const dispatch = useDispatch();

  const { data: meData } = useQuery(GET_ME, { fetchPolicy: 'network-only' });
  const user = meData?.me;

  const { data: userAvatarData } = useQuery(GET_IMAGE_URL, {
    variables: { imageUrlKey: { key: user?.profile?.avatar } },
    skip: !user?.profile?.avatar
  });
  const userAvatarUrl = userAvatarData?.getImageUrl || '';

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
      content: Yup.string()
        .transform((value) => (value || '').trim())
        .max(1000, 'Content can’t exceed 1000 characters.')
        .nullable()
    }),
    onSubmit: async (values, { resetForm }) => {
      let imagePath = null;
      if (imageFile) {
        try {
          imagePath = await handleFileUpload(imageFile, {
            setImageUploadStatus: () => {},
            setImage: setImageFile,
            setSnackbarMessage: (msg) => console.log(msg),
            setSnackbarSeverity: () => {},
            setSnackbarOpen: () => {}
          });
        } catch (error) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Failed to upload image.',
              variant: 'alert',
              anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
              alert: { color: 'error' }
            })
          );
          return;
        }
      }

      try {
        const response = await createPost({
          variables: {
            createAdminPostInput: {
              title: values.content || null, // Set to null if no content
              image: imagePath || null, // Set to null if no image
              hashTags: [],
              postTags: []
            }
          }
        });

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
          resetForm();
          setSelectedImage(null);
          setImageFile(null);
          handleCloseDialog();
        }
      } catch (error: any) {
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

  // useEffect to enable/disable Post button
  useEffect(() => {
    setIsPostDisabled(!(formik.values.content.trim() || imageFile));
  }, [formik.values.content, imageFile]);

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
                <Grid item xs={12} display="flex" justifyContent="space-between">
                  <Typography variant="h5">Create Post</Typography>
                  <IconButton>
                    <CloseIcon onClick={handleCloseDialog} />
                  </IconButton>
                </Grid>
                <Grid item xs={12} display="flex" alignItems="center">
                  <Avatar alt="User" src={userAvatarUrl} />
                  <Typography variant="h6" sx={{ marginLeft: 2 }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id="content-textarea"
                    placeholder="What’s on your mind?"
                    fullWidth
                    multiline
                    rows={5}
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="content"
                    error={formik.touched.content && Boolean(formik.errors.content)}
                    helperText={formik.touched.content && formik.errors.content}
                    inputProps={{ maxLength: 1000 }} // Limit content to 1000 characters
                  />
                </Grid>

                {selectedImage && (
                  <Grid item xs={12} textAlign="center">
                    <Box position="relative" display="inline-block">
                      <Avatar variant="rounded" src={selectedImage} alt="Selected Image" sx={{ width: 130, height: 130, margin: 'auto' }} />
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

                <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <IconButton component="label">
                      <ImageUpload />
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </IconButton>

                    <IconButton onClick={handleTagUserClick}>
                      <UserTag />
                    </IconButton>
                  </Box>

                  <Button variant="contained" color="primary" type="submit" disabled={isPostDisabled}>
                    Post
                  </Button>
                </Grid>
              </Grid>
            </form>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} display="flex" justifyContent="space-between">
                  <IconButton onClick={handleBackToPost}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h5">Tag People</Typography>
                  <CloseIcon onClick={handleCloseDialog} />
                </Grid>

                {mockUsers.map((user) => (
                  <Grid key={user.id} item xs={12} display="flex" alignItems="center">
                    <Avatar alt={user.name} src={user.avatar} sx={{ marginRight: 2 }} />
                    <Typography variant="h6">{user.name}</Typography>
                    {taggedUsers.includes(user) ? (
                      <Button color="secondary" onClick={() => handleUntagUser(user.id)}>
                        Untag
                      </Button>
                    ) : (
                      <Button color="secondary" onClick={() => handleTagUser(user)}>
                        Tag
                      </Button>
                    )}
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ComposeDialog;

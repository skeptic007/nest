// import { useState, ChangeEvent } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogContent from '@mui/material/DialogContent';
// import Grid from '@mui/material/Grid';
// import IconButton from '@mui/material/IconButton';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import Avatar from '@mui/material/Avatar';
// import Box from '@mui/material/Box';
// import CloseIcon from '@mui/icons-material/Close';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import ImageUpload from 'components/icons/imageupload';
// import UserTag from 'components/icons/usertag';

// // Mock Users
// const mockUsers = [
//   { id: 1, name: 'Albert', avatar: '/path-to-avatar1.png' },
//   { id: 2, name: 'Jane Doe', avatar: '/path-to-avatar2.png' },
//   { id: 3, name: 'John Smith', avatar: '/path-to-avatar3.png' }
// ];

// const ComposeDialog = () => {
//   const [open, setOpen] = useState(false);
//   const [isTagging, setIsTagging] = useState(false); // For toggling screens
//   const [taggedUsers, setTaggedUsers] = useState([]); // To store tagged users
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const profile = {
//     name: 'John Doe',
//     avatar: 'assets/images/users/avatar-1.png'
//   };

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setOpen(false);
//   };

//   const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       const imageUrl = URL.createObjectURL(file);
//       setSelectedImage(imageUrl);
//     }
//   };

//   const handleRemoveImage = () => {
//     setSelectedImage(null);
//     setImageFile(null);
//   };

//   // Toggle between Post and Tag User screens
//   const handleTagUserClick = () => {
//     setIsTagging(true);
//   };

//   const handleBackToPost = () => {
//     setIsTagging(false);
//   };

//   // Handle selecting and unselecting users
//   const handleTagUser = (user: any) => {
//     if (!taggedUsers.includes(user)) {
//       setTaggedUsers([...taggedUsers, user]);
//     }
//   };

//   const handleUntagUser = (userId: number) => {
//     setTaggedUsers(taggedUsers.filter((user) => user.id !== userId));
//   };

//   const formik = useFormik({
//     initialValues: {
//       content: ''
//     },
//     validationSchema: Yup.object({
//       content: Yup.string().required('Content is required')
//     }),
//     onSubmit: (values) => {
//       console.log(values);
//       // Handle form submission and image upload logic
//     }
//   });

//   return (
//     <>
//       <TextField
//         id="outlined-textarea"
//         placeholder="What’s on your mind?"
//         fullWidth
//         multiline
//         onClick={handleClickOpen}
//         InputProps={{ readOnly: true }}
//       />
//       <Dialog open={open} keepMounted onClose={handleCloseDialog}>
//         <DialogContent>
//           {isTagging ? (
//             <Grid container spacing={2}>
//               <Grid item xs={12} display="flex" justifyContent="space-between">
//                 <IconButton onClick={handleBackToPost}>
//                   <ArrowBackIcon />
//                 </IconButton>
//                 <Typography variant="h6" color="secondary">
//                   Tag User
//                 </Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField id="search-contact" placeholder="Search Contact" fullWidth variant="outlined" />
//               </Grid>
//               {/* Display Tagged Users */}
//               {taggedUsers.length > 0 && (
//                 <Grid item xs={12}>
//                   {taggedUsers.map((user) => (
//                     <Box key={user.id} display="inline-flex" alignItems="center" sx={{ marginRight: 1 }}>
//                       <Avatar src={user.avatar} alt={user.name} sx={{ width: 30, height: 30 }} />
//                       <Typography sx={{ marginLeft: 1 }}>{user.name}</Typography>
//                       <IconButton onClick={() => handleUntagUser(user.id)} sx={{ marginLeft: 1 }}>
//                         <CloseIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   ))}
//                 </Grid>
//               )}
//               {/* Mock user list */}
//               {mockUsers.map((user) => (
//                 <Grid item xs={12} key={user.id} display="flex" alignItems="center">
//                   <Avatar src={user.avatar} alt={user.name} />
//                   <Typography sx={{ marginLeft: 2 }}>{user.name}</Typography>
//                   <Button variant="outlined" sx={{ marginLeft: 'auto' }} onClick={() => handleTagUser(user)}>
//                     Tag
//                   </Button>
//                 </Grid>
//               ))}
//             </Grid>
//           ) : (
//             <form onSubmit={formik.handleSubmit}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} display="flex" justifyContent="space-between">
//                   <Typography variant="h5">Create Post</Typography>

//                   <CloseIcon
//                     onClick={handleCloseDialog}
//                     sx={{
//                       cursor: 'pointer',
//                       backgroundColor: '#ECECEC',
//                       color: '#8E8E93',
//                       borderRadius: '50px',
//                       fontSize: '30px',
//                       padding: '5px',
//                       zIndex: 1
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} display="flex" alignItems="center">
//                   <Avatar alt={profile.name} src={profile.avatar} />
//                   <Typography variant="h6" sx={{ marginLeft: 2 }}>
//                     {profile.name}
//                   </Typography>
//                 </Grid>

//                 {/* Textarea for Content */}
//                 <Grid item xs={12}>
//                   <TextField
//                     id="content-textarea"
//                     placeholder="What’s on your mind?"
//                     fullWidth
//                     multiline
//                     rows={5}
//                     value={formik.values.content}
//                     onChange={formik.handleChange}
//                     name="content"
//                     error={formik.touched.content && Boolean(formik.errors.content)}
//                     helperText={formik.touched.content && formik.errors.content}
//                     sx={{ mb: 1 }}
//                   />
//                 </Grid>

//                 {/* Display Selected Image */}
//                 {selectedImage && (
//                   <Grid item xs={12} textAlign="center">
//                     <Box position="relative" display="inline-block">
//                       <Avatar variant="rounded" src={selectedImage} alt="Selected Image" sx={{ width: 130, height: 130, margin: 'auto' }} />
//                       <CloseIcon
//                         onClick={handleRemoveImage}
//                         sx={{
//                           position: 'absolute',
//                           top: -15,
//                           right: -15,
//                           cursor: 'pointer',
//                           backgroundColor: '#ECECEC',
//                           color: '#8E8E93',
//                           borderRadius: '50px',
//                           fontSize: '30px',
//                           padding: '5px',
//                           zIndex: 1
//                         }}
//                       />
//                     </Box>
//                   </Grid>
//                 )}

//                 {/* Image Upload and Tag User */}
//                 <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
//                   {/* Left side icons */}
//                   <Box display="flex" alignItems="center">
//                     <IconButton component="label" sx={{ mr: 1 }}>
//                       <ImageUpload />
//                       <input type="file" hidden accept="image/*" onChange={handleImageChange} />
//                     </IconButton>

//                     <IconButton onClick={handleTagUserClick}>
//                       <UserTag />
//                     </IconButton>
//                   </Box>

//                   {/* Right side Post button */}
//                   <Button variant="contained" color="primary" type="submit">
//                     Post
//                   </Button>
//                 </Grid>
//               </Grid>
//             </form>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default ComposeDialog;

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
import { handleFileUpload } from 'utils/image-upload'; // Assuming this is where the upload utility is
import { CREATE_POST } from 'views/home/graphql';

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

  // Apollo Mutation for creating the post

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

      // Call the file upload function and get the image path
      const path = await handleFileUpload(file, {
        setImageUploadStatus,
        setImage: setImageFile,
        setSnackbarMessage: (msg) => console.log(msg),
        setSnackbarSeverity: () => {},
        setSnackbarOpen: () => {}
      });

      if (path) {
        setImagePath(path);
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    setImagePath(null);
  };

  const handleTagUserClick = () => {
    setIsTagging(true);
  };

  const handleBackToPost = () => {
    setIsTagging(false);
  };

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
      if (!imagePath) {
        console.error('Image is required for the post');
        return;
      }

      try {
        // Send post data to the backend
        const response = await createPost({
          variables: {
            createAdminPostInput: {
              title: values.content,
              image: imagePath,
              hashTags: [],
              postTags: []
            }
          }
        });

        console.log('Post created:', response);
        // Handle success, maybe close the dialog or show a success message
        handleCloseDialog();
      } catch (error) {
        console.error('Error creating post:', error);
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

                  <CloseIcon
                    onClick={handleCloseDialog}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: '#ECECEC',
                      color: '#8E8E93',
                      borderRadius: '50px',
                      fontSize: '30px',
                      padding: '5px',
                      zIndex: 1
                    }}
                  />
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
                    sx={{ mb: 1 }}
                  />
                </Grid>

                {/* Display Selected Image */}
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

                {/* Image Upload and Tag User */}
                <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                  {/* Left side icons */}
                  <Box display="flex" alignItems="center">
                    <IconButton component="label" sx={{ mr: 1 }}>
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
                <Typography variant="h6" color="secondary">
                  Tag User
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField id="search-contact" placeholder="Search Contact" fullWidth variant="outlined" />
              </Grid>
              {/* Display Tagged Users */}
              {taggedUsers.length > 0 && (
                <Grid item xs={12}>
                  {taggedUsers.map((user) => (
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

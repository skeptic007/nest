'use client';

import { useState, forwardRef, ChangeEvent } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

// third-party
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});
import 'react-quill/dist/quill.snow.css';

// assets
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImageIcon from '@mui/icons-material/Image';
import TagIcon from '@mui/icons-material/Tag';

// transition animation

const ComposeDialog = () => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const profile = {
    name: 'John Doe',
    avatar: 'assets/images/users/avatar-1.png' // Static path to user avatar (you can replace with an actual image path)
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const formik = useFormik({
    initialValues: {
      content: ''
    },
    validationSchema: Yup.object({
      content: Yup.string().required('Content is required')
    }),
    onSubmit: (values) => {
      console.log(values);
      // Handle form submission and image upload logic
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
        {open && (
          <DialogContent>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} display="flex" justifyContent="space-between">
                  <Typography variant="h5">Create Post</Typography>
                  <IconButton onClick={handleCloseDialog}>
                    <HighlightOffTwoToneIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={12} display="flex" alignItems="center">
                  <Avatar alt={profile.name} src={profile.avatar} />
                  <Typography variant="h6" sx={{ marginLeft: 2 }}>
                    {profile.name}
                  </Typography>
                </Grid>

                {/* Quill Editor for Content */}
                <Grid item xs={12}>
                  <ReactQuill
                    theme="snow"
                    value={formik.values.content}
                    placeholder="What’s on your mind?"
                    onChange={(value) => formik.setFieldValue('content', value)}
                    style={{ height: '150px', marginBottom: '40px' }}
                  />
                  {formik.touched.content && formik.errors.content && (
                    <Typography color="error" variant="body2">
                      {formik.errors.content}
                    </Typography>
                  )}
                </Grid>

                {/* Display Selected Image */}
                {selectedImage && (
                  <Grid item xs={12} textAlign="center">
                    <Avatar variant="rounded" src={selectedImage} alt="Selected Image" sx={{ width: 200, height: 200, margin: 'auto' }} />
                  </Grid>
                )}
                {/* Image Upload */}
                <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                  {/* Upload Image Icon */}
                  <IconButton component="label">
                    <ImageIcon />
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </IconButton>

                  {/* Tag Icon */}
                  <IconButton>
                    <TagIcon />
                  </IconButton>

                  {/* Post Button */}
                  <Button variant="contained" color="primary" type="submit">
                    Post
                  </Button>
                </Grid>

                {/* Submit Button */}
              </Grid>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default ComposeDialog;

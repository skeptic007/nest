// components/home/WhatsOnYourMind.tsx
'use client';

import React from 'react';
import TextField from '@mui/material/TextField';

const CreatePost = () => {
  return <TextField id="outlined-textarea" placeholder="What’s on your mind?" rows={4} fullWidth multiline />;
};

export default CreatePost;

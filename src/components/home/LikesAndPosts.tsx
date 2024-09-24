// components/home/LikesAndPosts.tsx
'use client';

import React from 'react';
import { Grid, Typography, Box, Divider } from '@mui/material';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import RecentActorsTwoToneIcon from '@mui/icons-material/RecentActorsTwoTone';
import { alpha, useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';


const LikesAndPosts = () => {
  const theme = useTheme();
  const sideAvatarSX = {
    borderRadius: '8px',
    width: 48,
    height: 48,
    fontSize: '1.5rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: theme.palette.mode === 'dark' ? '1px solid' : 'none',
    '&>svg': {
      width: 24,
      height: 24
    }
  };

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Box
                sx={{
                  ...sideAvatarSX,
                  bgcolor: alpha(theme.palette.primary.dark, 0.1),
                  border: theme.palette.mode === 'dark' ? '1px solid' : 'none',
                  borderColor: 'primary.main',
                  color: 'primary.dark'
                }}
              >
                <PeopleAltTwoToneIcon />
              </Box>
            </Grid>
            <Grid item xs>
              <Typography variant="h3" color="primary" sx={{ mb: 0.625 }}>
                239k
              </Typography>
              <Typography variant="body2">Posts</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ margin: '16px 0' }} />
          <Grid container alignItems="center" spacing={2}>
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
            <Grid item xs>
              <Typography variant="h3" sx={{ mb: 0.625, color: theme.palette.mode === 'dark' ? 'text.secondary' : 'secondary.main' }}>
                234k
              </Typography>
              <Typography variant="body2">Likes</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default LikesAndPosts;

// components/home/PinnedEvents.tsx
'use client';

import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import { useTheme } from '@mui/material/styles';

const PinnedEvents = () => {
  const theme = useTheme();
  const cardStyle = {
    bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50',
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.100'
  };

  return (
    <SubCard title="Pinned Events">
      <Card sx={cardStyle}>
        <CardMedia component="img" image="/assets/images/cards/card-1.jpg" title="Card 1" />
        <CardContent>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <Typography variant="subtitle1">Sunday Vibes</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">With supporting text below as a natural lead-in to additional content.</Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container>
            <Grid item>
              <Typography variant="subtitle1">Jan 1, 2025 | Kupondole</Typography>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </SubCard>
  );
};

export default PinnedEvents;

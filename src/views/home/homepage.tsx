'use client';

import React from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import UpcomingEvents from 'components/home/UpcomingEvents';
import LikesAndPosts from 'components/home/LikesAndPosts';
import PinnedEvents from 'components/home/PinnedEvents';
import EventCalendar from 'components/home/EventCalendar';
import CreatePostPopup from 'components/home/CreatePost';
import PostList from 'components/home/PostList';

// ==============================|| Home page||============================== //

const HomePage = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} sm={12} md={8}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <CreatePostPopup />
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <PostList />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={4}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <LikesAndPosts />
          </Grid>
          <Grid item xs={12}>
            <PinnedEvents />
          </Grid>
          <Grid item xs={12}>
            <UpcomingEvents />
          </Grid>
          <Grid item xs={12}>
            <EventCalendar />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;

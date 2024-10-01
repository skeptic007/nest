'use client';

import Link from 'next/link';

// material-ui
import { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from 'components/authentication/AuthWrapper1';
import AuthCardWrapper from 'components/authentication/AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AuthLogin from 'components/authentication/auth-forms/AuthLogin';
import BackgroundPattern1 from 'ui-component/cards/BackgroundPattern1';
import AuthSlider from 'ui-component/cards/AuthSlider';

// types
import { AuthSliderProps } from 'types';

// assets
const AuthBlueCard = '/assets/images/auth/image.svg';
const AuthPurpleCard = '/assets/images/auth/image1.svg';
const SampleSVG = '/assets/images/auth/image3.svg'; // Path to your SVG file

// carousel items
const items: AuthSliderProps[] = [
  {
    title: 'Welcome To EbSPace',
    description: 'This is EbSpace Web Application',
    image: SampleSVG // Add the SVG image here
  },
  {
    title: 'Customizable and Responsive',
    description: 'Easily adjustable components for your needs',
    image: AuthBlueCard // Existing images can still be used
  },
  {
    title: 'Modern Design Patterns',
    description: 'Follow the latest trends in web design',
    image: AuthPurpleCard // Existing images can still be used
  }
];

// ================================|| AUTH1 - LOGIN ||================================ //

const Login = () => {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ minHeight: '100vh' }}>
        <Grid item container justifyContent="center" md={6} lg={7} sx={{ my: 3 }}>
          <AuthCardWrapper>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Grid
                  container
                  direction={{ xs: 'column', md: 'column' }} // Keep it as a column for all sizes
                  alignItems="center" // Center items vertically
                  justifyContent="center" // Center items horizontally
                >
                  {/* Logo Section */}
                  <Grid item>
                    <Link href="#" aria-label="theme-logo">
                      <Logo />
                    </Link>
                  </Grid>

                  {/* Welcome Text Section */}
                  <Grid item>
                    <Stack justifyContent="center" textAlign="center">
                      <Typography color="secondary.main" gutterBottom variant={downMD ? 'h3' : 'h2'}>
                        Hi, Welcome Back
                      </Typography>
                      <Typography color="textPrimary" gutterBottom variant="h4">
                        Login in to your account
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <AuthLogin loginProp={1} />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Grid container justifyContent="center">
                  <Typography component={Link} href="/register" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                    Don&apos;t have an account? Register
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </AuthCardWrapper>
        </Grid>
        <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
          <BackgroundPattern1>
            <Grid item container alignItems="flex-end" justifyContent="center" spacing={3}>
              <Grid item xs={12}>
                <span />
                <Box
                  sx={{
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      top: '32%',
                      left: '40%',
                      width: 313,
                      backgroundSize: 380,
                      height: 280,
                      backgroundImage: `url(${AuthPurpleCard})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      animation: '15s wings ease-in-out infinite'
                    },
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: '23%',
                      left: '37%',
                      width: 243,
                      height: 210,
                      backgroundSize: 380,
                      backgroundImage: `url(${AuthBlueCard})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      animation: '15s wings ease-in-out infinite',
                      animationDelay: '1s'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid item container justifyContent="center" sx={{ pb: 8 }}>
                  <Grid item xs={10} lg={8} sx={{ '& .slick-list': { pb: 2 } }}>
                    <AuthSlider items={items} /> {/* Pass updated items to AuthSlider */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </BackgroundPattern1>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;

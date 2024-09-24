'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';

// material-ui
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import { TextField, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// constants
import { FORGOT_PASSWORD, INVALID_LOGIN_CREDENTIAL, SIGN_IN_NOW } from '../constants';
// import useSuccErrSnack from 'hooks/useSuccErrSnack';
// import { generateDeviceId } from 'utils/deviceid.helper';

// ===============================|| EMAIL/PASSWORD LOGIN ||=============================== //

const JWTLogin = () => {
  const router = useRouter();
  const theme = useTheme();
  const { status, data, update } = useSession();
  // const { errorSnack, successSnack } = useSuccErrSnack();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required().label('Email'),
        password: Yup.string().max(255).required().label('Password')
      })}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
          const res = await signIn('credentials', {
            email: values.email,
            password: values.password,
            // deviceId: generateDeviceId(),
            redirect: false
          });

          if (res?.ok && res?.status === 200) {
            alert('Login successful');
            return;
          } else {
            // alert(res?.error?.includes(':') ? res.error.split(':')[1] : 'invalid credential');
            alert(res?.error?.includes(':') ? res.error.split(':')[1] : INVALID_LOGIN_CREDENTIAL);
          }
        } catch (error) {
          // errorSnack(INVALID_LOGIN_CREDENTIAL);
          alert(INVALID_LOGIN_CREDENTIAL);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container gap={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="email">Email</InputLabel>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                <TextField
                  fullWidth
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item>
              <Typography
                variant="body1"
                fontWeight={500}
                component={Link}
                href={'/forgot-password'}
                color="primary"
                sx={{ textDecoration: 'none' }}
              >
                {/* Forget Password */}
                {FORGOT_PASSWORD}
              </Typography>
            </Grid>
          </Grid>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: '34px' }}>
            <LoadingButton
              loading={isSubmitting}
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              className="gradient"
            >
              {/* sign in now */}
              {SIGN_IN_NOW}
            </LoadingButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;

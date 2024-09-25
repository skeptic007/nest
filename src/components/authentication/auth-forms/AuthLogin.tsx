'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';

// Material-UI
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
// import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import { TextField, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Correctly import useRouter

// Constants
import { FORGOT_PASSWORD, INVALID_LOGIN_CREDENTIAL, SIGN_IN_NOW } from '../constants';

type AuthLoginProps = {
  loginProp?: number;
};
const JWTLogin = (props: AuthLoginProps) => {
  // const { loginProp } = props;
  // const JWTLogin = (loginProp: AuthLoginProps) => {
  //   const { loginNumber } = loginProp;
  const router = useRouter(); // Use useRouter for navigation
  const theme = useTheme();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/home'); // Navigate to dashboard if authenticated
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
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .matches(
            /^[a-zA-Z0-9._%+-]+@ebpearls\.com(\.au)?$/,
            'Please enter an official email address ending with @ebpearls.com or @ebpearls.com.au'
          )
          .required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
          const res = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false // Handle routing manually
          });

          if (res?.ok && res?.status === 200) {
            alert('Login successful');
            router.push('/home'); // Navigate to home on successful login
            return;
          } else {
            alert(res?.error?.includes(':') ? res.error.split(':')[1] : INVALID_LOGIN_CREDENTIAL);
          }
        } catch (error) {
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
                {/* <InputLabel htmlFor="email">Email</InputLabel> */}
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
                {/* <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel> */}
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
              {SIGN_IN_NOW}
            </LoadingButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;

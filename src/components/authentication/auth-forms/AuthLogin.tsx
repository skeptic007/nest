'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Material-UI
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { TextField, useTheme, IconButton, Snackbar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Import visibility icons

// Constants
import { FORGOT_PASSWORD, INVALID_LOGIN_CREDENTIAL, SIGN_IN_NOW } from '../constants';

type AuthLoginProps = {
  loginProp?: number;
};

const JWTLogin = (props: AuthLoginProps) => {
  const router = useRouter(); 
  const theme = useTheme();
  const { status } = useSession();
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar visibility

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/home'); 
    }
  }, [status, router]);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
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
              redirect: false 
            });

            if (res?.ok && res?.status === 200) {
              setSnackbarOpen(true); // Show Snackbar on successful login
              setTimeout(() => {
                router.push('/home'); // Redirect after a brief delay
              }, 2000); // Adjust delay as needed
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
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'} // Toggle password visibility
                    placeholder="Password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <Visibility /> : <VisibilityOff />} 
                        </IconButton>
                      ),
                    }}
                  />
                  {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} textAlign="center"> {/* Centered links */}
                <Typography
                  variant="body1"
                  fontWeight={500}
                  component={Link}
                  href={'/forgot-password'}
                  color="primary"
                  sx={{ textDecoration: 'none', mr: 2 }} // Margin for spacing
                >
                  {FORGOT_PASSWORD}
                </Typography>
                {/* <Typography
                  variant="body1"
                  fontWeight={500}
                  component={Link}
                  href={'/register'}
                  color="primary"
                  sx={{ textDecoration: 'none' }} // Margin for spacing
                >
                  Don't have an account?
                </Typography> */}
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

      {/* Snackbar for login success */}
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message="Login successful!"
        autoHideDuration={2000} // Adjust duration as needed
      />
    </>
  );
};

export default JWTLogin;

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
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { gql, useMutation } from '@apollo/client';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
// Constants
import { FORGOT_PASSWORD, INVALID_LOGIN_CREDENTIAL, SIGN_IN_NOW } from '../constants';

type AuthLoginProps = {
  loginProp?: number;
};

const LOGOUT_MUTATION = gql`
  mutation Logout($logoutOfAllDevice: Boolean!, $refreshToken: String!) {
    logout(logoutOfAllDevice: $logoutOfAllDevice, refreshToken: $refreshToken) {
      message
    }
  }
`;

const JWTLogin = (props: AuthLoginProps) => {
  const router = useRouter();
  const theme = useTheme();
  const { status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);
  const refreshToken = 'your-refresh-token'; // Replace with actual refresh token
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLogoutClick = () => {
    setOpenDialog(true); // Open the confirmation dialog
  };

  const handleConfirmLogout = async (logoutOfAllDevice: boolean) => {
    setIsLoading(true);
    try {
      // Call GraphQL logout mutation
      await logoutMutation({
        variables: {
          logoutOfAllDevice,
          refreshToken
        }
      });

      // Clear localStorage and call next-auth signOut
      localStorage.clear();
      await signOut({ callbackUrl: '/login' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setOpenDialog(false); // Close the dialog after the operation
    }
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
              setSnackbarMessage('Login successful!');
              setSnackbarOpen(true);
              setTimeout(() => {
                router.push('/home');
              }, 2000);
              return;
            } else {
              setSnackbarMessage(res?.error?.includes(':') ? res.error.split(':')[1] : INVALID_LOGIN_CREDENTIAL);
              setSnackbarOpen(true);
            }
          } catch (error) {
            setSnackbarMessage(INVALID_LOGIN_CREDENTIAL);
            setSnackbarOpen(true);
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
                    label="Email" // Accessibility improvement
                  />
                  {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Password" // Accessibility improvement
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      )
                    }}
                  />
                  {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} textAlign="center">
                <Typography
                  variant="body1"
                  fontWeight={500}
                  component={Link}
                  href={'/forgot-password'}
                  color="primary"
                  sx={{ textDecoration: 'none', mr: 2 }}
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

      <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} message={snackbarMessage} autoHideDuration={2000} />
    </>
  );
};

export default JWTLogin;

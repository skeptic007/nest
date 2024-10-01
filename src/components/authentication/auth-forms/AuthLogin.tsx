'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CryptoJS from 'crypto-js';

// Material-UI
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { TextField, Checkbox, FormControlLabel, IconButton, Snackbar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Visibility, VisibilityOff } from '@mui/icons-material';
// import { UserRole, EmailStatus } from '../../../store/slices/auth';
// import { useDispatch } from 'react-redux';
// import { setLoginState } from '../../../store/slices/auth';
// Constants
import { FORGOT_PASSWORD, INVALID_LOGIN_CREDENTIAL, SIGN_IN_NOW } from '../constants';
import { httpLink } from '../../../../apollo.config';

const SECRET_KEY: string = process.env.NEXT_PUBLIC_SECRET_KEY || 'default_secret_key';

type AuthLoginProps = {
  loginProp?: number;
};

const JWTLogin = (props: AuthLoginProps) => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [rememberMeEmail, setRememberMeEmail] = useState('');

  // Load encrypted credentials on component mount
  useEffect(() => {
    const encryptedEmail = localStorage.getItem('email');
    if (encryptedEmail) {
      try {
        const decryptedEmail = CryptoJS.AES.decrypt(encryptedEmail, SECRET_KEY).toString(CryptoJS.enc.Utf8);
        setRememberMeEmail(decryptedEmail);
        setRememberMe(true);
      } catch (error) {
        console.error('Error decrypting credentials:', error);
      }
    }
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

  return (
    <>
      <Formik
        initialValues={{
          email: rememberMeEmail,
          password: '',
          submit: null
        }}
        enableReinitialize
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
            console.log(httpLink, 'httpLink');
            let res = await signIn('email-login', {
              email: values.email,
              password: values.password,
              redirect: false,
              // callbackUrl: '/home'
            });
            console.log('response===>', res);
            if (res?.ok && res?.status === 200) {
              console.log('🚀 ~ onSubmit={ ~ res:', res);
              if (rememberMe) {
                const encryptedEmail = CryptoJS.AES.encrypt(values.email, SECRET_KEY).toString();
                localStorage.setItem('email', encryptedEmail);
              } else {
                localStorage.removeItem('email');
              }

              setSnackbarMessage('Login successful!');
              // const { user } = res.data.login;
              setSnackbarOpen(true);

              // Dispatch user information to Redux
              // dispatch(
              //   setLoginState({
              //     isLoggedIn: true,
              //     accessToken,
              //     refreshToken,
              //     user: {
              //       ...user,
              //       profile: {
              //         avatar: user.profile.avatar
              //       }
              //     }
              //   })
              // );

              // If "Remember Me" is checked, store encrypted credentials
              if (rememberMe) {
                const encryptedEmail = CryptoJS.AES.encrypt(values.email, SECRET_KEY).toString();
                const encryptedPassword = CryptoJS.AES.encrypt(values.password, SECRET_KEY).toString();

                localStorage.setItem('email', encryptedEmail);
                localStorage.setItem('password', encryptedPassword);
              } else {
                localStorage.removeItem('email');
                localStorage.removeItem('password');
              }

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
        {({ errors, handleBlur, handleChange, handleSubmit, setValues, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container gap={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Email"
                  />
                  {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Password"
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
              <Grid item xs={12}>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <FormControlLabel control={<Checkbox checked={rememberMe} onChange={handleRememberMeChange} />} label="Remember me" />
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
              </Grid>
            </Grid>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: '34px' }}>
              <LoadingButton loading={isSubmitting} disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
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

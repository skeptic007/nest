'use client';

import { Grid } from '@mui/material';
import pageRoutes from 'constants/routes';
import { UserAccountStatus } from 'constants/user';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// types
import { GuardProps } from 'types';
import Loader from 'ui-component/Loader';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Function to set access and refresh tokens in local storage
 * @param {string} accessToken
 * @param {string} refreshToken
 */
const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

/**
 * Authentication guard for routes
 * @param {GuardProps} children children element/node
 */
const AuthGuard = ({ children }: GuardProps) => {
  const { status, data } = useSession();
  console.log('🚀 ~ AuthGuard ~ status:', status);
  console.log('🚀 ~ AuthGuard ~ data:', data);
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthentication = () => {
      if (status === 'authenticated') {
        const payload = data?.user as any;

        // Check if the user is verified
        if (payload?.user?.status === UserAccountStatus.email_verified || payload?.user?._id) {
          setTokens(payload.access_token, payload.refresh_token);

          // Redirect to dashboard if trying to access login/register pages
          if (
            pathname === pageRoutes.login ||
            pathname === pageRoutes.register ||
            pathname === pageRoutes.forgotPassword ||
            pathname === pageRoutes.verifyRegistration ||
            pathname === pageRoutes.verifyRegistrationPhone
          ) {
            router.replace(pageRoutes.dashboard);
          }
        }
      } else if (status === 'unauthenticated') {
        // Redirect to login if the user is unauthenticated
        router.replace(pathname === '/register' ? pathname : pageRoutes.login);
      }

      // Stop loading after authentication handling
      setIsLoading(false);
    };

    handleAuthentication();
  }, [status, data, router, pathname]);

  // Show loading spinner while checking authentication
  return isLoading ? (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
      <Loader />
    </Grid>
  ) : (
    children
  );
};

export default AuthGuard;

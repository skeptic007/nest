import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation registerUser($input: SignupInput!) {
    registerUser(body: $input) {
      message

      expiry {
        expiresBy

        expiresAt
      }

      user {
        _id

        email

        status
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      refreshToken
      mfaEnabled
      user {
        _id

        adminApproveStatus

        email

        authProvider

        authProviderId

        countryCode

        createdAt

        firstName

        lastName

        mfaEnabled

        middleName

        permission

        phoneNumber

        role

        status

        theme

        updatedAt
      }
    }
  }
`;

//variable

// {

// "loginInput": {

// "email": "",

// "password": ""

// }

// }

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
    }
  }
`;

// {

// "refreshToken":

// }
export const GET_IMAGE_URL = gql`
  query Query($imageUrlKey: ImageUrlKey!) {
    getImageUrl(imageUrlKey: $imageUrlKey)
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation forgotPassword($body: ForgotPasswordInput!) {
    forgotPassword(body: $body) {
      message

      expiry {
        expiresAt

        expiresBy
      }
    }
  }
`;

export const VERIFY_FORGOT_PASSWORD_OTP_MUTATION = gql`
  mutation verifyResetPasswordOTP($body: VerifyResetPasswordOtpInput!) {
    verifyResetPasswordOTP(body: $body) {
      message
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($body: VerifyEmailInput!) {
    verifyEmail(body: $body) {
      message

      expiry {
        expiresAt

        expiresBy
      }

      token {
        accessToken

        accessTokenExpiresIn

        refreshToken

        refreshTokenExpiresIn
      }

      user {
        _id

        email

        status
      }
    }
  }
`;

export const RESEND_VERIFY_EMAIL_OTP_MUTATION = gql`
  mutation resendVerifyEmailOtp($body: EmailSignupOTPInput!) {
    resendVerifyEmailOtp(body: $body) {
      expiry {
        expiresAt

        expiresBy
      }

      message
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($body: ResetPasswordInput!) {
    resetPassword(body: $body) {
      message
    }
  }
`;

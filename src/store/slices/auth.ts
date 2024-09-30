// third-party
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';

// Define types
export enum EmailStatus {
  email_verification_pending = 'email_verification_pending',
  email_verified = 'email_verified'
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export type User = {
  id: string;
  email: string;
  status: EmailStatus;
  firstName: string;
  middleName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  role: UserRole;
  profile: {
    avatar: string;
  };
};

type LoginState = {
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
  user: User | null;
};

type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
};

// Initial state
const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  accessToken: null,
  refreshToken: null
};

// Create the auth slice
const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginState(state, action: PayloadAction<LoginState>) {
      const { isLoggedIn, accessToken, refreshToken, user } = action.payload;
      state.isLoggedIn = isLoggedIn;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload; // Only update the user object
    },
    logout(state) {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    }
  }
});

// Persisted reducer configuration
const persistedReducer = persistReducer(
  {
    key: 'auth',
    storage: storage
  },
  slice.reducer
);

// Export reducer
export default persistedReducer;

// Export actions
export const { setLoginState, logout, updateUser } = slice.actions;

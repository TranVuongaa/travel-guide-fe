import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {googleLoginService, loginService, registerService} from '@/lib/api/auth';
import {normalizeAppError} from '@/lib/api/errors';

import type {AppError} from '@/lib/api/errors';
import type {LoginInput, OAuthCodeInput, RegisterInput, User} from '@/lib/api/contracts';

type AuthState = {
  user: User | null;
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  error: AppError | null;
};

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk<User, LoginInput, {rejectValue: AppError}>(
  'auth/login',
  async (input, {rejectWithValue}) => {
    try {
      return (await loginService(input)).user;
    } catch (error) {
      return rejectWithValue(normalizeAppError(error));
    }
  },
);

export const register = createAsyncThunk<User, RegisterInput, {rejectValue: AppError}>(
  'auth/register',
  async (input, {rejectWithValue}) => {
    try {
      return (await registerService(input)).user;
    } catch (error) {
      return rejectWithValue(normalizeAppError(error));
    }
  },
);

export const loginWithGoogle = createAsyncThunk<User, OAuthCodeInput, {rejectValue: AppError}>(
  'auth/google',
  async (input, {rejectWithValue}) => {
    try {
      return (await googleLoginService(input)).user;
    } catch (error) {
      return rejectWithValue(normalizeAppError(error));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionCleared: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    userChanged: (state, action: {payload: User}) => {
      state.user = action.payload;
      state.status = 'authenticated';
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? normalizeAppError(action.error);
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? normalizeAppError(action.error);
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? normalizeAppError(action.error);
      });
  },
});

export const {clearAuthError, sessionCleared, userChanged} = authSlice.actions;
export const authReducer = authSlice.reducer;

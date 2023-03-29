import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { authAPI } from 'api/todolist-api'
import { FieldErrorType, LoginParamsType, ResultCode } from 'api/types'
import { appActions } from 'features/CommonActions/App'
import { handleAsyncServerAppError, handleAsyncServerNetworkError } from 'utils/error-utils'

const { setAppStatus } = appActions

export const login = createAsyncThunk<
  undefined,
  LoginParamsType,
  { rejectValue: { errors: Array<string>; fieldsErrors?: Array<FieldErrorType> } }
>('auth/login', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
  try {
    const res = await authAPI.login(param)

    if (res.data.resultCode === ResultCode.SUCCESS) {
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))

      return
    } else {
      return handleAsyncServerAppError(res.data, thunkAPI)
    }
  } catch (error: any) {
    return handleAsyncServerNetworkError(error, thunkAPI)
  }
})

export const logout = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
  try {
    const res = await authAPI.logout()

    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))

      return
    } else {
      return handleAsyncServerAppError(res.data, thunkAPI)
    }
  } catch (error: any) {
    return handleAsyncServerNetworkError(error, thunkAPI)
  }
})

export const asyncActions = {
  login,
  logout,
}

export const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = false
      })
  },
})

export const authReducer = slice.reducer
export const { setIsLoggedIn } = slice.actions

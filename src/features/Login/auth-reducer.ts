import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { authAPI, FieldErrorType, LoginType, ResultCode } from 'api/todolist-api'
import { setStatusAC } from 'app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'

export const loginTC = createAsyncThunk<
  undefined,
  LoginType,
  { rejectValue: { errors: Array<string>; fieldsErrors?: Array<FieldErrorType> } }
>('auth/login', async (param, thunkAPI) => {
  thunkAPI.dispatch(setStatusAC({ status: 'loading' }))
  try {
    const res = await authAPI.login(param)

    if (res.data.resultCode === ResultCode.SUCCESS) {
      thunkAPI.dispatch(setStatusAC({ status: 'succeeded' }))

      return
    } else {
      handleServerAppError(thunkAPI.dispatch, res.data)

      return thunkAPI.rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      })
    }
  } catch (error: any) {
    handleServerNetworkError(thunkAPI.dispatch, error)

    return thunkAPI.rejectWithValue({ errors: [error.message], fieldsErrors: undefined })
  }
})

export const logOutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
  thunkAPI.dispatch(setStatusAC({ status: 'loading' }))
  try {
    const res = await authAPI.logOut()

    if (res.data.resultCode === ResultCode.SUCCESS) {
      thunkAPI.dispatch(setStatusAC({ status: 'succeeded' }))

      return
    } else {
      handleServerAppError(thunkAPI.dispatch, res.data)

      return thunkAPI.rejectWithValue({})
    }
  } catch (e) {
    // @ts-ignore
    handleServerNetworkError(dispatch, e)

    return thunkAPI.rejectWithValue({})
  }
})

const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC(state: any, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    },
  },
  extraReducers: builder => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = true
    })
    builder.addCase(logOutTC.fulfilled, (state, action) => {
      state.isLoggedIn = false
    })
  },
})

export const authReducer = slice.reducer
export const { setIsLoggedInAC } = slice.actions

// thunks

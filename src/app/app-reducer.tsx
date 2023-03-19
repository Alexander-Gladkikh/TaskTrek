import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { authAPI, ResultCode } from 'api/todolist-api'
import { setIsLoggedInAC } from 'features/Login/auth-reducer'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export const initializeAppTC = createAsyncThunk(
  'app/initializeApp',
  async (param, { dispatch }) => {
    dispatch(setStatusAC({ status: 'loading' }))
    const res = await authAPI.me()

    if (res.data.resultCode === ResultCode.SUCCESS) {
      dispatch(setIsLoggedInAC({ value: true }))

      dispatch(setStatusAC({ status: 'succeeded' }))
    }

    return
  }
)

const slice = createSlice({
  name: 'app',
  initialState: {
    isInitialized: false,
    status: 'loading' as RequestStatusType,
    error: null as null | string,
  },
  reducers: {
    setStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setErrorAC(state, action: PayloadAction<{ error: null | string }>) {
      state.error = action.payload.error
    },
  },
  extraReducers: builder => {
    builder.addCase(initializeAppTC.fulfilled, state => {
      state.isInitialized = true
    })
  },
})

export const appReducer = slice.reducer
export const { setStatusAC, setErrorAC } = slice.actions

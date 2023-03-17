import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'

import { authAPI, LoginType, ResultCode } from 'api/todolist-api'
import { setIsInitializedAC, setStatusAC } from 'app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'

const initialState = {
  isLoggedIn: false,
}

const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state: any, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    },
  },
})

export const authReducer = slice.reducer
export const { setIsLoggedInAC } = slice.actions

// thunks
export const loginTC = (data: LoginType) => async (dispatch: Dispatch) => {
  dispatch(setStatusAC({ status: 'loading' }))
  try {
    const res = await authAPI.login(data)

    if (res.data.resultCode === ResultCode.SUCCESS) {
      dispatch(setIsLoggedInAC({ value: true }))
      dispatch(setStatusAC({ status: 'succeeded' }))
    } else {
      handleServerAppError(dispatch, res.data)
    }
  } catch (e) {
    // @ts-ignore
    handleServerNetworkError(dispatch, e)
  }
}

export const logOutTC = () => async (dispatch: Dispatch) => {
  dispatch(setStatusAC({ status: 'loading' }))
  try {
    const res = await authAPI.logOut()

    if (res.data.resultCode === ResultCode.SUCCESS) {
      dispatch(setIsLoggedInAC({ value: false }))
      dispatch(setStatusAC({ status: 'succeeded' }))
    } else {
      handleServerAppError(dispatch, res.data)
    }
  } catch (e) {
    // @ts-ignore
    handleServerNetworkError(dispatch, e)
  }
}

export const meTC = () => async (dispatch: Dispatch) => {
  dispatch(setStatusAC({ status: 'loading' }))
  try {
    const res = await authAPI.me()

    if (res.data.resultCode === ResultCode.SUCCESS) {
      dispatch(setIsLoggedInAC({ value: true }))

      dispatch(setStatusAC({ status: 'succeeded' }))
    } else {
      handleServerAppError(dispatch, res.data)
    }
  } catch (e) {
    // @ts-ignore
    handleServerNetworkError(dispatch, e)
  } finally {
    dispatch(setIsInitializedAC({ isInitialized: true }))
  }
}

// types

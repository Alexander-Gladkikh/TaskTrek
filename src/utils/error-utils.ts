import { Dispatch } from 'redux'

import { ResponseType } from 'api/todolist-api'
import { setErrorAC, setStatusAC } from 'app/app-reducer'

export const handleServerNetworkError = (dispatch: Dispatch, error: string) => {
  dispatch(setErrorAC({ error: error }))
  dispatch(setStatusAC({ status: 'failed' }))
}

export const handleServerAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
  if (data.messages.length) {
    dispatch(setErrorAC({ error: data.messages[0] }))
  } else {
    dispatch(setErrorAC({ error: 'Some error' }))
  }
}

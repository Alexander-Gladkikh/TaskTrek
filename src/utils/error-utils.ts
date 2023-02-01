import {AppActionsType, setError, SetErrorType, setStatus} from "../app/app-reducer";
import {ResponseType} from '../api/todolist-api'
import {Dispatch} from "redux";

export const handleServerNetworkError = (dispatch: Dispatch<AppActionsType>, error: string) => {
    dispatch(setError(error))
    dispatch(setStatus('failed'))
}

export const handleServerAppError = <T>(dispatch: Dispatch<SetErrorType>, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(setError(data.messages[0]))
    }
    else {
        dispatch(setError('Some error'))
    }
}
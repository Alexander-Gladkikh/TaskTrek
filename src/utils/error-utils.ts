import {
  AppActionsType,
  setErrorAC,
  SetErrorType,
  setStatusAC,
} from "app/app-reducer";
import { ResponseType } from "api/todolist-api";
import { Dispatch } from "redux";

export const handleServerNetworkError = (
  dispatch: Dispatch<AppActionsType>,
  error: string
) => {
  dispatch(setErrorAC(error));
  dispatch(setStatusAC("failed"));
};

export const handleServerAppError = <T>(
  dispatch: Dispatch<SetErrorType>,
  data: ResponseType<T>
) => {
  if (data.messages.length) {
    dispatch(setErrorAC(data.messages[0]));
  } else {
    dispatch(setErrorAC("Some error"));
  }
};

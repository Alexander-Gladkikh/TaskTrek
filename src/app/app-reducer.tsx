import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  isInitialized: false,
  status: "loading" as RequestStatusType,
  error: null as null | string,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status;
    },
    setErrorAC(state, action: PayloadAction<{ error: null | string }>) {
      state.error = action.payload.error;
    },
    setIsInitializedAC(
      state,
      action: PayloadAction<{ isInitialized: boolean }>
    ) {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export const appReducer = slice.reducer;
export const { setStatusAC, setErrorAC, setIsInitializedAC } = slice.actions;

// export const setStatusAC = (status: RequestStatusType) =>
//   ({ type: "APP/SET-STATUS", status } as const);
// export const setErrorAC = (error: null | string) =>
//   ({ type: "APP/SET-ERROR", error } as const);
// export const setIsInitializedAC = (isInitialized: boolean) =>
//   ({ type: "APP/SET-IS-INITIALIZED", isInitialized } as const);
//
// export type SetStatusType = ReturnType<typeof setStatusAC>;
// export type SetErrorType = ReturnType<typeof setErrorAC>;
// export type setIsInitializedType = ReturnType<typeof setIsInitializedAC>;
// export type InitialStateType = typeof initialState;
//
// export type AppActionsType =
//   | SetStatusType
//   | SetErrorType
//   | setIsInitializedType;

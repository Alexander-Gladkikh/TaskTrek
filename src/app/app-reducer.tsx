import {createSlice} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    isInitialized: false,
    status: 'loading' as RequestStatusType,
    error: null as null | string
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {

    }
})

export const appReducer = slice.reducer


export const _appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

export const setStatusAC = (status:RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setErrorAC = (error:null | string) => ({type: 'APP/SET-ERROR', error} as const)
export const setIsInitializedAC = (isInitialized:boolean) => ({type: 'APP/SET-IS-INITIALIZED', isInitialized} as const)

export type SetStatusType = ReturnType<typeof setStatusAC>
export type SetErrorType = ReturnType<typeof setErrorAC>
export type setIsInitializedType = ReturnType<typeof setIsInitializedAC>
export type InitialStateType = typeof initialState

export type AppActionsType = SetStatusType | SetErrorType | setIsInitializedType

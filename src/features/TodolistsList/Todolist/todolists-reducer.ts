import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { Dispatch } from 'redux'

import { ResultCode, todolistAPI, TodolistType } from 'api/todolist-api'
import { RequestStatusType, setStatusAC } from 'app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'

const initialState: TodolistDomainType[] = []

export type FilterValueType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValueType
  entityStatus: RequestStatusType
}

const slice = createSlice({
  name: 'todolist',
  initialState: initialState,
  reducers: {
    removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId)

      if (index > -1) {
        state.splice(index, 1)
      }
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.push({
        ...action.payload.todolist,
        filter: 'all',
        entityStatus: 'idle',
      })
    },
    changeTodolisTitletAC(state, action: PayloadAction<{ id: string; title: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)

      state[index].title = action.payload.title
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string; filter: FilterValueType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)

      state[index].filter = action.payload.filter
    },
    setTodolists(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
      return action.payload.todolists.map(tl => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle',
      }))
    },
    changeTodolistsEntityStatusAC(
      state,
      action: PayloadAction<{
        todolistId: string
        entityStatus: RequestStatusType
      }>
    ) {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId)

      state[index].entityStatus = action.payload.entityStatus
    },
  },
})

export const todolistsReducer = slice.reducer
export const {
  removeTodolistAC,
  changeTodolistFilterAC,
  changeTodolistsEntityStatusAC,
  addTodolistAC,
  changeTodolisTitletAC,
  setTodolists,
} = slice.actions

// thunks
export const getTodolistTC = () => (dispatch: Dispatch) => {
  dispatch(setStatusAC({ status: 'loading' }))
  todolistAPI.getTodolist().then(res => {
    dispatch(setTodolists(res.data))
    dispatch(setStatusAC({ status: 'succeeded' }))
  })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setStatusAC({ status: 'loading' }))
  dispatch(changeTodolistsEntityStatusAC({ todolistId, entityStatus: 'loading' }))
  todolistAPI
    .deleteTodolist(todolistId)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(removeTodolistAC({ todolistId }))
        dispatch(setStatusAC({ status: 'succeeded' }))
      }
    })

    .catch((error: AxiosError<{ message: string }>) => {
      const err = error.response ? error.response.data.message : error.message

      handleServerNetworkError(dispatch, err)
      dispatch(changeTodolistsEntityStatusAC({ todolistId, entityStatus: 'idle' }))
    })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(setStatusAC({ status: 'loading' }))
  todolistAPI
    .createTodolist(title)
    .then(res => {
      if (res.data.resultCode === ResultCode.SUCCESS) {
        dispatch(addTodolistAC({ todolist: res.data.data.item }))
        dispatch(setStatusAC({ status: 'succeeded' }))
      } else {
        handleServerAppError<{ item: TodolistType }>(dispatch, res.data)
      }
    })
    .catch(e => {
      handleServerAppError(dispatch, e.message)
    })
}

export const changeTodolistTitleTC =
  (newTitle: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC({ status: 'loading' }))
    todolistAPI.updateTodolist(todolistId, newTitle).then(() => {
      dispatch(changeTodolisTitletAC({ id: todolistId, title: newTitle }))
      dispatch(setStatusAC({ status: 'succeeded' }))
    })
  }

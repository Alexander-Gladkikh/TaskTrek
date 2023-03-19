import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'

import { ResultCode, todolistAPI, TodolistType } from 'api/todolist-api'
import { RequestStatusType, setStatusAC } from 'app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'

export type FilterValueType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValueType
  entityStatus: RequestStatusType
}

export const getTodolistTC = createAsyncThunk(
  'todolists/getTodolist',
  async (param, { dispatch, rejectWithValue }) => {
    dispatch(setStatusAC({ status: 'loading' }))
    const res = await todolistAPI.getTodolist()

    try {
      dispatch(setStatusAC({ status: 'succeeded' }))

      return { todolists: res.data }
    } catch (e) {
      // @ts-ignore
      handleServerNetworkError(dispatch, e)

      return rejectWithValue(null)
    }
  }
)

export const removeTodolistTC = createAsyncThunk(
  'todolists/removeTodolist',
  async (todolistId: string, { dispatch, rejectWithValue }) => {
    dispatch(setStatusAC({ status: 'loading' }))
    dispatch(changeTodolistsEntityStatusAC({ todolistId: todolistId, entityStatus: 'loading' }))
    const res = await todolistAPI.deleteTodolist(todolistId)

    try {
      if (res.data.resultCode === 0) {
        dispatch(setStatusAC({ status: 'succeeded' }))

        return { todolistId }
      } else {
        return rejectWithValue(null)
      }
    } catch (e) {
      // @ts-ignore
      handleServerNetworkError(dispatch, e)
      dispatch(changeTodolistsEntityStatusAC({ todolistId, entityStatus: 'idle' }))

      return rejectWithValue(null)
    }
  }
)

export const addTodolistTC = createAsyncThunk(
  'todolists/addTodolist',
  async (title: string, { dispatch, rejectWithValue }) => {
    dispatch(setStatusAC({ status: 'loading' }))
    const res = await todolistAPI.createTodolist(title)

    try {
      if (res.data.resultCode === ResultCode.SUCCESS) {
        dispatch(setStatusAC({ status: 'succeeded' }))

        return { todolist: res.data.data.item }
      } else {
        handleServerAppError<{ item: TodolistType }>(dispatch, res.data)

        return rejectWithValue(null)
      }
    } catch (e) {
      // @ts-ignore
      handleServerAppError(dispatch, e.message)

      return rejectWithValue(null)
    }
  }
)

export const changeTodolistTitleTC = createAsyncThunk(
  'todolists/changeTodolistTitleTC',
  async (param: { newTitle: string; todolistId: string }, { dispatch, rejectWithValue }) => {
    dispatch(setStatusAC({ status: 'loading' }))
    await todolistAPI.updateTodolist(param.todolistId, param.newTitle)

    dispatch(setStatusAC({ status: 'succeeded' }))

    return { id: param.todolistId, title: param.newTitle }
  }
)

const slice = createSlice({
  name: 'todolist',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string; filter: FilterValueType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)

      state[index].filter = action.payload.filter
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
  extraReducers: builder => {
    builder.addCase(getTodolistTC.fulfilled, (state, action) => {
      return action.payload.todolists.map(tl => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle',
      }))
    })
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId)

      if (index > -1) {
        state.splice(index, 1)
      }
    })
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      state.unshift({
        ...action.payload.todolist,
        filter: 'all',
        entityStatus: 'idle',
      })
    })
    builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)

      state[index].title = action.payload.title
    })
  },
})

export const todolistsReducer = slice.reducer
export const { changeTodolistFilterAC, changeTodolistsEntityStatusAC } = slice.actions

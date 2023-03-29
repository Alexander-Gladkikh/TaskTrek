import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { todolistAPI } from 'api/todolist-api'
import { ResultCode, TodolistType } from 'api/types'
import { RequestStatusType } from 'features/Application/application-reducer'
import { appActions } from 'features/CommonActions/App'
import { handleAsyncServerAppError, handleAsyncServerNetworkError } from 'utils/error-utils'
import { ThunkError } from 'utils/types'

const { setAppStatus } = appActions

export const fetchTodolists = createAsyncThunk<
  { todolists: TodolistType[] },
  undefined,
  ThunkError
>('todolists/fetchTodolist', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: 'loading' }))

  try {
    const res = await todolistAPI.getTodolist()

    thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))

    return { todolists: res.data }
  } catch (error: any) {
    return handleAsyncServerNetworkError(error, thunkAPI)
  }
})

export const removeTodolist = createAsyncThunk<{ id: string }, string, ThunkError>(
  'todolists/removeTodolist',
  async (todolistId: string, thunkAPI) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
    try {
      //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
      thunkAPI.dispatch(
        changeTodolistsEntityStatus({ todolistId: todolistId, entityStatus: 'loading' })
      )
      const res = await todolistAPI.deleteTodolist(todolistId)

      //скажем глобально приложению, что асинхронная операция завершена
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))

      return { id: todolistId }
    } catch (error: any) {
      return handleAsyncServerNetworkError(error, thunkAPI)
    }
  }
)

export const addTodolist = createAsyncThunk<{ todolist: TodolistType }, string, ThunkError>(
  'todolists/addTodolist',
  async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
    try {
      const res = await todolistAPI.createTodolist(title)

      if (res.data.resultCode === ResultCode.SUCCESS) {
        thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))

        return { todolist: res.data.data.item }
      } else {
        return handleAsyncServerAppError(res.data, thunkAPI, false)
      }
    } catch (error: any) {
      return handleAsyncServerNetworkError(error, thunkAPI, false)
    }
  }
)

export const changeTodolistTitle = createAsyncThunk(
  'todolists/changeTodolistTitleTC',
  async (param: { newTitle: string; todolistId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
    try {
      const res = await todolistAPI.updateTodolist(param.todolistId, param.newTitle)

      if (res.data.resultCode === ResultCode.SUCCESS) {
        thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))

        return { id: param.todolistId, title: param.newTitle }
      } else {
        return handleAsyncServerAppError(res.data, thunkAPI)
      }
    } catch (error: any) {
      return handleAsyncServerNetworkError(error, thunkAPI, false)
    }
  }
)

export const asyncActions = {
  fetchTodolists,
  removeTodolist,
  addTodolist,
  changeTodolistTitle,
}

export const slice = createSlice({
  name: 'todolist',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<{ id: string; filter: FilterValueType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)

      state[index].filter = action.payload.filter
    },
    changeTodolistsEntityStatus(
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
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }))
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id)

        if (index > -1) {
          state.splice(index, 1)
        }
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id)

        state[index].title = action.payload.title
      })
  },
})

export const { changeTodolistFilter, changeTodolistsEntityStatus } = slice.actions

export type FilterValueType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValueType
  entityStatus: RequestStatusType
}

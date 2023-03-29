import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { asyncActions as asyncTodolistsActions } from './todolists-reducer'

import { taskAPI } from 'api/todolist-api'
import { ResultCode, TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType } from 'api/types'
import { appActions } from 'features/CommonActions/App'
import { handleAsyncServerAppError, handleAsyncServerNetworkError } from 'utils/error-utils'
import { AppRootStateType, ThunkError } from 'utils/types'

const initialState: TasksStateType = {}

export const fetchTasks = createAsyncThunk<
  { tasks: TaskType[]; todolistId: string },
  string,
  ThunkError
>('tasks/getTasks', async (todolistId: string, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: 'loading' }))
  try {
    const res = await taskAPI.getTask(todolistId)
    const tasks = res.data.items

    thunkAPI.dispatch(appActions.setAppStatus({ status: 'succeeded' }))

    return { tasks, todolistId }
  } catch (error: any) {
    return handleAsyncServerNetworkError(error, thunkAPI)
  }
})

export const removeTask = createAsyncThunk<
  { taskId: string; todolistId: string },
  { taskId: string; todolistId: string },
  ThunkError
>('tasks/removeTask', async (param, thunkAPI) => {
  await taskAPI.deleteTask(param.todolistId, param.taskId)

  return { taskId: param.taskId, todolistId: param.todolistId }
})

export const addTask = createAsyncThunk<
  TaskType,
  { title: string; todolistId: string },
  ThunkError
>('tasks/addTask', async (param, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: 'loading' }))

  try {
    const res = await taskAPI.createTask(param.todolistId, param.title)

    if (res.data.resultCode === ResultCode.SUCCESS) {
      thunkAPI.dispatch(appActions.setAppStatus({ status: 'succeeded' }))

      return res.data.data.item
    } else {
      handleAsyncServerAppError(res.data, thunkAPI, false)

      return thunkAPI.rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      })
    }
  } catch (error: any) {
    return handleAsyncServerNetworkError(error, thunkAPI, false)
  }
})

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (
    param: { todolistId: string; taskId: string; model: UpdateDomainTaskModelType },
    thunkAPI
  ) => {
    thunkAPI.dispatch(appActions.setAppStatus({ status: 'loading' }))
    const state = thunkAPI.getState() as AppRootStateType

    // @ts-ignore
    const task = state.tasks[param.todolistId].find((t: TaskType) => t.id === param.taskId)

    if (!task) {
      return thunkAPI.rejectWithValue('task not found in the state')
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...param.model,
    }

    const res = await taskAPI.updateTask(param.todolistId, param.taskId, apiModel)

    try {
      if (res.data.resultCode === ResultCode.SUCCESS) {
        thunkAPI.dispatch(appActions.setAppStatus({ status: 'succeeded' }))

        return param
      } else {
        thunkAPI.dispatch(appActions.setAppStatus({ status: 'failed' }))

        return handleAsyncServerAppError(res.data, thunkAPI)
      }
    } catch (error: any) {
      return handleAsyncServerNetworkError(error, thunkAPI)
    }
  }
)

export const asyncActions = {
  fetchTasks,
  removeTask,
  addTask,
  updateTask,
}

export const slice = createSlice({
  name: 'task',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(asyncTodolistsActions.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(asyncTodolistsActions.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(asyncTodolistsActions.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl: any) => {
          state[tl.id] = []
        })
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex(t => t.id === action.payload.taskId)

        if (index > -1) {
          tasks.splice(index, 1)
        }
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift(action.payload)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex(t => t.id === action.payload.taskId)

        if (index > -1) {
          tasks[index] = { ...tasks[index], ...action.payload.model }
        }
      })
  },
})

export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

export type TasksStateType = {
  [key: string]: TaskType[]
}

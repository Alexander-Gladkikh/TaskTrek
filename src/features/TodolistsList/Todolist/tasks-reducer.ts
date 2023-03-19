import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { addTodolistTC, getTodolistTC, removeTodolistTC } from './todolists-reducer'

import {
  ResultCode,
  taskAPI,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  UpdateTaskModelType,
} from 'api/todolist-api'
import { TasksStateType } from 'app/App'
import { setStatusAC } from 'app/app-reducer'
import { AppRootStateType } from 'app/store'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'

const initialState: TasksStateType = {}

export const getTasksTC = createAsyncThunk(
  'tasks/getTasks',
  async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setStatusAC({ status: 'loading' }))

    const res = await taskAPI.getTask(todolistId)
    const tasks = res.data.items

    thunkAPI.dispatch(setStatusAC({ status: 'succeeded' }))

    return { tasks, todolistId }
  }
)

export const removeTaskTC = createAsyncThunk(
  'tasks/removeTask',
  async (param: { todolistId: string; taskId: string }, thunkAPI) => {
    await taskAPI.deleteTask(param.todolistId, param.taskId)

    return { taskId: param.taskId, todolistId: param.todolistId }
  }
)

export const addTaskTC = createAsyncThunk(
  'tasks/addTask',
  async (param: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
    dispatch(setStatusAC({ status: 'loading' }))

    try {
      const res = await taskAPI.createTask(param.todolistId, param.title)

      if (res.data.resultCode === ResultCode.SUCCESS) {
        dispatch(setStatusAC({ status: 'succeeded' }))

        return res.data.data.item
      } else {
        handleServerAppError<{ item: TaskType }>(dispatch, res.data)
        dispatch(setStatusAC({ status: 'failed' }))

        return rejectWithValue(null)
      }
    } catch (e) {
      // @ts-ignore
      handleServerNetworkError(dispatch, e)

      return rejectWithValue(null)
    }
  }
)

export const updateTaskTC = createAsyncThunk(
  'tasks/updateTask',
  async (
    param: { todolistId: string; taskId: string; model: UpdateDomainTaskModelType },
    { dispatch, rejectWithValue, getState }
  ) => {
    dispatch(setStatusAC({ status: 'loading' }))
    const state = getState() as AppRootStateType
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)

    if (!task) {
      return rejectWithValue('task not found in the state')
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
        dispatch(setStatusAC({ status: 'succeeded' }))

        return param
      } else {
        handleServerAppError(dispatch, res.data)
        dispatch(setStatusAC({ status: 'failed' }))

        return rejectWithValue(null)
      }
    } catch (e) {
      // @ts-ignore
      handleServerNetworkError(dispatch, e)

      return rejectWithValue(null)
    }
  }
)

const slice = createSlice({
  name: 'task',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      delete state[action.payload.todolistId]
    })
    builder.addCase(getTodolistTC.fulfilled, (state, action) => {
      action.payload.todolists.forEach(tl => {
        state[tl.id] = []
      })
    })
    builder.addCase(getTasksTC.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks
    })
    builder.addCase(removeTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)

      if (index > -1) {
        tasks.splice(index, 1)
      }
    })
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      state[action.payload.todoListId].unshift(action.payload)
    })
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)

      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model }
      }
    })
  },
})

export const tasksReducer = slice.reducer

export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

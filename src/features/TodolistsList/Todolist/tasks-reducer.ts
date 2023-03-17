import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { Dispatch } from 'redux'

import { addTodolistAC, removeTodolistAC, setTodolists } from './todolists-reducer'

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

const slice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    removeTaskAC(state, action: PayloadAction<{ taskId: string; todolistId: string }>) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)

      if (index > -1) {
        tasks.splice(index, 1)
      }
    },
    addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    },
    updateTaskAC(
      state,
      action: PayloadAction<{
        taskId: string
        model: UpdateDomainTaskModelType
        todolistId: string
      }>
    ) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)

      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model }
      }
    },
    setTasksAC(state, action: PayloadAction<{ tasks: TaskType[]; todolistId: string }>) {
      state[action.payload.todolistId] = action.payload.tasks
    },
  },
  extraReducers: builder => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.todolistId]
    })
    builder.addCase(setTodolists, (state, action) => {
      action.payload.todolists.forEach(tl => {
        state[tl.id] = []
      })
    })
  },
})

export const tasksReducer = slice.reducer
export const { removeTaskAC, setTasksAC, updateTaskAC, addTaskAC } = slice.actions

export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setStatusAC({ status: 'loading' }))
  taskAPI.getTask(todolistId).then(res => {
    dispatch(setTasksAC({ tasks: res.data.items, todolistId }))
    dispatch(setStatusAC({ status: 'succeeded' }))
  })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
  dispatch(setStatusAC({ status: 'loading' }))
  taskAPI
    .deleteTask(todolistId, taskId)
    .then(res => {
      if (res.data.resultCode === ResultCode.SUCCESS) {
        dispatch(removeTaskAC({ taskId, todolistId }))
        dispatch(setStatusAC({ status: 'succeeded' }))
      }
    })
    .catch(e => {
      console.log(e.message)
    })
}

export const addTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
  dispatch(setStatusAC({ status: 'loading' }))
  const res = await taskAPI.createTask(todolistId, title)

  try {
    if (res.data.resultCode === ResultCode.SUCCESS) {
      dispatch(addTaskAC({ task: res.data.data.item }))
      dispatch(setStatusAC({ status: 'succeeded' }))
    } else {
      handleServerAppError<{ item: TaskType }>(dispatch, res.data)
      dispatch(setStatusAC({ status: 'failed' }))
    }
  } catch (e) {
    if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
      const error = e.response ? e.response.data.message : e.message

      handleServerNetworkError(dispatch, error)
    }
  }
}

export const updateTaskTC =
  (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
  (dispatch: Dispatch, getState: () => AppRootStateType) => {
    dispatch(setStatusAC({ status: 'loading' }))
    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)

    if (!task) {
      //throw new Error("task not found in the state");
      console.warn('task not found in the state')

      return
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    }

    taskAPI
      .updateTask(todolistId, taskId, apiModel)
      .then(res => {
        if (res.data.resultCode === ResultCode.SUCCESS) {
          const action = updateTaskAC({ taskId, model: domainModel, todolistId })

          dispatch(action)
          dispatch(setStatusAC({ status: 'succeeded' }))
        } else {
          handleServerAppError<{ item: TaskType }>(dispatch, res.data)
          dispatch(setStatusAC({ status: 'failed' }))
        }
      })
      .catch((error: AxiosError<{ message: string }>) => {
        const err = error.response ? error.response.data.message : error.message

        handleServerNetworkError(dispatch, err)
      })
  }

export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

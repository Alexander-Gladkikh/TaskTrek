import {
  asyncActions as tasksAsyncActions,
  slice as tasksSlice,
} from 'features/TodolistsList/tasks-reducer'
import { TodolistsList } from 'features/TodolistsList/Todolists'
import {
  asyncActions as todolistsAsyncActions,
  slice as todolistsSlice,
} from 'features/TodolistsList/todolists-reducer'

const todolistsActions = {
  ...todolistsAsyncActions,
  ...todolistsSlice.actions,
}
const tasksActions = {
  ...tasksAsyncActions,
  ...tasksSlice.actions,
}

const todolistsReducer = todolistsSlice.reducer
const tasksReducer = tasksSlice.reducer

export { tasksActions, todolistsActions, TodolistsList, todolistsReducer, tasksReducer }

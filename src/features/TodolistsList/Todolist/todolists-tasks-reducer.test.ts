import { TodolistType } from 'api/todolist-api'
import { TasksStateType } from 'app/App'
import { tasksReducer } from 'features/TodolistsList/Todolist/tasks-reducer'
import {
  addTodolistTC,
  TodolistDomainType,
  todolistsReducer,
} from 'features/TodolistsList/Todolist/todolists-reducer'

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState: Array<TodolistDomainType> = []

  let todolist: TodolistType = {
    title: 'new todolist',
    id: 'any id',
    addedDate: '',
    order: 0,
  }

  const action = addTodolistTC.fulfilled({ todolist: todolist }, 'requestId', todolist.title)

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})

import axios from 'axios'
import {
  GetTasksResponse,
  LoginParamsType,
  ResponseType,
  TaskType,
  TodolistType,
  UpdateTaskModelType,
  UserType
} from "api/types";

const settings = {
  withCredentials: true,
  headers: {
    'API-KEY': '88732962-7d6b-4220-9742-a71d3b763549',
  },
}

const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  ...settings
})

export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<ResponseType<{ userId?: number }>>('auth/login', data)
  },
  logOut() {
    return instance.delete<ResponseType<{ userId?: number }>>('auth/login')
  },
  me() {
    return instance.get<ResponseType<UserType>>('auth/me')
  },
}

export const todolistAPI = {
  getTodolist() {
    return instance.get<TodolistType[]>('/todo-lists')
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', { title })
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`/todo-lists/${id}`)
  },
  updateTodolist(id: string, title: string) {
    return instance.put<ResponseType>(`/todo-lists/${id}`, { title })
  },
}

export const taskAPI = {
  getTask(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask(todolistId: string, taskTitle: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, {
      title: taskTitle,
    })
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<ResponseType<TaskType>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}



import axios, {AxiosResponse} from "axios"

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type ResponseType<D> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export enum ResultCode {
    SUCCESS = 0,
    ERROR = 1,
    CAPTCHA = 10
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': '88732962-7d6b-4220-9742-a71d3b763549'
    },

})

export type LoginType = {
    email: string
    password: string
    rememberMe:  boolean
    captcha?: string
}

export type UserType = {
    id: number
    email: string
    login: string
}

export const authAPI = {
    login(data: LoginType) {
        return instance.post<LoginType,  AxiosResponse<ResponseType<{userId: number}>>>('auth/login', data)
    },
    logOut() {
        return instance.delete('auth/login')
    },
    me() {
        return instance.get<ResponseType<UserType>>('auth/me');
    }
}
export const todolistAPI = {
    getTodolist() {       //<ResponseType<[]>>
        return instance.get('/todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TodolistType }>>>('todo-lists', {title});
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType<{}>>(`/todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<{ title: string }, AxiosResponse<ResponseType<any>>>(
            `/todo-lists/${todolistId}`,
            {title}
        )
    }
}

export const taskAPI = {
    getTask(todolistId: string) {
        return instance.get(`/todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post(`/todo-lists/${todolistId}/tasks`, {title: title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },                                                     // UpdateTaskModuleType
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
}
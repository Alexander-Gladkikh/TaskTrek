import axios from "axios"

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
    status: number
    priority: number
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

export const todolistAPI = {
    getTodolist() {       //<ResponseType<[]>>
        const promise = instance.get('/todo-lists')
        return promise
    },
    createTodolist(title: string) {
        const promise = instance.post<ResponseType<{ item: TodolistType }>>('/todo-lists',
            {title: title}
        )
        return promise
    },
    deleteTodolist(todolistId: string) {
        const promise = instance.delete<ResponseType<{}>>(`/todo-lists/${todolistId}`)
        return promise
    },
    updateTodolist(todolistId: string, title: string) {
        const promise = instance.put<ResponseType<{}>>(
            `/todo-lists/${todolistId}`,
            {title: title}
        )
        return promise
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
    updateTaskTitle(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, {model})
    }
}
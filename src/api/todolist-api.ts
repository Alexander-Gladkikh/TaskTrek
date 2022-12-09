import axios from "axios"

type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}

export type ResponseType<D> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}





const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': '88732962-7d6b-4220-9742-a71d3b763549'
    },

})

export const todolistAPI = {
    getTodolist() {
        const promise = instance.get<ResponseType<{}>>('/todo-lists')
        return promise
    },
    createTodolist(title: string) {
        const promise = instance.post<ResponseType<{item: TodolistType}>>('/todo-lists',
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
    getTask(todolistId:string){
       return instance.get(`/todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId:string, title: string){
        return instance.post(`/todo-lists/${todolistId}/tasks`, {title:title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTaskTitle(todolistId: string, taskId: string, title: string) {
        return instance.put(`/todo-lists/${todolistId}/tasks/${taskId}`, {title: title})
    }
}
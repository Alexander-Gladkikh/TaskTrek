import {FilterValueType, TasksStateType, TodolistType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>



 type ActionType = RemoveTaskActionType | AddTaskActionType |
     ChangeTaskStatusActionType | ChangeTaskTitleActionType |
     AddTodolistActionType | RemoveTodolistActionType
// меня вызовут и дадут мне стейт (почти всегда объект)
// и инструкцию (action, тоже объект)
// согласно прописанному type в этом action (инструкции) я поменяю state


export const tasksReducer = (state: TasksStateType, action: ActionType) => {

    switch (action.type) {
        case "REMOVE-TASK":
           return {
               ...state,
               [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)
           }
        case "ADD-TASK":
            return {
                ...state,
                [action.todolistId]:[{id: v1(), title: action.title, isDone: false},...state[action.todolistId]]
            }
        case "CHANGE-TODOLIST-TITLE":
            return {
                ...state,
                [action.todolistId]:[...state[action.todolistId].map(task => task.id === action.taskId ? {...task, isDone: action.isDone} : task)]
            }
        case "CHANGE-TASK-TITLE":
            return {
                ...state,
                [action.todolistId]:[...state[action.todolistId].map(task => task.id === action.taskId ? {...task, title: action.title} : task)]
            }
        case "ADD-TODOLIST":
            return {
                ...state,
                [action.todolistId]: []
            }
        case "REMOVE-TODOLIST":
            let copyState = {...state}
            delete copyState[action.id]
            return copyState

        default:
            throw new Error('I don\'t understand this type')
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: "REMOVE-TASK", taskId, todolistId} as const
}
export const addTaskAC = (title: string, todolistId: string)  => {
    return {type: "ADD-TASK", title, todolistId} as const
}
export const changeTaskStatusAC = (taskId: string, isDone:boolean, todolistId: string) => {
    return {type: "CHANGE-TODOLIST-TITLE", taskId, isDone,todolistId} as const
}
export const changeTaskTitleAC = (taskId: string, title:string, todolistId: string)  => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId} as const
}





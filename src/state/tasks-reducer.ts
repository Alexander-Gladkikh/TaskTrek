import {FilterValueType, TasksStateType, TodolistType} from "../AppWidthRedux";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType, setTodolistsActionType} from "./todolists-reducer";
import {Dispatch} from "redux";
import {taskAPI, todolistAPI} from "../api/todolist-api";
import {TaskType} from "../TodoList";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
export type setTasksActionType = ReturnType<typeof setTasksAC>




 type ActionType = RemoveTaskActionType | AddTaskActionType |
     ChangeTaskStatusActionType | ChangeTaskTitleActionType |
     AddTodolistActionType | RemoveTodolistActionType | setTodolistsActionType |
     setTasksActionType
// меня вызовут и дадут мне стейт (почти всегда объект)
// и инструкцию (action, тоже объект)
// согласно прописанному type в этом action (инструкции) я поменяю state

const initialState: TasksStateType = {}


export const tasksReducer = (state: TasksStateType = initialState, action: ActionType) => {

    switch (action.type) {
        case "REMOVE-TASK": {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)
            }
        }
        case "ADD-TASK": {
            return {
                ...state,
                [action.todolistId]: [{id: v1(), title: action.title, isDone: false}, ...state[action.todolistId]]
            }
        }
        case "CHANGE-TASK-STATUS": {
            return {
                ...state,
                [action.todolistId]: [...state[action.todolistId].map(task => task.id === action.taskId ? {
                    ...task,
                    isDone: action.isDone
                } : task)]
            }
        }
        case "CHANGE-TASK-TITLE": {
            return {
                ...state,
                [action.todolistId]: [...state[action.todolistId].map(task => task.id === action.taskId ? {
                    ...task,
                    title: action.title
                } : task)]
            }
        }
        case "ADD-TODOLIST": {
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case "REMOVE-TODOLIST": {
            let copyState = {...state}
            delete copyState[action.todolistId]
            return copyState
        }
        case "SET-TODOS": {
            let copyState = {...state}
            action.todolists.forEach((tl) => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case "SET-TASKS": {
            return {
                ...state,
                [action.todolistId]: action.tasks
            }
        }

        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: "REMOVE-TASK", taskId, todolistId} as const
}
export const addTaskAC = (title: string, todolistId: string)  => {
    return {type: "ADD-TASK", title, todolistId} as const
}
export const changeTaskStatusAC = (taskId: string, isDone:boolean, todolistId: string) => {
    return {type: "CHANGE-TASK-STATUS", taskId, isDone,todolistId} as const
}
export const changeTaskTitleAC = (taskId: string, title:string, todolistId: string)  => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId} as const
}

export const setTasksAC = (tasks: TaskType[], todolistId:string) => {
    return {type: 'SET-TASKS', tasks, todolistId} as const
}

export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    taskAPI.getTask(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
        })
}





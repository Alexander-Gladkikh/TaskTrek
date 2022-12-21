import {FilterValueType, TasksStateType, TodolistType} from "../AppWidthRedux";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType, setTodolistsActionType} from "./todolists-reducer";
import {Dispatch} from "redux";
import {taskAPI, todolistAPI} from "../api/todolist-api";
import {TaskType} from "../TodoList";
import {AppRootStateType} from "./store";

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
                [action.task.todolistId]: [action.task, ...state[action.task.todolistId]]
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
                         // TaskType
export const addTaskAC = (task: any)  => {
    return {type: "ADD-TASK", task} as const
}                                                   // UpdateModalType
export const changeTaskStatusAC = (taskId: string, isDone:any, todolistId: string) => {
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

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    taskAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            console.log(res.data.resultCode)
            if(res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
            }
        })
        .catch((e) => {
        console.log(e.message)
    })
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    taskAPI.createTask(todolistId, title)
        .then((res) => {
            dispatch(addTaskAC(res.data.data.item))
        })
}                                                                //TaskStatus
export const updateTaskTC = (todolistId: string, taskId: string, status: any) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find((t) => t.id === taskId)

    if(task) {
        // UpdateModalType
        const model = {
            title: task.title,
            deadline: task.deadline,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            status: status
        }
        taskAPI.updateTaskTitle(todolistId, taskId, model)
            .then((res) => {
                dispatch(changeTaskStatusAC(taskId, res.data.data.item.status, todolistId))
            })
    }

}





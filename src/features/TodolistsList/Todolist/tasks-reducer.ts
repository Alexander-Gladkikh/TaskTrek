import {AddTodolistActionType, RemoveTodolistActionType, setTodolistsActionType} from "./todolists-reducer";
import {Dispatch} from "redux";
import {
    ResultCode,
    taskAPI,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    UpdateTaskModelType
} from "../../../api/todolist-api";
import {AppRootStateType} from "../../../app/store";
import {TasksStateType} from "../../../app/App";
import {setErrorAC, SetErrorType, setStatusAC, SetStatusType} from "../../../app/app-reducer";
import axios, {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type setTasksActionType = ReturnType<typeof setTasksAC>
export type updateTaskActionType = ReturnType<typeof updateTaskAC>


type ActionType = RemoveTaskActionType | AddTaskActionType |
    AddTodolistActionType | RemoveTodolistActionType | setTodolistsActionType |
    setTasksActionType | updateTaskActionType | SetStatusType | SetErrorType
// меня вызовут и дадут мне стейт (почти всегда объект)
// и инструкцию (action, тоже объект)
// согласно прописанному type в этом action (инструкции) я поменяю state

const initialState: TasksStateType = {}


export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {

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
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        }
        case "UPDATE-TASK": {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        }
        case "ADD-TODOLIST": {
            return {
                ...state,
                [action.todolist.id]: []
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

export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: "REMOVE-TASK", taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: "ADD-TASK", task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const setTasksAC = (tasks: TaskType[], todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)




export const getTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatusAC('loading'))
    taskAPI.getTask(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
            dispatch(setStatusAC('succeeded'))
        })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatusAC('loading'))
    taskAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            if (res.data.resultCode === ResultCode.SUCCESS) {
                dispatch(removeTaskAC(taskId, todolistId))
                dispatch(setStatusAC('succeeded'))
            }
        })
        .catch((e) => {
            console.log(e.message)

        })
}

export const addTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatusAC('loading'))
    const res = await taskAPI.createTask(todolistId, title)

    try {
        if (res.data.resultCode === ResultCode.SUCCESS) {
            dispatch(addTaskAC(res.data.data.item))
            dispatch(setStatusAC('succeeded'))
        }
        else {
            handleServerAppError<{item: TaskType}>(dispatch, res.data)
            dispatch(setStatusAC('failed'))
        }
    } catch (e) {
        if(axios.isAxiosError<AxiosError<{message: string}>>(e)) {
         const error =  e.response ? e.response.data.message : e.message
            handleServerNetworkError(dispatch, error)
        }
    }
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch<ActionType>, getState: () => AppRootStateType) => {
        dispatch(setStatusAC('loading'))
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
            ...domainModel
        }

        taskAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === ResultCode.SUCCESS) {
                    const action = updateTaskAC(taskId, domainModel, todolistId)
                    dispatch(action)
                    dispatch(setStatusAC('succeeded'))
                }
                else {
                    handleServerAppError<{item: TaskType}>(dispatch, res.data)
                    dispatch(setStatusAC('failed'))
                }
            })
            .catch((error: AxiosError<{message: string}>) => {
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






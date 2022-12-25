import {AddTodolistActionType, RemoveTodolistActionType, setTodolistsActionType} from "./todolists-reducer";
import {Dispatch} from "redux";
import {taskAPI, TaskStatuses, TaskType, UpdateTaskModelType} from "../../../api/todolist-api";
import {AppRootStateType} from "../../../app/store";
import {TasksStateType} from "../../../app/App";

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
        case "CHANGE-TASK-STATUS": {
            return {
                ...state,
                [action.todolistId]: [...state[action.todolistId].map(task => task.id === action.taskId ? {
                    ...task,
                    status: action.status
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

export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: "REMOVE-TASK", taskId, todolistId} as const)
export const addTaskAC = (task: TaskType)  =>
    ({type: "ADD-TASK", task} as const)
export const changeTaskStatusAC = (taskId: string, status:TaskStatuses, todolistId: string) =>
    ({type: "CHANGE-TASK-STATUS", taskId, status, todolistId} as const)
export const changeTaskTitleAC = (taskId: string, title:string, todolistId: string)  =>
    ({type: 'CHANGE-TASK-TITLE', taskId, title, todolistId} as const)
export const setTasksAC = (tasks: TaskType[], todolistId:string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)


export const getTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionType>) => {
    taskAPI.getTask(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
        })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionType>) => {
    taskAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            if(res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
            }
        })
        .catch((e) => {
        console.log(e.message)
    })
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionType>) => {
    taskAPI.createTask(todolistId, title)
        .then((res) => {
            dispatch(addTaskAC(res.data.data.item))
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, status: TaskStatuses) => (dispatch: Dispatch<ActionType>, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find((t) => t.id === taskId)


    if(task) {
        const model: UpdateTaskModelType = {
            ...task,
            status
        }
        taskAPI.updateTaskTitle(todolistId, taskId, model)
            .then((res) => {
                dispatch(changeTaskStatusAC(taskId, res.data.data.item.status, todolistId))
            })
    }

}





import {ResultCode, todolistAPI, TodolistType} from "../../../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setErrorAC, SetErrorType, setStatusAC, SetStatusType} from "../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {AxiosError} from "axios";


type ActionType = RemoveTodolistActionType |
    AddTodolistActionType |
    ChangeTodolistTitleActionType |
    ChangeTodolistFilterActionType |
    setTodolistsActionType
    | SetStatusType | changeTodolistsEntityStatusActionType | SetErrorType;
// меня вызовут и дадут мне стейт (почти всегда объект)
// и инструкцию (action, тоже объект)
// согласно прописанному type в этом action (инструкции) я поменяю state

const initialState: TodolistDomainType[] = []

export type FilterValueType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: ActionType): Array<TodolistDomainType> => {

    const stateCopy = [...state]

    switch (action.type) {

        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todolistId)

        case 'ADD-TODOLIST':
         return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]

        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)

        case 'CHANGE-TODOLIST-FILTER':
            return stateCopy.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)

        case "SET-TODOS":
            return action.todolists.map((tl) => ({...tl, filter: 'all', entityStatus: 'idle'}))

        case "SET-ENTITY-STATUS":
            return state.map((tl) => tl.id === action.todolistId ? {...tl, entityStatus: action.entityStatus} : tl)

        default:
            return state
    }
}

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolisTitletAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type setTodolistsActionType = ReturnType<typeof setTodolists>
export type changeTodolistsEntityStatusActionType = ReturnType<typeof changeTodolistsEntityStatusAC>
// actions
export const removeTodolistAC = (todolistId: string) =>
    ({type: 'REMOVE-TODOLIST', todolistId} as const)
export const addTodolistAC = (todolist: TodolistType) =>
    ({type: "ADD-TODOLIST", todolist} as const)
export const changeTodolisTitletAC = (id: string, title: string) =>
    ({type: "CHANGE-TODOLIST-TITLE", id, title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValueType) =>
    ({type: "CHANGE-TODOLIST-FILTER", id, filter} as const)
export const setTodolists = (todolists: TodolistType[]) =>
    ({type: "SET-TODOS", todolists} as const)
export const changeTodolistsEntityStatusAC = (todolistId: string, entityStatus: RequestStatusType) =>
    ({type: "SET-ENTITY-STATUS", entityStatus, todolistId} as const)

// thunks
export const getTodolistTC = () => (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.getTodolist()
        .then((res) => {
            dispatch(setTodolists(res.data))
            dispatch(setStatusAC('succeeded'))
        })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatusAC('loading'))
    dispatch(changeTodolistsEntityStatusAC(todolistId, 'loading'))
    todolistAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setStatusAC('succeeded'))
            }
        })

        .catch((error: AxiosError<{message: string}>) => {
            const err = error.response ? error.response.data.message : error.message
            handleServerNetworkError(dispatch, err)
            dispatch(changeTodolistsEntityStatusAC(todolistId, 'idle'))
        })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === ResultCode.SUCCESS) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setStatusAC('succeeded'))
            }else {
                handleServerAppError<{item: TodolistType}>(dispatch, res.data)
            }
        })
        .catch((e) => {
          handleServerAppError(dispatch, e.message)
        })
}

export const changeTodolistTitleTC = (newTitle: string, todolistId: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatusAC('loading'))
    todolistAPI.updateTodolist(todolistId, newTitle)
        .then(res => {
            dispatch(changeTodolisTitletAC(todolistId, newTitle))
            dispatch(setStatusAC('succeeded'))
        })
}



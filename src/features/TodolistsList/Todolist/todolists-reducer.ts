import {todolistAPI, TodolistType} from "../../../api/todolist-api";
import {Dispatch} from "redux";
import {setStatus, setStatusType} from "../../../app/app-reducer";

type ActionType = RemoveTodolistActionType |
    AddTodolistActionType |
    ChangeTodolistTitleActionType |
    ChangeTodolistFilterActionType |
    setTodolistsActionType
    | setStatusType;
// меня вызовут и дадут мне стейт (почти всегда объект)
// и инструкцию (action, тоже объект)
// согласно прописанному type в этом action (инструкции) я поменяю state

const initialState: TodolistDomainType[] = []

export type FilterValueType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
}

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: ActionType): Array<TodolistDomainType> => {

    const stateCopy = [...state]

    switch (action.type) {

        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todolistId)

        case 'ADD-TODOLIST':
         return [{...action.todolist, filter: 'all'}, ...state]

        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)

        case 'CHANGE-TODOLIST-FILTER':
            return stateCopy.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)

        case "SET-TODOS":
            return action.todolists.map((tl) => ({...tl, filter: 'all'}))

        default:
            return state
    }
}

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolisTitletAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type setTodolistsActionType = ReturnType<typeof setTodolists>
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

// thunks
export const getTodolistTC = () => (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatus('loading'))
    todolistAPI.getTodolist()
        .then((res) => {
            dispatch(setTodolists(res.data))
            dispatch(setStatus('succeeded'))
        })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatus('loading'))
    todolistAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setStatus('succeeded'))
            }
        })

        .catch(e => {
            console.log(e.message)
        })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatus('loading'))
    todolistAPI.createTodolist(title)
        .then(res => {
            dispatch(addTodolistAC(res.data.data.item))
            dispatch(setStatus('succeeded'))
        })
}

export const changeTodolistTitleTC = (newTitle: string, todolistId: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setStatus('loading'))
    todolistAPI.updateTodolist(todolistId, newTitle)
        .then(res => {
            dispatch(changeTodolisTitletAC(todolistId, newTitle))
            dispatch(setStatus('succeeded'))
        })
}



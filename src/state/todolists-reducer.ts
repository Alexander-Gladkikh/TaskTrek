import {v1} from "uuid";
import {todolistAPI, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";

type ActionType = RemoveTodolistActionType |
    AddTodolistActionType |
    ChangeTodolistTitleActionType |
    ChangeTodolistFilterActionType |
    setTodolistsActionType;
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
            let newTodolist: TodolistDomainType = {id: action.todolistId, title: action.title, filter: 'all', addedDate: '', order: 0}
            return [...state, newTodolist]

        case 'CHANGE-TODOLIST-TITLE':
            return stateCopy.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)

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

export const removeTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', todolistId} as const
}
export const addTodolistAC = (title: string) => {
    return {type: "ADD-TODOLIST", title, todolistId: v1()} as const
}
export const changeTodolisTitletAC = (id: string, title: string) => {
    return {type: "CHANGE-TODOLIST-TITLE", id, title} as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterValueType) => {
    return {type: "CHANGE-TODOLIST-FILTER", id, filter} as const
}

export const setTodolists = (todolists: TodolistType[]) => {
    return {type: "SET-TODOS", todolists} as const
}

export const getTodolistTC = () => (dispatch: Dispatch) => {
    todolistAPI.getTodolist()
        .then((res) => {
            dispatch(setTodolists(res.data))
        })

}


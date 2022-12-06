import {FilterValueType, TodolistType} from "../App";
import {v1} from "uuid";

type ActionType = RemoveTodolistActionType | AddTodolistActionType | ChangeTodolistTitleActionType | ChangeTodolistFilterActionType;
// меня вызовут и дадут мне стейт (почти всегда объект)
// и инструкцию (action, тоже объект)
// согласно прописанному type в этом action (инструкции) я поменяю state
export const todolistsReducer = (state: TodolistType[], action: ActionType) => {

    const stateCopy = [...state]

    switch (action.type) {

        case 'REMOVE-TODOLIST':
            return stateCopy.filter(tl => tl.id !== action.id)

        case 'ADD-TODOLIST':
            let newTodolist = {id: action.todolistId, title: action.title, filter: 'all'}
            return [ ...state, newTodolist]

        case 'CHANGE-TODOLIST-TITLE':
            return stateCopy.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)

        case 'CHANGE-TODOLIST-FILTER':
            return stateCopy.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)

        default:
            throw new Error('I don\'t understand this type')
    }
}

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolisTitletAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>

export const removeTodolistAC = (id: string) => {
    return {type: 'REMOVE-TODOLIST', id} as const
}
export const addTodolistAC = (title: string) => {
    return {type: "ADD-TODOLIST", title, todolistId: v1()} as const
}
export const changeTodolisTitletAC = (id: string, title:string) => {
    return {type: "CHANGE-TODOLIST-TITLE", id, title} as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterValueType) => {
    return {type: "CHANGE-TODOLIST-FILTER", id, filter} as const
}


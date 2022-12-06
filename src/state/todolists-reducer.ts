import {FilterValueType, TodolistType} from "../App";
import {v1} from "uuid";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    title: string
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterValueType
}

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
            let newTodolist = {id: v1(), title: action.title, filter: 'all'}
            return [ ...state, newTodolist]

        case 'CHANGE-TODOLIST-TITLE':
            return stateCopy.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)

        case 'CHANGE-TODOLIST-FILTER':
            return stateCopy.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)

        default:
            throw new Error('I don\'t understand this type')
    }
}

export const RemoveTodolistAC = (id: string) : RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id}
}
export const AddTodolistAC = (title: string) : AddTodolistActionType => {
    return {type: "ADD-TODOLIST", title}
}
export const ChangeTodolisTitletAC = (id: string, title:string) : ChangeTodolistTitleActionType => {
    return {type: "CHANGE-TODOLIST-TITLE", id, title}
}
export const ChangeTodolistFilterAC = (id: string, filter: FilterValueType) : ChangeTodolistFilterActionType => {
    return {type: "CHANGE-TODOLIST-FILTER", id, filter}
}


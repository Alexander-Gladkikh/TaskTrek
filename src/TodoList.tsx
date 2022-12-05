import React, {ChangeEvent, KeyboardEvent, useState} from 'react'
import {FilterValueType} from './App'
import {AddItemForm} from "./AddItemForm";
import {v1} from "uuid";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
type PropsType = {
    id: string
    title: string
    task: TaskType[]
    filter: FilterValueType
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValueType, todolistId: string) => void
    addTask: (taskTitle: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, newStatus: boolean, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
}

export function TodoList(props: PropsType) {

    const onAllClickHandler = () => props.changeFilter('all', props.id);
    const onActiveClickHandler = () => props.changeFilter('active', props.id);
    const onCompletedClickHandler = () => props.changeFilter('completed', props.id);

    const addTask = (title: string) => {
        props.addTask(title, props.id)
    }

    const removeTodolistHandler = () => {
        props.removeTodolist(props.id)
    }

    return (
        <div>
            <h3 style={{display: 'inline-block'}}>{props.title}</h3>
            <button onClick={removeTodolistHandler}>✖</button>
            <AddItemForm addItem={addTask}/>
            <ul>
                {props.task.map((task) => {
                    const removeTaskHandler = () => props.removeTask(task.id, props.id)
                    const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
                        let newStatusValue = e.currentTarget.checked
                        props.changeTaskStatus(task.id, newStatusValue, props.id)
                    }
                    return (
                        <li className={task.isDone ? 'is-done' : ''}
                            key={task.id}>
                            <input
                                type="checkbox"
                                checked={task.isDone}
                                onChange={changeTaskStatus}
                            />
                            <span>{task.title}</span>
                            <button onClick={removeTaskHandler}>✖</button>
                        </li>
                    )
                })}
            </ul>
            <div>
                <button
                    className={props.filter === 'all' ? 'active-filter' : ''}
                    onClick={onAllClickHandler}>All
                </button>
                <button
                    className={props.filter === 'active' ? 'active-filter' : ''}
                    onClick={onActiveClickHandler}>Active
                </button>
                <button
                    className={props.filter === 'completed' ? 'active-filter' : ''}
                    onClick={onCompletedClickHandler}>Completed
                </button>
            </div>
        </div>
    )
}


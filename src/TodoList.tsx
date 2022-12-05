import React, {ChangeEvent, KeyboardEvent, useState} from 'react'
import {FilterValueType} from './App'
import {AddItemForm} from "./AddItemForm";


type TaskPropsType = {
    id: string
    title: string
    isDone: boolean
}
type PropsType = {
    title: string
    task: TaskPropsType[]
    filter: FilterValueType
    removeTask: (taskId: string) => void
    changeFilter: (value: FilterValueType) => void
    addTask: (taskTitle: string) => void
    changeTaskStatus: (taskId: string, newStatus: boolean) => void
}

export function TodoList(props: PropsType) {

    const onAllClickHandler = () => props.changeFilter('all');
    const onActiveClickHandler = () => props.changeFilter('active');
    const onCompletedClickHandler = () => props.changeFilter('completed');

    return (
        <div>
            <h3>{props.title}</h3>

            <AddItemForm addItem={props.addTask}/>
            <ul>
                {props.task.map((task) => {
                    const removeTaskHandler = () => props.removeTask(task.id)
                    const changeTaskStatus = (e:ChangeEvent<HTMLInputElement>) => {
                        let newStatusValue = e.currentTarget.checked
                        props.changeTaskStatus(task.id, newStatusValue)
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
                    onClick={onAllClickHandler }>All</button>
                <button
                    className={props.filter === 'active' ? 'active-filter' : ''}
                    onClick={onActiveClickHandler}>Active</button>
                <button
                    className={props.filter === 'completed' ? 'active-filter' : ''}
                    onClick={onCompletedClickHandler}>Completed</button>
            </div>
        </div>
    )
}


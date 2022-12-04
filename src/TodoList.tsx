import React, {ChangeEvent, KeyboardEvent, useState} from 'react'
import {FilterValueType} from "./App";

type TaskPropsType = {
    id: string
    title: string
    isDone: boolean
}
type PropsType = {
    title: string
    task: TaskPropsType[]
    removeTask: (taskId: string) => void
    changeFilter: (value: FilterValueType) => void
    addTask: (taskTitle: string) => void
}

export function TodoList(props: PropsType) {

    let [title, setTitle] = useState<string>('')

    const addTaskHandler = () => {
        props.addTask(title)
        setTitle('')
    }

    const removeTaskHandler = (taskId: string) => {
        props.removeTask(taskId)
    }

    const onChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler = (event:KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            addTaskHandler()
        }
    }

    const onAllClickHandler = () => props.changeFilter('all');
    const onActiveClickHandler = () => props.changeFilter('active');
    const onCompletedClickHandler = () => props.changeFilter('completed');

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input
                    value={title}
                    onChange={onChangeHandler}
                    onKeyPress={onKeyPressHandler}
                />
                <button onClick={addTaskHandler}>+</button>
            </div>
            <ul>
                {props.task.map((task) => {
                    return (
                        <li key={task.id}><input type="checkbox" checked={task.isDone}/>
                            <span>{task.title}</span>
                            <button onClick={() => removeTaskHandler(task.id)}>✖</button>
                        </li>
                    )
                })}
            </ul>
            <div>
                <button onClick={onAllClickHandler}>All</button>
                <button onClick={onActiveClickHandler}>Active</button>
                <button onClick={onCompletedClickHandler}>Completed</button>
            </div>
        </div>
    )
}
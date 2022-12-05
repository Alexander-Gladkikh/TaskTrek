import React, {ChangeEvent, KeyboardEvent, useState} from 'react'
import {FilterValueType} from './App'


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

    let [title, setTitle] = useState<string>('')
    let [error, setError] = useState<string | null>(null)


    const addTaskHandler = () => {
        if(title.trim() !== ''){
            props.addTask(title.trim())
            setTitle('')
        }
        else {
            setError('Title is required')
        }
    }

    const onChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)

    }
    const onKeyPressHandler = (event:KeyboardEvent<HTMLInputElement>) => {
        setError(null)
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
                    className={error ? 'error' : ''}
                    value={title}
                    onChange={onChangeHandler}
                    onKeyPress={onKeyPressHandler}
                />
                <button onClick={addTaskHandler}>+</button>
                {error && <div className='error-message'>{error}</div>}
            </div>
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
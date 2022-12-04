import React, {useState} from "react";
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

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                    onKeyPress={}
                />
                <button onClick={addTaskHandler}>+</button>
            </div>
            <ul>
                {props.task.map((task) => {
                    return (
                        <li key={task.id}><input type="checkbox" checked={task.isDone}/>
                            <span>{task.title}</span>
                            <button onClick={() => props.removeTask(task.id)}>✖</button>
                        </li>
                    )
                })}
            </ul>
            <div>
                <button onClick={() => props.changeFilter('all')}>All</button>
                <button onClick={() => props.changeFilter('active')}>Active</button>
                <button onClick={() => props.changeFilter('completed')}>Completed</button>
            </div>
        </div>
    )
}
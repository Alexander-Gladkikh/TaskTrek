import React, {ChangeEvent} from 'react'
import {FilterValueType} from './App'
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
type PropsType = {
    id: string
    title: string
    task: TaskType[]
    filter: string
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValueType, todolistId: string) => void
    addTask: (taskTitle: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, newStatus: boolean, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    onChangeTaskTitle: (tasksId: string, newTitle: string, todolistId: string) => void
    onChangeTodolistTitle: (newTitle: string, todolistId: string) => void
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

    const onChangeTodolistTitle = (newTitle: string) => {
        props.onChangeTodolistTitle(newTitle, props.id)
    }


    return (
        <div>
            <EditableSpan title={props.title} onChangeTitle={onChangeTodolistTitle}/>
            <IconButton onClick={removeTodolistHandler}>
                <Delete/>
            </IconButton>
            <AddItemForm addItem={addTask}/>
            <ul>
                {props.task.map((task) => {
                    const removeTaskHandler = () => props.removeTask(task.id, props.id)
                    const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
                        let newStatusValue = e.currentTarget.checked
                        props.changeTaskStatus(task.id, newStatusValue, props.id)
                    }
                    const onChangeTaskTitle = (newTitle: string) => {
                        props.onChangeTaskTitle(task.id, newTitle, props.id)
                    }
                    return (
                        <li className={task.isDone ? 'is-done' : ''}
                            key={task.id}>
                            <Checkbox
                                checked={task.isDone}
                                onChange={changeTaskStatus}
                                color='primary'
                            />
                            <EditableSpan title={task.title} onChangeTitle={onChangeTaskTitle}/>
                            <IconButton onClick={removeTaskHandler}>
                                <Delete/>
                            </IconButton>
                        </li>
                    )
                })}
            </ul>
            <div>
                <Button
                    onClick={onAllClickHandler}
                    variant={props.filter === 'all' ? 'outlined' : 'text'}
                    color='inherit'>All
                </Button>
                <Button
                    variant={props.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color='primary'>Active
                </Button>
                <Button
                    variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color='secondary'>Completed
                </Button>
            </div>
        </div>
    )
}


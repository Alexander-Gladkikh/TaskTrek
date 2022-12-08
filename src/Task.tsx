import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";

type TaskPropsType = {
    task: any
    id: string
    removeTask: (taskId: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, newStatus: boolean, todolistId: string) => void
    onChangeTaskTitle: (tasksId: string, newTitle: string, todolistId: string) => void
}
export const Task = React.memo((props: TaskPropsType) => {
    const removeTaskHandler = useCallback(() => props.removeTask(props.task.id, props.id),[props.removeTask, props.task.id, props.id])
    const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newStatusValue = e.currentTarget.checked
        props.changeTaskStatus(props.task.id, newStatusValue, props.id)
    },[props.changeTaskStatus, props.task.id, props.id])
    const onChangeTaskTitle = useCallback((newTitle: string) => {
        props.onChangeTaskTitle(props.task.id, newTitle, props.id)
    },[props.onChangeTaskTitle, props.task.id, props.id])
    return (
        <div className={props.task.isDone ? 'is-done' : ''}
             key={props.task.id}>
            <Checkbox
                checked={props.task.isDone}
                onChange={changeTaskStatus}
                color='primary'
            />
            <EditableSpan title={props.task.title} onChangeTitle={onChangeTaskTitle}/>
            <IconButton onClick={removeTaskHandler}>
                <Delete/>
            </IconButton>
        </div>
    )
})
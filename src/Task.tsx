import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "./api/todolist-api";

type TaskPropsType = {
    task: TaskType
    id: string
    removeTask: (taskId: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, newStatus: TaskStatuses, todolistId: string) => void
    onChangeTaskTitle: (tasksId: string, newTitle: string, todolistId: string) => void
}
export const Task = React.memo((props: TaskPropsType) => {
    const removeTaskHandler = useCallback(() => props.removeTask(props.task.id, props.id),[props.removeTask, props.task.id, props.id])
    const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newStatusValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        props.changeTaskStatus(props.task.id, newStatusValue, props.id)
    },[props.changeTaskStatus, props.task.id, props.id])
    const onChangeTaskTitle = useCallback((newTitle: string) => {
        props.onChangeTaskTitle(props.task.id, newTitle, props.id)
    },[props.onChangeTaskTitle, props.task.id, props.id])
    return (
        <div className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}
             key={props.task.id}>
            <Checkbox
                checked={props.task.status === TaskStatuses.Completed}
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
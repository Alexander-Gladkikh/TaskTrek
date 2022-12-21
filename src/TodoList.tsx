import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "./Task";
import {useAppDispatch} from "./state/store";
import {getTasksTC} from "./state/tasks-reducer";
import {TaskStatuses, TaskType} from "./api/todolist-api";
import {FilterValueType} from "./state/todolists-reducer";


type PropsType = {
    id: string
    title: string
    task: TaskType[]
    filter: string
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValueType, todolistId: string) => void
    addTask: (taskTitle: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, newStatus: TaskStatuses, todolistId: string) => void
    onChangeTaskTitle: (tasksId: string, newTitle: string, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    onChangeTodolistTitle: (newTitle: string, todolistId: string) => void
}

export const TodoList = React.memo((props: PropsType) => {
    const dispatch = useAppDispatch();

  //  console.log('Todolist called')

    useEffect(() => {
        console.log('render todolist')
        dispatch(getTasksTC(props.id))
    },[])

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.id), [props.changeFilter, props.id]);
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.id), [props.changeFilter, props.id]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.id), [props.changeFilter, props.id]);

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id])

    const removeTodolistHandler = () => {
        props.removeTodolist(props.id)
    }

    const onChangeTodolistTitle = useCallback((newTitle: string) => {
        props.onChangeTodolistTitle(newTitle, props.id)
    }, [props.onChangeTodolistTitle, props.id])

    let tasksForTodolist = props.task

    if (props.filter === 'active') {
        tasksForTodolist = props.task.filter(task => task.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.task.filter(task => task.status === TaskStatuses.Completed)
    }


    return (
        <div>
            <EditableSpan title={props.title} onChangeTitle={onChangeTodolistTitle}/>
            <IconButton onClick={removeTodolistHandler}>
                <Delete/>
            </IconButton>
            <AddItemForm addItem={addTask}/>
            {tasksForTodolist.map((task) => {
                return (
                    <Task task={task}
                          id={props.id}
                          removeTask={props.removeTask}
                          changeTaskStatus={props.changeTaskStatus}
                          onChangeTaskTitle={props.onChangeTaskTitle}/>
                )
            })
            }
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
})


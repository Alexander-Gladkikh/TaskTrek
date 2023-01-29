import React, {useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {
    addTodolistAC, addTodolistTC,
    changeTodolistFilterAC,
    changeTodolisTitletAC, changeTodolistTitleTC,
    FilterValueType,
    getTodolistTC,
    removeTodolistAC, removeTodolistTC,
    TodolistDomainType
} from "./Todolist/todolists-reducer";
import {
    addTaskTC,
    removeTaskTC,
    updateTaskTC
} from "./Todolist/tasks-reducer";
import {TaskStatuses} from "../../api/todolist-api";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../api/components/AddItemForm/AddItemForm";
import {TodoList} from "./Todolist/TodoList";
import {TasksStateType} from "../../app/App";

export const TodolistsList: React.FC = () => {

    const todolists = useAppSelector<TodolistDomainType[]>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getTodolistTC())
    }, [])


    const removeTask = useCallback((taskId: string, todolistId: string) => {
        dispatch(removeTaskTC(todolistId, taskId))
    }, [])
    const addTask = useCallback((taskTitle: string, todolistId: string) => {
        dispatch(addTaskTC(todolistId, taskTitle))
    }, [])                                                        // UpdateModalType
    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskTC(todolistId, taskId, {status}))
    }, [])

    const changeTaskTitle = useCallback((taskId: string, newTitle: string, todolistId: string) => {
        dispatch(updateTaskTC(todolistId, taskId, {title: newTitle}))
    }, [])


    const changeFilter = useCallback((value: FilterValueType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(todolistId, value))
    }, [])
    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(removeTodolistTC(todolistId))
    }, [])
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [])
    const onChangeTodolistTitle = useCallback((newTitle: string, todolistId: string) => {
        dispatch(changeTodolistTitleTC(todolistId, newTitle))
    }, [])




    return (
        <><Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
            <Grid container spacing={3}>
                {todolists.map(tl => {

                    return (
                        <Grid item>
                            <Paper style={{padding: '10px'}}>
                                <TodoList
                                    key={tl.id}
                                    id={tl.id}
                                    title={tl.title}
                                    task={tasks[tl.id]}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeTaskStatus}
                                    onChangeTaskTitle={changeTaskTitle}
                                    removeTodolist={removeTodolist}
                                    onChangeTodolistTitle={onChangeTodolistTitle}
                                    filter={tl.filter}/>
                            </Paper>
                        </Grid>);

                })}
            </Grid></>
    )
}
import React, {useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolisTitletAC,
    FilterValueType,
    getTodolistTC,
    removeTodolistAC,
    TodolistDomainType
} from "./Todolist/todolists-reducer";
import {addTaskTC, changeTaskTitleAC, removeTaskTC, updateTaskTC} from "./Todolist/tasks-reducer";
import {TaskStatuses} from "../../api/todolist-api";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../api/components/AddItemForm/AddItemForm";
import {TodoList} from "./Todolist/TodoList";
import {TasksStateType} from "../../app/App";

export const TodolistsList: React.FC = () => {

    const todolists = useAppSelector<TodolistDomainType[]>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch()

    const removeTask = useCallback((taskId: string, todolistId: string) => {
        dispatch(removeTaskTC(todolistId, taskId))
    }, [])
    const addTask = useCallback((taskTitle: string, todolistId: string) => {
        dispatch(addTaskTC(todolistId, taskTitle))
    }, [])                                                        // UpdateModalType
    const changeTaskStatus = useCallback((taskId: string, newStatus: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskTC(todolistId, taskId, newStatus))
    }, [])
    const onChangeTaskTitle = useCallback((tasksId: string, newTitle: string, todolistId: string) => {
        dispatch(changeTaskTitleAC(tasksId, newTitle, todolistId))

    }, [])
    const changeFilter = useCallback((value: FilterValueType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(todolistId, value))
    }, [])
    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(removeTodolistAC(todolistId))
    }, [])
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistAC(title))
    }, [])
    const onChangeTodolistTitle = useCallback((newTitle: string, todolistId: string) => {
        dispatch(changeTodolisTitletAC(todolistId, newTitle))
    }, [])

    useEffect(() => {
        dispatch(getTodolistTC())
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
                                    removeTodolist={removeTodolist}
                                    onChangeTaskTitle={onChangeTaskTitle}
                                    onChangeTodolistTitle={onChangeTodolistTitle}
                                    filter={tl.filter}/>
                            </Paper>
                        </Grid>);

                })}
            </Grid></>
    )
}
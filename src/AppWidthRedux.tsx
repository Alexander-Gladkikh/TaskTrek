import React, {Reducer, useCallback, useReducer, useState} from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolisTitletAC,
    removeTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";
import {AppRootStateType} from "./state/store";
import {useDispatch, useSelector} from "react-redux";

export type FilterValueType = 'all' | 'active' | 'completed'
export type TodolistType = {
    id: string
    title: string
    filter: string
}

export type TasksStateType = {
    [key: string]: TaskType[]
}


function AppWidthRedux() {

    let todolistID1 = v1()
    let todolistID2 = v1()

    // let [todolists, dispatchToTodolist] = useReducer<Reducer<TodolistType[], any>>(todolistsReducer, [
    //     {id: todolistID1, title: 'What to learn', filter: 'all'},
    //     {id: todolistID2, title: 'What to buy', filter: 'all'}
    // ])
    //
    // let [tasks, dispatchToTasks] = useReducer<Reducer<TasksStateType, any>>(tasksReducer, {
    //     [todolistID1]: [
    //         {id: v1(), title: 'HTML&CSS', isDone: true},
    //         {id: v1(), title: 'JS', isDone: true},
    //         {id: v1(), title: 'ReactJS', isDone: false},
    //
    //     ],
    //     [todolistID2]: [
    //         {id: v1(), title: 'Rest API', isDone: true},
    //         {id: v1(), title: 'GraphQL', isDone: false},
    //     ]
    // })

    const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()

    const removeTask = useCallback((taskId: string, todolistId: string) => {
        dispatch(removeTaskAC(taskId, todolistId))
    },[])
    const addTask = useCallback((taskTitle: string, todolistId: string) => {
        dispatch(addTaskAC(taskTitle, todolistId))
    },[])
    const changeTaskStatus = useCallback((taskId: string, newStatus: boolean, todolistId: string) => {
        dispatch(changeTaskStatusAC(taskId, newStatus, todolistId))
    },[])
    const onChangeTaskTitle = useCallback((tasksId: string, newTitle: string, todolistId: string) => {
        dispatch(changeTaskTitleAC(tasksId, newTitle, todolistId))

    },[])
    const changeFilter = useCallback((value: FilterValueType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(todolistId, value))
    },[])
    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(removeTodolistAC(todolistId))
    },[])
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistAC(title))
    },[])
    const onChangeTodolistTitle = useCallback((newTitle: string, todolistId: string) => {
        dispatch(changeTodolisTitletAC(todolistId, newTitle))
    },[])


    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists.map(tl => {

                        return <Grid item>
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
                                    filter={tl.filter}
                                />
                            </Paper>
                        </Grid>

                    })}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWidthRedux;

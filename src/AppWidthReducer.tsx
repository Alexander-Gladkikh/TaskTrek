import React, {useReducer, useState} from 'react';
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

export type FilterValueType = 'all' | 'active' | 'completed'
export type TodolistType = {
    id: string
    title: string
    filter: string
}

export type TasksStateType = {
    [key: string]: TaskType[]
}


function AppWidthReducer() {

    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, dispatchToTodolist] = useReducer(todolistsReducer, [
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'}
    ])

    let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},

        ],
        [todolistID2]: [
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: false},
        ]
    })

    const removeTask = (taskId: string, todolistId: string) => {
        dispatchToTasks(removeTaskAC(taskId, todolistId))
    }

    const addTask = (taskTitle: string, todolistId: string) => {
        dispatchToTasks(addTaskAC(taskTitle, todolistId))
    }

    const changeTaskStatus = (taskId: string, newStatus: boolean, todolistId: string) => {
        dispatchToTasks(changeTaskStatusAC(taskId, newStatus, todolistId))
    }
    const onChangeTaskTitle = (tasksId: string, newTitle: string, todolistId: string) => {
        dispatchToTasks(changeTaskTitleAC(tasksId, newTitle, todolistId))

    }
    const changeFilter = (value: FilterValueType, todolistId: string) => {
        dispatchToTodolist(changeTodolistFilterAC(todolistId, value))
    }


    const removeTodolist = (todolistId: string) => {
        dispatchToTodolist(removeTodolistAC(todolistId))
        dispatchToTasks(removeTodolistAC(todolistId))
    }


    const addTodolist = (title: string) => {
        dispatchToTasks(addTodolistAC(title))
        dispatchToTodolist(addTodolistAC(title))
    }


    const onChangeTodolistTitle = (newTitle: string, todolistId: string) => {
        dispatchToTodolist(changeTodolisTitletAC(todolistId, newTitle))
    }


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
                        let allTodolistTasks = tasks[tl.id]
                        let taskForTodolist = allTodolistTasks

                        if (tl.filter === 'active') {
                            taskForTodolist = allTodolistTasks.filter(task => !task.isDone)
                        }
                        if (tl.filter === 'completed') {
                            taskForTodolist = allTodolistTasks.filter(task => task.isDone)
                        }
                        return <Grid item>
                            <Paper style={{padding: '10px'}}>
                                <TodoList
                                    key={tl.id}
                                    id={tl.id}
                                    title={tl.title}
                                    task={taskForTodolist}
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

export default AppWidthReducer;

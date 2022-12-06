import React, {useState} from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

export type FilterValueType = 'all' | 'active' | 'completed'
export type TodolistType = {
    id: string
    title: string
    filter: string
}

type TaskStateType = {
    [key: string]: TaskType[]
}


function App() {

    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, setTodolists] = useState<Array<TodolistType>>([
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    let [tasks, setTasks] = useState<TaskStateType>({
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
        let todolistTasks = tasks[todolistId]
        tasks[todolistId] = todolistTasks.filter(tl => tl.id !== taskId)
        setTasks({...tasks})

    }

    const addTask = (taskTitle: string, todolistId: string) => {
        let newTask = {id: v1(), title: taskTitle, isDone: false}
        let todolistTasks = tasks[todolistId]
        tasks[todolistId] = [newTask, ...todolistTasks]
        setTasks({...tasks})
    }

    const changeTaskStatus = (taskId: string, newStatus: boolean, todolistId: string) => {
        let todolistTasks = tasks[todolistId]
        let task = todolistTasks.find(task => task.id === taskId)
        if (task) {
            task.isDone = newStatus
            setTasks({...tasks})
        }
    }

    const onChangeTaskTitle = (tasksId: string, newTitle: string, todolistId: string) => {
        let todolistTasks = tasks[todolistId]
        let task = todolistTasks.find(task => task.id === tasksId)
        if (task) {
            task.title = newTitle
            setTasks({...tasks})
        }
    }


    const changeFilter = (value: FilterValueType, todolistId: string) => {
        let todolist = todolists.find(tl => tl.id === todolistId)
        if (todolist) {
            todolist.filter = value
            setTodolists([...todolists])
        }
    }

    const removeTodolist = (todolistId: string) => {
        setTodolists(todolists.filter(tl => tl.id !== todolistId))
        delete tasks[todolistId]
        setTasks({...tasks})
    }

    const addTodolist = (title: string) => {
        let newTodolistId = v1()
        let newTodolist = {id: newTodolistId, title: title, filter: 'all'}
        setTodolists([newTodolist, ...todolists])
        setTasks({
            ...tasks,
            [newTodolistId]: []
        })
    }

    const onChangeTodolistTitle = (newTitle: string, todolistId: string) => {
        let todolist = todolists.find(tl => tl.id === todolistId)
        if (todolist) {
            todolist.title = newTitle
            setTodolists([...todolists])
        }
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

export default App;

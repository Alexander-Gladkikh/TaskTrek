import React from 'react';
import './App.css';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu';
import {TaskType} from "../api/todolist-api";
import {TodolistsList} from "../features/TodolistsList/Todolists";
import LinearProgress from "@mui/material/LinearProgress";
import {useAppSelector} from "./store";
import {ErrorSnackbar} from "../api/components/ErrorSnackbar/ErrorSnackbar";


export type TasksStateType = {
    [key: string]: TaskType[]
}


function App() {
    const status =useAppSelector((state) => state.app.status)


    return (
        <div className="App">
            <ErrorSnackbar/>
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
                {status === 'loading' && <LinearProgress />}
            </AppBar>
            <Container fixed>
                <TodolistsList/>
            </Container>
        </div>
    );
}

export default App;

import React, { useEffect } from 'react'

import './App.css'
import MenuIcon from '@mui/icons-material/Menu'
import { CircularProgress } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Navigate, Route, Routes } from 'react-router-dom'

import { RequestStatusType } from './app-reducer'
import { useAppDispatch, useAppSelector } from './store'

import { ErrorSnackbar } from 'api/components/ErrorSnackbar/ErrorSnackbar'
import { TaskType } from 'api/todolist-api'
import { logOutTC, meTC } from 'features/Login/auth-reducer'
import { Login } from 'features/Login/Login'
import { TodolistsList } from 'features/TodolistsList/Todolists'

export type TasksStateType = {
  [key: string]: TaskType[]
}

type PropsType = {
  demo?: boolean
}

function App({ demo = false }: PropsType) {
  const status = useAppSelector<RequestStatusType>(state => state.app.status)
  const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)
  const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)
  const dispatch = useAppDispatch()

  const logOutHandler = () => {
    dispatch(logOutTC())
  }

  useEffect(() => {
    dispatch(meTC())
  }, [])

  if (!isInitialized) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '30%',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={logOutHandler}>
              Log out
            </Button>
          )}
          <Button color="inherit">Login</Button>
        </Toolbar>
        {status === 'loading' && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path={'/'} element={<TodolistsList demo={demo} />} />
          <Route path={'/login'} element={<Login />} />
          <Route path={'/404'} element={<h1>404 NOT FOUND</h1>} />
          <Route path={'*'} element={<Navigate to="/404" />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App

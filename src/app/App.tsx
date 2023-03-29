import React, { useCallback, useEffect } from 'react'

import MenuIcon from '@mui/icons-material/Menu'
import { CircularProgress } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Route, Routes } from 'react-router-dom'

import { useAppSelector } from './store'

import { ErrorSnackbar } from 'components/ErrorSnackbar/ErrorSnackbar'
import { appActions } from 'features/Application'
import { RequestStatusType } from 'features/Application/application-reducer'
import { selectIsInitialized, selectStatus } from 'features/Application/selectors'
import { authActions, authSelectors } from 'features/Auth'
import { Login } from 'features/Auth/Login'
import { TodolistsList } from 'features/TodolistsList/Todolists'
import { useActions } from 'utils/redux-utils'

type PropsType = {
  demo?: boolean
}

function App({ demo = false }: PropsType) {
  const status = useAppSelector<RequestStatusType>(selectStatus)
  const isInitialized = useAppSelector<boolean>(selectIsInitialized)
  const isLoggedIn = useAppSelector<boolean>(authSelectors.selectIsLoggedIn)

  const { logout } = useActions(authActions)
  const { initializeApp } = useActions(appActions)

  useEffect(() => {
    if (!demo) {
      initializeApp()
    }
  }, [])

  const logOutHandler = useCallback(() => {
    logout()
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
        </Routes>
      </Container>
    </div>
  )
}

export default App

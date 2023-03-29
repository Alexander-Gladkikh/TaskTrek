import React, { useCallback, useEffect } from 'react'

import { Grid, Paper } from '@mui/material'
import { Navigate } from 'react-router-dom'

import { TodoList } from './Todolist/TodoList'

import { useAppDispatch, useAppSelector } from 'app/store'
import { AddItemForm, AddItemFormSubmitHelperType } from 'components/AddItemForm/AddItemForm'
import { selectIsLoggedIn } from 'features/Auth/selectors'
import { todolistsActions } from 'features/TodolistsList/index'
import { selectTasks, selectTodolists } from 'features/TodolistsList/selectors'
import { TasksStateType } from 'features/TodolistsList/tasks-reducer'
import { TodolistDomainType } from 'features/TodolistsList/todolists-reducer'
import { useActions } from 'utils/redux-utils'

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useAppSelector<TodolistDomainType[]>(selectTodolists)
  const tasks = useAppSelector<TasksStateType>(selectTasks)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const dispatch = useAppDispatch()
  const { fetchTodolists } = useActions(todolistsActions)

  const addTodolistCallback = useCallback(
    async (title: string, helper: AddItemFormSubmitHelperType) => {
      let thunk = todolistsActions.addTodolist(title)
      const resultAction = await dispatch(thunk)

      if (todolistsActions.addTodolist.rejected.match(resultAction)) {
        if (resultAction.payload?.errors?.length) {
          const errorMessage = resultAction.payload?.errors[0]

          helper.setError(errorMessage)
        } else {
          helper.setError('Some error occured')
        }
      } else {
        helper.setTitle('')
      }
    },
    []
  )

  useEffect(() => {
    if (demo || !isLoggedIn) return
    fetchTodolists()
  }, [])

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  }

  return (
    <>
      <Grid container style={{ padding: '20px' }}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map(tl => {
          let allTodolistTasks = tasks[tl.id]

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: '10px' }}>
                <TodoList todolist={tl} tasks={allTodolistTasks} demo={demo} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}

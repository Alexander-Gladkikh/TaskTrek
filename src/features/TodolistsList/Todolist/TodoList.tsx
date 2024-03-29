import React, { useCallback, useEffect } from 'react'

import { Delete } from '@mui/icons-material'
import { Button, IconButton, Paper, PropTypes } from '@mui/material'
import { ButtonPropsColorOverrides } from '@mui/material/Button/Button'
import { OverridableStringUnion } from '@mui/types'

import { Task } from './Task/Task'

import { TaskStatuses, TaskType } from 'api/types'
import { useAppDispatch } from 'app/store'
import { AddItemForm, AddItemFormSubmitHelperType } from 'components/AddItemForm/AddItemForm'
import { EditableSpan } from 'components/EditableSpan/EditableSpan'
import { tasksActions, todolistsActions } from 'features/TodolistsList/index'
import { FilterValueType, TodolistDomainType } from 'features/TodolistsList/todolists-reducer'
import { useActions } from 'utils/redux-utils'

type PropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  demo?: boolean
}

export const TodoList = React.memo(function ({ demo = false, ...props }: PropsType) {
  const { fetchTasks } = useActions(tasksActions)
  const { removeTodolist, changeTodolistTitle, changeTodolistFilter } = useActions(todolistsActions)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo) {
      return
    }
    fetchTasks(props.todolist.id)
  }, [])

  const addTaskCallback = useCallback(
    async (title: string, helper: AddItemFormSubmitHelperType) => {
      let thunk = tasksActions.addTask({ title: title, todolistId: props.todolist.id })
      const resultAction = await dispatch(thunk)

      if (tasksActions.addTask.rejected.match(resultAction)) {
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
    [props.todolist.id]
  )

  const removeTodolistHandler = () => {
    removeTodolist(props.todolist.id)
  }

  const changeTodolistTitleHandler = useCallback(
    (newTitle: string) => {
      changeTodolistTitle({ newTitle, todolistId: props.todolist.id })
    },
    [props.todolist.id]
  )

  const onFilterButtonClickHandler = useCallback(
    (filter: FilterValueType) =>
      changeTodolistFilter({
        filter: filter,
        id: props.todolist.id,
      }),
    [props.todolist.id]
  )

  let tasksForTodolist = props.tasks

  if (props.todolist.filter === 'active') {
    tasksForTodolist = props.tasks.filter(task => task.status === TaskStatuses.New)
  }
  if (props.todolist.filter === 'completed') {
    tasksForTodolist = props.tasks.filter(task => task.status === TaskStatuses.Completed)
  }

  const renderFilterButton = (
    buttonFilter: FilterValueType,
    color: OverridableStringUnion<
      'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
      ButtonPropsColorOverrides
    >,
    text: string
  ) => {
    return (
      <Button
        variant={props.todolist.filter === buttonFilter ? 'outlined' : 'text'}
        onClick={() => onFilterButtonClickHandler(buttonFilter)}
        color={color}
      >
        {text}
      </Button>
    )
  }

  return (
    <Paper style={{ padding: '10px', position: 'relative' }}>
      <IconButton
        size={'small'}
        onClick={removeTodolistHandler}
        disabled={props.todolist.entityStatus === 'loading'}
        style={{ position: 'absolute', right: '5px', top: '5px' }}
      >
        <Delete fontSize={'small'} />
      </IconButton>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleHandler} />
      </h3>
      <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === 'loading'} />
      <div>
        {tasksForTodolist.map(t => (
          <Task key={t.id} task={t} todolistId={props.todolist.id} />
        ))}
        {!tasksForTodolist.length && <div style={{ padding: '10px', color: 'grey' }}>No task</div>}
      </div>
      <div style={{ paddingTop: '10px' }}>
        {renderFilterButton('all', 'success', 'All')}
        {renderFilterButton('active', 'primary', 'Active')}
        {renderFilterButton('completed', 'secondary', 'Completed')}
      </div>
    </Paper>
  )
})

import * as React from 'react'

import { Snackbar, Alert, AlertProps } from '@mui/material'
import { SnackbarCloseReason } from '@mui/material/Snackbar/Snackbar'
import { useSelector } from 'react-redux'

import { appActions } from 'features/CommonActions/App'
import { useActions } from 'utils/redux-utils'
import { AppRootStateType } from 'utils/types'

function AlertComponent(props: AlertProps) {
  return <Alert elevation={6} variant="filled" {...props} />
}

export function ErrorSnackbar() {
  const error = useSelector<AppRootStateType, string | null>(state => state.app.error)
  const { setAppError } = useActions(appActions)

  const handleClose = (event: React.SyntheticEvent<any> | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setAppError({ error: null })
  }

  const isOpen = error !== null

  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
      <AlertComponent onClose={handleClose} severity="error">
        {error}
      </AlertComponent>
    </Snackbar>
  )
}

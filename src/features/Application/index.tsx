import {
  asyncActions,
  slice,
  RequestStatusType as T1,
} from 'features/Application/application-reducer'
import * as appSelectors from 'features/Application/selectors'

const appReducer = slice.reducer
const actions = slice.actions

const appActions = {
  ...actions,
  ...asyncActions,
}

export type RequestStatusType = T1

export { appSelectors, appReducer, appActions }

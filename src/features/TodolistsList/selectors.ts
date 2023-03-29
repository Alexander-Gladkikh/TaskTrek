import { AppRootStateType } from 'utils/types'

export const selectTodolists = (state: AppRootStateType) => state.todolists
export const selectTasks = (state: AppRootStateType) => state.tasks

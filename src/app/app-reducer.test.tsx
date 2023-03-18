import { appReducer, RequestStatusType, setErrorAC, setStatusAC } from './app-reducer'

type InitialStateType = {
  isInitialized: boolean
  error: string | null
  status: RequestStatusType
}

let startState: InitialStateType

beforeEach(() => {
  startState = {
    isInitialized: false,
    error: null,
    status: 'idle',
  }
})

test('correct error message should be set', () => {
  const endState = appReducer(
    {
      status: startState.status,
      error: startState.error,
      isInitialized: startState.isInitialized,
    },
    setErrorAC({ error: 'some error' })
  )

  expect(endState.error).toBe('some error')
})

test('correct status should be set', () => {
  const endState = appReducer(
    {
      status: startState.status,
      error: startState.error,
      isInitialized: startState.isInitialized,
    },
    setStatusAC({ status: 'loading' })
  )

  expect(endState.status).toBe('loading')
})

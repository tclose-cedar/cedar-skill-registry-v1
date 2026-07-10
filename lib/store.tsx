'use client'
import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import seedSkills from '@/data/skills.json'
import { Skill, CommandLogEntry } from './types'
import { setLogCallback } from './mockGithub'

interface State {
  skills: Skill[]
  log: CommandLogEntry[]
  logOpen: boolean
}

type Action =
  | { type: 'ADD_LOG'; entry: CommandLogEntry }
  | { type: 'TOGGLE_LOG' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_LOG':
      return { ...state, log: [...state.log, action.entry] }
    case 'TOGGLE_LOG':
      return { ...state, logOpen: !state.logOpen }
    default:
      return state
  }
}

interface StoreContextValue {
  skills: Skill[]
  log: CommandLogEntry[]
  logOpen: boolean
  toggleLog: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    skills: seedSkills as Skill[],
    log: [],
    logOpen: false,
  })

  setLogCallback((entry) => dispatch({ type: 'ADD_LOG', entry }))

  const toggleLog = useCallback(() => dispatch({ type: 'TOGGLE_LOG' }), [])

  return (
    <StoreContext.Provider value={{ ...state, toggleLog }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

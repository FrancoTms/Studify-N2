import { createContext, useContext } from 'react'

// Los contextos y sus hooks están separados de los Providers para que Vite pueda recargar los componentes sin perder el estado

export const AuthContext = createContext(null)
export const DataContext = createContext(null)
export const PomodoroContext = createContext(null)

export const useAuth = () => useContext(AuthContext)
export const useData = () => useContext(DataContext)
export const usePomodoro = () => useContext(PomodoroContext)

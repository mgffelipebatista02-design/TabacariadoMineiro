'use client'

import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import type { Mode } from '@/types'

interface ModeContextValue {
  mode: Mode
  toggleMode: () => void
  setMode: (mode: Mode) => void
  hydrated: boolean
}

export const ModeContext = createContext<ModeContextValue | undefined>(undefined)

const STORAGE_KEY = 'tabacaria-mode'

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('b2c')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'b2b' || stored === 'b2c') {
      setModeState(stored)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, mode)
    }
  }, [mode, hydrated])

  const setMode = useCallback((newMode: Mode) => {
    setModeState(newMode)
  }, [])

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === 'b2c' ? 'b2b' : 'b2c'))
  }, [])

  return (
    <ModeContext.Provider value={{ mode, toggleMode, setMode, hydrated }}>
      {children}
    </ModeContext.Provider>
  )
}

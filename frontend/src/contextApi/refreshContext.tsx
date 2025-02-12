import React, { createContext, useContext, useState, ReactNode } from 'react'

interface RefreshContextState {
  needRefresh: boolean
  triggerRefresh: () => void
}

const defaultState: RefreshContextState = {
  needRefresh: false,
  triggerRefresh: () => {},
}

const RefreshContext = createContext<RefreshContextState>(defaultState)

export const useRefresh = () => useContext(RefreshContext)

export const RefreshProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [needRefresh, setNeedRefresh] = useState(false)

  const triggerRefresh = () => {
    setNeedRefresh((prev) => !prev) // Toggles the refresh state
  }

  return (
    <RefreshContext.Provider value={{ needRefresh, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  )
}

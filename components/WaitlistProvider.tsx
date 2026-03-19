'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface WaitlistContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const WaitlistContext = createContext<WaitlistContextType>({
  open: false,
  setOpen: () => {},
})

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <WaitlistContext.Provider value={{ open, setOpen }}>
      {children}
    </WaitlistContext.Provider>
  )
}

export function useWaitlist() {
  return useContext(WaitlistContext)
}

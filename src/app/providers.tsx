"use client"

import { store } from "@/lib/store"
import { Provider } from "react-redux"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <div>{children}</div>
    </Provider>
  )
}

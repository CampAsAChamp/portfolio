import { StrictMode } from "react"
import { App } from "experience-sync/ui/src/App"
import { createRoot } from "react-dom/client"

import "./styles.css"

const root = document.getElementById("root")
if (!root) {
  throw new Error("Root element not found")
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

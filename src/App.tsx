import "@/styles/global.css"
import { AppRoutes } from "@/routes/app.routes"
import { AppProviders } from "@/providers/AppProviders"

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}

export default App

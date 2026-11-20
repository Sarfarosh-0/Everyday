import { Toaster } from "@/components/ui/sonner"
import { AppRoutes } from "@/routes/app-routes"

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-center" offset={72} />
    </>
  )
}

export default App

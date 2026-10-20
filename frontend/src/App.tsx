import { Toaster } from "@/components/ui/sonner"
import { AppRoutes } from "@/routes/app-routes"

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-center" />
    </>
  )
}

export default App

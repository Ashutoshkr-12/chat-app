import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast';
function App() {
 

  return (
  <>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
<Toaster/>
  <main>
    <Outlet/>
  </main>
  
    </ThemeProvider>
  </>
  )
}

export default App

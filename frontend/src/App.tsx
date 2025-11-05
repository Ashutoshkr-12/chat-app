import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import {  initSocket } from './socket/socket';
import { useAppDispatch, useAppSelector } from './hooks/hooks';

function App() {

  const { token } = useAppSelector((state) => state.auth);
  // console.log('token from mainpage:',token)
  const dispatch = useAppDispatch();
  useEffect(() => {
    if(token) initSocket(token);
  },[token, dispatch]);


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

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router-dom'
import Home from "./Pages/Home"

function App() {

  return (
   <>
 
    <main>
        <Outlet/>
    </main>
   </>
  )
}

export default App

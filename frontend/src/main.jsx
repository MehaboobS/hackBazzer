import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import {SignupForm,LoginForm,ProjectForm,SingleCard} from './components/index.js'
import ProjectDisplay from './Pages/ProjectDisplay.jsx'
import Home from './Pages/Home.jsx'
// import { Provider } from 'react-redux'
import store from './store/store.js'

const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/user/signup",
        element:<SignupForm/>
      },
      {
        path:"/user/login",
        element:<LoginForm/>
      },
      {
        path:"/create",
        element:<ProjectForm/>
      },
      {
        path:"/market",
        element:<ProjectDisplay/>
      },{
        path:'/singleCard/:id',
        element:<SingleCard/>
      }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
<Provider store={store}>
 <RouterProvider router={router}/>
 </Provider>
  </StrictMode>,
)

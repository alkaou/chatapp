import { useContext } from 'react'
import { Home, Register, Login } from './pages'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import { Navigate } from 'react-router-dom'
import './style.scss'
import './app.css'

function App() {
  const { currentUser } = useContext(AuthContext)

  const ProtecteRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to='/login' />
    } else {
      return children
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' />
        <Route
          index
          element={
            <ProtecteRoute>
              <Home />
            </ProtecteRoute>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route />
      </Routes>
    </BrowserRouter>
  )
}
export default App

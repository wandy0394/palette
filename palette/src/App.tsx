import { Link, Route, Router, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login'
import Palette from './pages/palette'
import Signup from './pages/signup'

function App() {

  return (
    <div className="h-auto">
      <div className="navbar bg-base-300">
        <div className="navbar-start"></div>
        <div className="navbar-center">
          <Link to='/'>Home</Link>
        </div>
        <div className="navbar-end flex items-center justify-end gap-4 py-1">
          <Link to='/signup'>
            <div className="btn btn-secondary">
              Signup
            </div>
          </Link>
          <Link to='/login'>
            <div className="btn btn-primary">Login</div>
          </Link>
        </div>
      </div>
      <div className='h-full px-96 bg-base-100'>
        <Routes>
          <Route path="/" element={<Palette/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App

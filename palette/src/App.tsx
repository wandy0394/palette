import { Link, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Editor from './pages/editor'
import Login from './pages/login'
import Palette from './pages/palette'
import Signup from './pages/signup'
import Library from './pages/library'
import { useAuthContext } from './hooks/useAuthContext'
import { useLogout } from './hooks/useLogout'

type Props = {
  isActive:(targetPath:string)=>boolean,
  targetPath:string,
  title:string
}

function NavLink(props:Props) {
  const {isActive, targetPath, title} = props
  return (
    <Link 
      to={targetPath} 
      className={
        `md:text-2xl text-neutral-400 tab tab-bordered rounded hover:bg-neutral-400 hover:text-neutral-800 no-underline
        ${isActive(targetPath)?'bg-neutral-400 text-neutral-800':''}`
      } 
    >
      {title}
    </Link>

  )
}

function App() {
  const location = useLocation()
  const {user} = useAuthContext()
  const {logout} = useLogout()

  function isActive(target:string):boolean {
    return (location.pathname.includes(target))
  }
  

  
  return (
    <div className="text-neutral-400">
      <div className="navbar bg-neutral-800">
        <div className="navbar-start"></div>
        <div className="navbar-center">
          <div className='flex gap-4'>
            <NavLink isActive={isActive} targetPath='/generator' title='Generator'/>
            <NavLink isActive={isActive} targetPath='/editor' title='Editor'/>
            <NavLink isActive={isActive} targetPath='/library' title='Library'/>
          </div>
        </div>
          {
            user?
              (<div className="navbar-end items-center justify-end gap-4 py-1 flex" >
                <div className='text-center hidden md:flex'>
                  Hello {user.user.email}
                </div>
                <Link to='/'>
                  <button onClick={logout} className='btn btn-primary btn-xs md:btn-md'>Sign out</button>
                </Link>
              </div>):
              (<div className="navbar-end flex items-center justify-end gap-4 py-1">
                <Link to='/signup'>
                  <div className="btn btn-secondary">
                    Signup
                  </div>
                </Link>
                <Link to='/login'>
                  <div className="btn btn-primary">Login</div>
                </Link>
              </div>)
          }

      </div>
      <div className='sm:px-24 lg:px-48 bg-neutral-700'>
        <Routes>
          <Route path="/generator" element={<Palette/>}/>
          <Route path="/editor" element={<Editor/>}/>
          <Route path="/editor/:id/" element={<Editor/>}/>
          <Route path="/library" element={<Library/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="*" element={<h1>Error 404: Page not found</h1>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App

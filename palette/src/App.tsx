import { Link, Route, Router, Routes } from 'react-router-dom'
import {useState} from 'react'
import './App.css'
import Editor from './pages/editor'
import Login from './pages/login'
import Palette from './pages/palette'
import Signup from './pages/signup'


type Props = {
  isActive:(targetPath:string)=>boolean,
  setActive:React.Dispatch<React.SetStateAction<string>> 
  targetPath:string,
  title:string
}

function NavLink(props:Props) {
  const {isActive, setActive, targetPath, title} = props
  return (
    <Link to={targetPath} className={`md:text-2xl tab tab-bordered ${isActive(targetPath)?'tab-active':''}`} onClick={()=>setActive(targetPath)}>{title}</Link>

  )
}

function App() {
  const [active, setActive] = useState<string>(window.location.pathname)
  function isActive(target:string):boolean {
    return (target === active)
  }
  
  
  return (
    <div className="h-auto text-neutral-400">
      <div className="navbar bg-neutral-800">
        <div className="navbar-start"></div>
        <div className="navbar-center">
          <div className='tabs flex gap-16'>
            <NavLink isActive={isActive} setActive={setActive} targetPath='/' title='Generator'/>
            <NavLink isActive={isActive} setActive={setActive} targetPath='/editor' title='Editor'/>
          </div>
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
      <div className='h-full px-96 bg-neutral-700'>
        <Routes>
          <Route path="/" element={<Palette/>}/>
          <Route path="/editor" element={<Editor/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App

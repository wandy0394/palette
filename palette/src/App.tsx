import { Link, Route, Router, Routes, useLocation } from 'react-router-dom'
import {useState} from 'react'
import './App.css'
import Editor from './pages/editor'
import Login from './pages/login'
import Palette from './pages/palette'
import Signup from './pages/signup'
import Library from './pages/library'
import Updater from './pages/updater'


type Props = {
  isActive:(targetPath:string)=>boolean,
  targetPath:string,
  title:string
}

function NavLink(props:Props) {
  const {isActive, targetPath, title} = props
  return (
    <Link to={targetPath} className={`md:text-2xl tab tab-bordered ${isActive(targetPath)?'tab-active':''}`} >{title}</Link>

  )
}

function App() {
  const location = useLocation()

  function isActive(target:string):boolean {
    return (target === location.pathname)
  }
  
  
  return (
    <div className="h-auto text-neutral-400">
      <div className="navbar bg-neutral-800">
        <div className="navbar-start"></div>
        <div className="navbar-center">
          <div className='tabs flex gap-16'>
            <NavLink isActive={isActive} targetPath='/' title='Generator'/>
            <NavLink isActive={isActive} targetPath='/editor' title='Editor'/>
            <NavLink isActive={isActive} targetPath='/library' title='Library'/>
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
      <div className='h-full sm:px-24 lg:px-48 bg-neutral-700'>
        <Routes>
          <Route path="/" element={<Palette/>}/>
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

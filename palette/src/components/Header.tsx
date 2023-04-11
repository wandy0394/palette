import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'
import { useState, useRef, useCallback, useEffect } from 'react'
import useOnClickOutside from '../hooks/useClickOutside'
import {FiMenu} from 'react-icons/fi'


const ROOT_PAGE = '/'
type Props = {
    targetPath:string,
    title:string
}
function NavLink(props:Props) {
    
    function isActive(target:string):boolean {
        if (target === ROOT_PAGE) {
          return location.pathname === target
        }
        return (location.pathname.includes(target))
    }

    const {targetPath, title} = props
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

export default function Header() {
    const {user, finishedLoading} = useAuthContext()
    const {logout} = useLogout()
    const [visible, setVisible] = useState<boolean>(false)
    const location = useLocation()


    useEffect(()=>{
        console.log(finishedLoading)
    }, [finishedLoading])

    function toggleMenu() {
      setVisible(p=>!p)
    }


    const popover = useRef<HTMLUListElement>(null);

    const hideMenu = useCallback(()=>{
        setVisible(false)
    }, [])

    useOnClickOutside(popover, hideMenu)
    return (
        <div className="navbar bg-neutral-800">
            {
                true &&
                <>
                    <div className="navbar-start"></div>
                    <div className="navbar-center">
                    <div className='flex gap-4'>
                        <NavLink targetPath='/' title='Generator'/>
                        <NavLink targetPath='/editor' title='Editor'/>
                        <NavLink targetPath='/library' title='Library'/>
                    </div>
                    </div>
                    {
                        user && user.user?
                        (<div className="navbar-end items-center justify-end gap-4 py-1 flex" >
                        <div className='text-center hidden md:flex'>
                            Hello {user.user.name}
                            </div>
                            <Link to='/'>
                            <button onClick={logout} className='btn btn-primary btn-xs md:btn-md'>Sign out</button>
                            </Link>
                            </div>):
                            (<div className="navbar-end flex items-center justify-end gap-4 py-1">
                            <Link to='/signup'>
                            <div className="btn btn-secondary hidden  md:flex md:btn-md">
                                Signup
                            </div>
                            </Link>
                            <Link to='/login'>
                            <div className="btn btn-primary hidden md:flex md:btn-md">Login</div>
                            </Link>
                            <button className='btn md:hidden' onClick={toggleMenu}>
                            <FiMenu/>
                            </button>
                            <ul ref={popover} className={`menu top-16 bg-base-300 rounded ${visible?'absolute':'hidden'}`}>
                            <li>
                                <Link to='/signup'>
                                Signup
                                </Link>
                            </li>
                            <li>
                                <Link to='/login'>
                                Login
                                </Link>
                            </li>
                            </ul>
                        </div>)
                    }
                </>
                }
        </div>
    )
}
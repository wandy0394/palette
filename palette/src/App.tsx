import { Route, Routes } from 'react-router-dom'
import './App.css'
import Editor from './pages/editor'
import Login from './pages/login'
import Palette from './pages/palette'
import Signup from './pages/signup'
import Library from './pages/library'
import { useAuthContext } from './hooks/useAuthContext'
import Header from './components/Header'
import ContentBox from './components/common/ContentBox'

function App() {
  const {finishedLoading} = useAuthContext()
  return (
    <div className="text-neutral-400 w-full">
        <ContentBox finishedLoading={finishedLoading}>
          <Header/>
            <div className='w-full px-8 sm:px-20 lg:px-48 bg-neutral-700'>
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
        </ContentBox>
      
    </div>
  )
}

export default App

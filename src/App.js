import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Home from './pages/Home'
import EditorPage from './pages/EditorPage'

const App = () => {
  return (
    <>
      <div>
        <Toaster position='top-right' />
      </div>
      <Router>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/editor/:roomId' element={<EditorPage />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
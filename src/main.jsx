import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './global.css'
import Index from './pages/Index'
import Student from './pages/Student'
import { api_init } from './utils/api'
import Club from './pages/Club'
import UploadStu from './pages/UploadStu'
import Download from './pages/Download'
import Login from './pages/Login'
api_init().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HashRouter>
        <Routes>
          <Route path='login' element={<Login />} />
          <Route path='/' element={<Index />} >
            <Route path='student' element={<Student />} />
            <Route path='club' element={<Club />} />
            <Route path='upload' element={<UploadStu />} />
            <Route path='download' element={<Download />} />
          </Route>
        </Routes>
      </HashRouter>
    </React.StrictMode>,
  )
})

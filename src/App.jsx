import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Landing from './pages/LandingPage'
import Budget from './pages/Budget'
import Chart from './pages/Chart'
import Form from './pages/Form'
import Profile from './pages/Profile'
import Table from './pages/Table'
import Login from './pages/Login'
import Signup from './pages/SignUp';

function App() {

  return (
    <GoogleOAuthProvider clientId={"533534459884-e20ftri5alg7pf7jmfq2h0l5t6i8gu4e.apps.googleusercontent.com"}>
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/form" element={<Form/>}/>
        <Route path="/table" element={<Table/>}/>
        <Route path="/budget" element={<Budget/>}/>
        <Route path="/chart" element={<Chart/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  )
}

export default App

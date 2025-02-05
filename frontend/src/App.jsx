// import { useState } from 'react'
import LogIn from "./pages/mainpages/login"
import Register from "./pages/mainpages/register"
import Home from "./pages/mainpages/home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./protectedroute/protectedroute"

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/login" element={<LogIn/>}></Route>
        <Route path="/signup" element={<Register/>}></Route>
        {/* ProtectedRoute */}
        <Route element={<ProtectedRoute/>}>
          <Route path="/home" element={<Home />} />
        </Route>
        </Routes>
    </Router>
    </>
  )
}

export default App

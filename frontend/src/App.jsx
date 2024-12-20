import { useState } from 'react'
import { BrowserRouter,Route ,Router, Navigate, Routes } from 'react-router-dom'
import Login from './pages/login.jsx'
import ProtectedRouter from './component/ProtectedRouter.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import Register from './pages/Register.jsx'
import FinancialChart from './pages/FinancialChart.jsx'
import Navbar from './pages/Header.jsx'
import Footer from './pages/Footer.jsx'
import CompareAnalysis from './pages/ComaparAnalsysis.jsx'


function App() {
  return (
    <BrowserRouter>
       <Navbar/>
       <Routes>
       <Route path="/" element={
          <ProtectedRouter>
          <Home />
        </ProtectedRouter>
        }
        />
        <Route path="/FinancialChart" element={
          <ProtectedRouter>
           <FinancialChart/>
         </ProtectedRouter>
        }/>
        <Route path="/Comparison" element={
          <ProtectedRouter>
           <CompareAnalysis/>
         </ProtectedRouter>
        }/>
        <Route path="/login" element={
          <Login />
        }/>
        <Route path="/register" element={ <Register /> }/>
        <Route path="*" element={ <NotFound /> }/>
       </Routes>
       <Footer/>
    </BrowserRouter>
  )
}

export default App

'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useAuth } from './AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isLogin, setIsLogin } = useAuth();
  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="hidden md:block">
             {isLogin && <div className="ml-10 flex items-baseline space-x-4">
                <a href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Home</a>
                <a href="/Comparison" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Comparison</a>
                <a href="/FinancialChart" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Analysis</a>
                <a href="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Logout</a>
              </div>}
            </div>
          </div>
      {!isLogin &&  <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <a href="/register" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Register</a>
              <a href="/login" className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600">Login</a>
            </div>
          </div>}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
           {isLogin && <> <a href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Home</a>
            <a href="/FinancialChart" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Comparison</a>
            <a href="/Comparison" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Analysis</a> 
             <a href="/login" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-500 hover:bg-blue-600">Login</a>
           </> }
           {!isLogin && <> <a href="/register" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Register</a>
            <a href="/login" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-500 hover:bg-blue-600">Login</a> </>}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar


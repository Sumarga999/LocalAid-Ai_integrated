import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/localaid-logo.png';

function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex-shrink-0">
          <img 
            src={logo} 
            alt="LocalAid Logo" 
            className="h-10 w-auto object-contain" /* Adjust h-10 to h-12 or h-8 to make it bigger/smaller */
          />
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-plus-jakarta text-sm font-medium">
          
          {/* UPDATED FIND TASKS LINK HERE */}
          <Link className="text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400 transition-colors flex items-center gap-1" to="/tasks">
            Find Tasks
          </Link>
          
          {/* UPDATED ADMIN LINK HERE */}
          <Link className="text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400 transition-colors flex items-center gap-1" to="/admin">
            <span className="material-symbols-outlined text-[20px]">shield</span> Admin
          </Link>
          
          {/* FIXED OUR IMPACT LINK HERE */}
          <Link className="text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400 transition-colors" to="/ourimpact">
            Our Impact
          </Link>
          
          <Link className="text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400 transition-colors" to="/about">
            About Us
          </Link>
        </nav>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-slate-600 hover:text-[#2e7d32] transition-colors font-medium">
            Login
          </Link>
          <Link 
            to="/signup" 
            className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            Sign Up
          </Link>
        </div>
        
      </div>
    </header>
  );
}

export default Navbar;
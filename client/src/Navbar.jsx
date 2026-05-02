import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/localaid-logo.png';

function Navbar() {
  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex-shrink-0">
          <img 
            src={logo} 
            alt="LocalAid Logo" 
            className="h-10 w-auto object-contain" /* Adjust h-10 to h-12 or h-8 to make it bigger/smaller */
          />
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-plus-jakarta text-sm font-medium">
          <a className="text-green-700 dark:text-green-400 font-bold border-b-2 border-green-700 dark:border-green-400 pb-1" href="#">Find Tasks</a>
          <a className="text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400 transition-colors flex items-center gap-1" href="#">
            <span className="material-symbols-outlined text-[20px]">shield</span> Admin
          </a>
          <a className="text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400 transition-colors" href="#">Our Impact</a>
          <a className="text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400 transition-colors" href="#">About Us</a>
          <a className="text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400 transition-colors" href="#">Resources</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md px-4 py-2 transition-colors font-label-md">Log In</button>
          <Link to="/signup" className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-lg font-label-md transition-transform active:scale-95 duration-150 shadow-sm inline-block text-center">Get Started</Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
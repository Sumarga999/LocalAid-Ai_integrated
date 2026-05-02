import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from './assets/localaid-logo.png';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user is logged in every time the URL changes
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  // Handle the logout process
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/'); // Send them back to the homepage
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        
        {/* LOGO - Always visible, using your custom image */}
        <Link to="/" className="flex-shrink-0">
          <img 
            src={logo} 
            alt="LocalAid Logo" 
            className="h-10 w-auto object-contain" 
          />
        </Link>

        {user ? (
          /* =========================================
             LOGGED-IN VIEW
             ========================================= */
          <>
            <nav className="hidden md:flex items-center gap-8 font-plus-jakarta text-sm font-medium">
              <Link className="text-slate-600 hover:text-green-700 transition-colors flex items-center gap-1" to="/tasks">
                Find Tasks
              </Link>
              <Link className="text-slate-600 hover:text-green-700 transition-colors" to="/ourimpact">
                Our Impact
              </Link>
              {/* Dynamic Dashboard Link */}
              <Link 
                className="text-[#2e7d32] hover:text-[#1b5e20] transition-colors flex items-center gap-1 font-bold" 
                to={user.role === 'volunteer' ? '/volunteer' : '/get-help'}
              >
                <span className="material-symbols-outlined text-[20px]">dashboard</span> My Dashboard
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="bg-[#e8f5e9] text-[#2e7d32] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 capitalize shadow-sm">
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
                {user.role === 'getHelp' ? 'Get Help' : user.role}
              </div>
              <button 
                onClick={handleLogout}
                className="bg-[#e53935] hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </button>
            </div>
          </>
        ) : (
          /* =========================================
             LOGGED-OUT VIEW (Your Original Design!)
             ========================================= */
          <>
            <nav className="hidden md:flex items-center gap-8 font-plus-jakarta text-sm font-medium">
              <Link className="text-slate-600 hover:text-green-700 transition-colors flex items-center gap-1" to="/tasks">
                Find Tasks
              </Link>
              <Link className="text-slate-600 hover:text-green-700 transition-colors flex items-center gap-1" to="/admin">
                <span className="material-symbols-outlined text-[20px]">shield</span> Admin
              </Link>
              <Link className="text-slate-600 hover:text-green-700 transition-colors" to="/ourimpact">
                Our Impact
              </Link>
              <Link className="text-slate-600 hover:text-green-700 transition-colors" to="/about">
                About Us
              </Link>
            </nav>

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
          </>
        )}
        
      </div>
    </header>
  );
}

export default Navbar;
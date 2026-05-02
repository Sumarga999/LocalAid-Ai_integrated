import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function VolunteerDashboard() {
  // State to handle which tab is currently selected
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Later, clear user tokens here
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-plus-jakarta flex flex-col">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600 text-3xl">favorite</span>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">LocalAid</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
            <Link to="/tasks" className="hover:text-green-600 transition-colors">Task Board</Link>
            <Link to="/dashboard" className="text-green-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">dashboard</span> My Dashboard
            </Link>
            <Link to="/admin" className="hover:text-green-600 transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">shield</span> Admin
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="bg-[#e8f5e9] text-[#2e7d32] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              Volunteer
            </div>
            <button 
              onClick={handleLogout}
              className="bg-[#e53935] hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full">
        
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-slate-900 leading-tight">My Volunteer Dashboard</h1>
          <p className="text-slate-500 mt-1">Track and manage the requests you've accepted</p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total Tasks</p>
              <p className="text-3xl font-light text-[#2e7d32]">0</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">In Progress</p>
              <p className="text-3xl font-light text-blue-600">0</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined">schedule</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Completed</p>
              <p className="text-3xl font-light text-[#2e7d32]">0</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-2xl border border-slate-200 shadow-sm border-b-0 flex">
          <button 
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'all' ? 'border-[#2e7d32] text-[#2e7d32]' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            All Tasks (0)
          </button>
          <button 
            onClick={() => setActiveTab('progress')}
            className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'progress' ? 'border-[#2e7d32] text-[#2e7d32]' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            In Progress (0)
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'completed' ? 'border-[#2e7d32] text-[#2e7d32]' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Completed (0)
          </button>
        </div>

        {/* Empty State Area */}
        <div className="bg-white p-16 rounded-b-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px] text-slate-400">error</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No tasks found</h2>
          <p className="text-slate-500 max-w-md">
            You haven't accepted any requests yet. Visit the Task Board to find tasks to help with!
          </p>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#2e7d32] text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-green-700 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-white text-3xl">favorite</span>
              <span className="text-2xl font-bold tracking-tight">LocalAid</span>
            </div>
            <p className="text-green-100 text-sm">Connecting communities, one helping hand at a time.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-green-100 text-sm">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">mail</span> support@localaid.org</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">phone</span> (555) 123-4567</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">location_on</span> San Francisco, CA</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <p className="text-green-100 text-sm leading-relaxed">
              LocalAid is a civic tech platform dedicated to building stronger communities by connecting those who need help with volunteers ready to assist.
            </p>
          </div>
        </div>
        <div className="text-center text-green-200 text-sm flex flex-col items-center gap-2">
          <p>© 2026 LocalAid. All rights reserved.</p>
          <Link to="/admin" className="hover:text-white transition-colors flex items-center gap-1 text-xs">
            <span className="material-symbols-outlined text-[14px]">shield</span> Admin Access
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default VolunteerDashboard;
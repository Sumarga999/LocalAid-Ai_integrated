import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Volunteer() {
  const [activeTab, setActiveTab] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Fetch tasks on load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // If user isn't logged in, tell them to log in
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h2>
        <Link to="/login" className="bg-[#2e7d32] text-white px-6 py-2 rounded-xl">Go to Login</Link>
      </div>
    );
  }

  // --- DATA FILTERING ---
  // 1. Get ONLY tasks this user has accepted
  const myVolunteerTasks = tasks.filter(task => 
  task.volunteer === user._id || task.volunteer === user.id
);

  // 2. Calculate Stats
  const totalCount = myVolunteerTasks.length;
  const inProgressCount = myVolunteerTasks.filter(t => t.status === 'in-progress').length;
  const completedCount = myVolunteerTasks.filter(t => t.status === 'completed').length;

  // 3. Filter tasks based on the active tab
  const displayedTasks = myVolunteerTasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'progress') return task.status === 'in-progress';
    if (activeTab === 'completed') return task.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-plus-jakarta flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full">
        
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-slate-900 leading-tight">My Volunteer Dashboard</h1>
          <p className="text-slate-500 mt-1">Track and manage the requests you've accepted</p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total Tasks</p>
              <p className="text-3xl font-light text-[#2e7d32]">{totalCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">In Progress</p>
              <p className="text-3xl font-light text-blue-600">{inProgressCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined">schedule</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Completed</p>
              <p className="text-3xl font-light text-[#2e7d32]">{completedCount}</p>
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
            All Tasks ({totalCount})
          </button>
          <button 
            onClick={() => setActiveTab('progress')}
            className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'progress' ? 'border-[#2e7d32] text-[#2e7d32]' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'completed' ? 'border-[#2e7d32] text-[#2e7d32]' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Task List or Empty State */}
        <div className="bg-white p-8 rounded-b-2xl border border-slate-200 shadow-sm">
          {loading ? (
            <div className="text-center text-slate-500 py-10">Loading your tasks...</div>
          ) : displayedTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedTasks.map(task => (
  <Link 
    to={`/task/${task._id}`} 
    key={task._id} 
    className="block group"
  >
    <div className="border border-slate-200 rounded-xl hover:shadow-md transition-all bg-white overflow-hidden flex flex-col h-full">
      
      {/* 1. Task Image Thumbnail */}
      <div className="h-40 bg-slate-100 overflow-hidden relative">
        {task.images && task.images.length > 0 ? (
          <img 
            src={task.images[0]} 
            alt={task.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <span className="material-symbols-outlined text-3xl">image</span>
            <span className="text-xs uppercase font-bold tracking-wider">No Image</span>
          </div>
        )}
        
        {/* Status Badge Over Image */}
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-sm ${
            task.status === 'completed' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
          }`}>
            {task.status === 'in-progress' ? 'In Progress' : 'Completed'}
          </span>
        </div>
      </div>

      {/* 2. Task Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#2e7d32] transition-colors mb-2">
          {task.title}
        </h3>
        
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {task.description}
        </p>
        
        {/* 3. Address Section (Sticks to bottom) */}
        <div className="mt-auto">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-2 items-start text-sm text-slate-700">
            <span className="material-symbols-outlined text-[18px] text-[#2e7d32] mt-0.5">location_on</span>
            <div>
              <span className="font-semibold block text-[12px] text-slate-500">EXACT ADDRESS:</span>
              <span className="line-clamp-1">{task.location?.address || 'Address missing'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Link>
))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px] text-slate-400">error</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No tasks found</h2>
              <p className="text-slate-500 max-w-md mb-6">
                {activeTab === 'all' 
                  ? "You haven't accepted any requests yet. Visit the Task Board to find tasks to help with!"
                  : `You have no ${activeTab === 'progress' ? 'in-progress' : 'completed'} tasks right now.`}
              </p>
              {activeTab === 'all' && (
                <Link to="/tasks" className="bg-[#2e7d32] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#1b5e20] transition-colors">
                  Browse Task Board
                </Link>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default Volunteer;
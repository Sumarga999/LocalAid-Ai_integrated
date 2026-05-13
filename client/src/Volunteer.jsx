import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Volunteer() {
  const [activeTab, setActiveTab] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

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

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h2>
        <Link to="/login" className="bg-[#2e7d32] text-white px-6 py-2 rounded-xl">Go to Login</Link>
      </div>
    );
  }

  const myVolunteerTasks = tasks.filter(task => 
    task.volunteer === user._id || task.volunteer === user.id
  );

  const totalCount = myVolunteerTasks.length;
  const inProgressCount = myVolunteerTasks.filter(t => t.status === 'in-progress').length;
  const completedCount = myVolunteerTasks.filter(t => t.status === 'completed').length;
  // Added count for rejected tasks
  const rejectedCount = myVolunteerTasks.filter(t => t.status === 'rejected').length;

  const displayedTasks = myVolunteerTasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'progress') return task.status === 'in-progress';
    if (activeTab === 'completed') return task.status === 'completed';
    if (activeTab === 'rejected') return task.status === 'rejected'; // Added rejected filter
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"> {/* Changed to grid-cols-4 */}
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

          {/* NEW REJECTED STAT CARD */}
          <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Needs Fixing</p>
              <p className="text-3xl font-light text-red-600">{rejectedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <span className="material-symbols-outlined">report_problem</span>
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
        <div className="bg-white rounded-t-2xl border border-slate-200 shadow-sm border-b-0 flex overflow-x-auto">
          {['all', 'progress', 'rejected', 'completed'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] py-4 text-sm font-medium text-center border-b-2 transition-colors capitalize ${
                activeTab === tab ? 'border-[#2e7d32] text-[#2e7d32]' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'progress' ? 'In Progress' : tab} ({
                tab === 'all' ? totalCount : tab === 'progress' ? inProgressCount : tab === 'rejected' ? rejectedCount : completedCount
              })
            </button>
          ))}
        </div>

        {/* Task List Section */}
        <div className="bg-white p-4 md:p-6 rounded-b-2xl border border-slate-200 shadow-sm">
          {loading ? (
            <div className="text-center text-slate-500 py-10 italic">Loading your assignments...</div>
          ) : displayedTasks.length > 0 ? (
            <div className="flex flex-col gap-4">
              {displayedTasks.map(task => (
                <div key={task._id} className={`bg-white border rounded-2xl p-4 transition-all ${task.status === 'rejected' ? 'border-red-200 bg-red-50/30' : 'border-slate-100 hover:border-green-200 hover:shadow-md'}`}>
                  
                  {/* REJECTION NOTICE BOX */}
                  {task.status === 'rejected' && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-xl flex items-start gap-3">
                      <span className="material-symbols-outlined text-red-600 mt-0.5">error</span>
                      <div>
                        <p className="text-sm font-bold text-red-800">Completion Declined</p>
                        <p className="text-sm text-red-700 italic">"{(task.rejectionReason) || 'No reason provided by requester.'}"</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row items-center gap-5">
                    
                    {/* Thumbnail */}
                    <div className="w-full md:w-24 h-24 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      {task.images && task.images.length > 0 ? (
                        <img src={task.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined">image</span>
                        </div>
                      )}
                    </div>

                    {/* Task Info */}
                    <div className="flex-grow text-center md:text-left overflow-hidden">
                      <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          task.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          task.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {task.status.replace('-', ' ')}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {task.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg truncate mb-1">{task.title}</h3>
                      <div className="flex items-center justify-center md:justify-start gap-1 text-slate-500 text-sm">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        <span className="truncate">{task.location?.address || 'No address'}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 w-full md:w-auto">
                      <Link 
                        to={`/task/${task._id}`}
                        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
                          task.status === 'rejected' 
                          ? 'bg-red-600 text-white border-red-600 hover:bg-red-700' 
                          : 'bg-slate-50 text-slate-700 hover:bg-[#2e7d32] hover:text-white border-slate-200'
                        }`}
                      >
                        {task.status === 'rejected' ? 'Fix & Resubmit' : 'Manage Task'}
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </Link>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <span className="material-symbols-outlined text-[48px] text-slate-300 mb-3">assignment_late</span>
              <h2 className="text-xl font-bold text-slate-900 mb-1">No tasks to show</h2>
              <p className="text-slate-500 mb-6 text-sm">Looks like there's nothing in this category yet.</p>
              <Link to="/tasks" className="text-[#2e7d32] font-bold hover:underline">Browse Task Board →</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Volunteer;
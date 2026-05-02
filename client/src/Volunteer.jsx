import React, { useState } from 'react';

function Volunteer() {
  // State to handle which tab is currently selected
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-slate-50 font-plus-jakarta flex flex-col">
      
      {/* MAIN CONTENT ONLY - No Header or Footer! */}
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
    </div>
  );
}

export default Volunteer;
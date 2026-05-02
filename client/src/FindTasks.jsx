import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function FindTasks() {
  // 1. Search state (from previous step)
  const [searchTerm, setSearchTerm] = useState('');
  
  // 2. NEW: State to track if we are in 'list' mode or 'map' mode
  const [viewMode, setViewMode] = useState('list'); 

  const tasks = [
    {
      id: 1,
      priority: 'High Priority',
      priorityColor: 'bg-[#e53935] text-white',
      category: 'Shopping',
      categoryIcon: 'shopping_cart',
      title: 'Grocery Shopping Assistance',
      description: 'Need help with weekly grocery shopping. List of items will be provided. Prefer someone with a car.',
      requester: 'Sarah Johnson',
      date: '3/20/2026, 2:00:00 PM',
      location: '123 Main St, San Francisco',
      posted: '44d ago',
      lat: 37.7749, // Added rough coordinates for future map integration
      lng: -122.4194
    },
    {
      id: 2,
      priority: 'Medium Priority',
      priorityColor: 'bg-[#ffca28] text-slate-900',
      category: 'Moving',
      categoryIcon: 'package',
      title: 'Help Moving Furniture',
      description: 'Moving a couch and bookshelf to a new apartment. Need 2-3 volunteers. Truck available.',
      requester: 'Michael Chen',
      date: '3/22/2026, 10:00:00 AM',
      location: '456 Oak Ave, San Francisco',
      posted: '45d ago'
    },
    {
      id: 3,
      priority: 'Low Priority',
      priorityColor: 'bg-slate-100 text-slate-600',
      category: 'Pet Care',
      categoryIcon: 'pets',
      title: 'Dog Walking',
      description: 'Need someone to walk my golden retriever for 30 minutes. Very friendly dog, easy to handle.',
      requester: 'Emma Davis',
      date: '3/21/2026, 4:30:00 PM',
      location: '789 Elm St, San Francisco',
      posted: '44d ago'
    },
    {
      id: 4,
      priority: 'Low Priority',
      priorityColor: 'bg-slate-100 text-slate-600',
      category: 'Technology',
      categoryIcon: 'computer',
      title: 'Computer Setup Help',
      description: 'Need assistance setting up new computer and installing software. No heavy lifting required.',
      requester: 'Robert Wilson',
      date: '3/23/2026, 1:00:00 PM',
      location: '321 Pine St, San Francisco',
      posted: '44d ago'
    },
    {
      id: 5,
      priority: 'High Priority',
      priorityColor: 'bg-[#e53935] text-white',
      category: 'Childcare',
      categoryIcon: 'child_care',
      title: 'After-School Childcare',
      description: 'Need someone to watch my 8-year-old daughter for 2 hours after school. Will provide snacks.',
      requester: 'Lisa Martinez',
      date: '3/20/2026, 3:00:00 PM',
      location: '567 Maple Dr, San Francisco',
      posted: '44d ago'
    },
    {
      id: 6,
      priority: 'High Priority',
      priorityColor: 'bg-[#e53935] text-white',
      category: 'Shopping',
      categoryIcon: 'shopping_cart',
      title: 'Pharmacy Pickup',
      description: 'Need someone to pick up prescription medication from CVS. Will provide ID and insurance info.',
      requester: 'James Anderson',
      date: '3/20/2026, 12:00:00 PM',
      location: '234 Cedar Ln, San Francisco',
      posted: '44d ago'
    }
  ];

  const filteredTasks = tasks.filter((task) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.category.toLowerCase().includes(searchLower) ||
      task.location.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 font-plus-jakarta">
      <div className="max-w-7xl mx-auto px-6"> {/* Increased max-width slightly for map view */}
        
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-[32px] font-bold text-slate-900 leading-tight">Task Board</h1>
          <p className="text-slate-500 mt-1">{filteredTasks.length} tasks available</p>
        </div>

        {/* Controls / Filter Bar */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          
          {/* 3. DYNAMIC Toggle Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition-all ${
                viewMode === 'list' 
                  ? 'bg-[#2e7d32] text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span> List
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition-all ${
                viewMode === 'map' 
                  ? 'bg-[#2e7d32] text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">map</span> Map
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 text-sm"
              />
            </div>
            <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm border border-slate-200">
              <span className="material-symbols-outlined text-[18px]">filter_alt</span> Filters
            </button>
          </div>
        </div>

        {/* 4. CONDITIONAL RENDERING: Show List OR Map based on state */}
        {viewMode === 'list' ? (
          
          /* --- LIST VIEW --- */
          <div className="flex flex-col gap-5 max-w-5xl mx-auto">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div key={task.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.priorityColor}`}>{task.priority}</span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#e8f5e9] text-[#2e7d32] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">{task.categoryIcon}</span> {task.category}
                        </span>
                      </div>
                      <h2 className="text-[22px] font-bold text-slate-900 mb-2">{task.title}</h2>
                      <p className="text-slate-500 text-sm mb-5 leading-relaxed">{task.description}</p>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px]">person</span>
                          <span>Requested by: <span className="text-slate-700 font-medium">{task.requester}</span></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                          <span>Needed: <span className="text-slate-700 font-medium">{task.date}</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 w-full mt-1">
                          <span className="material-symbols-outlined text-[18px]">location_on</span>
                          <span>Location: <span className="text-slate-700 font-medium">{task.location}</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between mt-4 md:mt-0 min-w-[120px]">
                      <p className="text-slate-400 text-sm mb-4">Posted {task.posted}</p>
                      <Link to="/login" className="bg-slate-100 text-slate-500 font-medium px-5 py-2.5 rounded-xl text-sm w-full md:w-auto hover:bg-slate-200 transition-colors text-center inline-block">
                        Sign in to help
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-[48px] text-slate-300 mb-4">search_off</span>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No tasks found</h3>
                <p className="text-slate-500">We couldn't find any tasks matching "{searchTerm}".</p>
                <button onClick={() => setSearchTerm('')} className="mt-6 text-[#2e7d32] font-medium hover:underline">Clear search</button>
              </div>
            )}
          </div>

        ) : (

          /* --- MAP VIEW (Split Layout) --- */
          <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
            
            {/* Left Side: Scrollable Mini-List */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 pb-4 h-[400px] lg:h-full custom-scrollbar">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div key={task.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-green-500 hover:shadow-md cursor-pointer transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${task.priorityColor}`}>{task.priority}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{task.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-3">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span className="truncate">{task.location}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-6 rounded-xl border border-slate-100 text-center mt-4">
                  <p className="text-slate-500 text-sm">No tasks match your search.</p>
                </div>
              )}
            </div>

            {/* Right Side: Map Container */}
            <div className="w-full lg:w-2/3 h-full bg-slate-200 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
              {/* Note: This is an embedded Google Map centered on San Francisco. 
                  To show individual map pins for each task later, you will need to implement 
                  the Google Maps JavaScript API or a library like React-Leaflet! */}
              <iframe 
                src="https://maps.google.com/maps?q=San+Francisco&t=&z=12&ie=UTF8&iwloc=&output=embed" 
                className="w-full h-full"
                frameBorder="0"
                scrolling="no"
                title="Task Locations Map"
              ></iframe>
              
              {/* Optional: A little overlay badge to explain the map to users */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-slate-100 text-sm font-medium text-slate-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600 text-[18px]">info</span>
                Showing tasks in San Francisco area
              </div>
            </div>
          </div>

        )}

      </div>
    </div>
  );
}

export default FindTasks;
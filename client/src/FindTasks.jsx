import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function FindTasks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); 
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedLocation, setSelectedLocation] = useState('Nepal'); 

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // --- HELPER FUNCTIONS ---

  const getPriorityInfo = (urgency) => {
    const level = urgency?.toLowerCase() || '';
    if (level.includes('high') || level.includes('critical')) {
      return { text: 'High Priority', color: 'bg-[#e53935] text-white' };
    }
    if (level.includes('medium')) {
      return { text: 'Medium Priority', color: 'bg-[#ffca28] text-slate-900' };
    }
    return { text: 'Low Priority', color: 'bg-slate-100 text-slate-600' };
  };

  const getDisplayAddress = (task) => {
    if (!task) return 'Location unavailable';
    const rawAddress = task.location?.address || 'Location unavailable';
    
    const isAssignedVolunteer = user && task.volunteer === user._id;

    if (isAssignedVolunteer || (user && task.requester === user._id)) {
      return rawAddress; 
    }

    const addressParts = rawAddress.split(',');
    if (addressParts.length > 1) {
      return `Approx: ${addressParts.slice(1).join(',').trim()}`;
    }

    return 'Area hidden until accepted';
  };

  const getCategoryIcon = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('shop')) return 'shopping_cart';
    if (cat.includes('mov')) return 'package';
    if (cat.includes('pet')) return 'pets';
    if (cat.includes('tech')) return 'computer';
    if (cat.includes('child')) return 'child_care';
    return 'volunteer_activism'; 
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'recently';
    const diff = new Date() - new Date(dateString);
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  // Fetch real tasks from MongoDB on load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data);
        
        // FIXED: Set the initial map pin to the SECURE masked address
        if (data.length > 0) {
          setSelectedLocation(getDisplayAddress(data[0]));
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleAcceptTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("You must be logged in to accept tasks.");
        return;
      }

      // Call your new backend route
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to accept task");
      }

      // Success! Update the tasks list in React state
      // We map through the existing tasks and replace the old one with the newly updated one
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskId ? data : task)
      );

      // (Optional) Show a success alert or toast notification
      alert("Task accepted! The exact address is now visible.");

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // --- FILTER LOGIC ---
  const filteredTasks = tasks.filter((task) => {
    const searchLower = searchTerm.toLowerCase();
    const title = task.title?.toLowerCase() || '';
    const desc = task.description?.toLowerCase() || '';
    const cat = task.category?.toLowerCase() || '';
    const loc = task.location?.address?.toLowerCase() || '';
    
    return (
      title.includes(searchLower) ||
      desc.includes(searchLower) ||
      cat.includes(searchLower) ||
      loc.includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 font-plus-jakarta">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-[32px] font-bold text-slate-900 leading-tight">Task Board</h1>
          <p className="text-slate-500 mt-1">
            {loading ? 'Loading tasks...' : `${filteredTasks.length} tasks available`}
          </p>
        </div>

        {/* Controls / Filter Bar */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          
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

        {/* CONDITIONAL RENDERING: Show List OR Map */}
        {viewMode === 'list' ? (
          
          /* --- LIST VIEW --- */
          <div className="flex flex-col gap-5 max-w-5xl mx-auto">
            {!loading && filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const priorityInfo = getPriorityInfo(task.urgency);
                
                return (
                  <div key={task._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityInfo.color}`}>
                            {priorityInfo.text}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#e8f5e9] text-[#2e7d32] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">{getCategoryIcon(task.category)}</span> {task.category}
                          </span>
                        </div>
                        <h2 className="text-[22px] font-bold text-slate-900 mb-2">{task.title}</h2>
                        <p className="text-slate-500 text-sm mb-5 leading-relaxed">{task.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">person</span>
                            <span>Requested by: <span className="text-slate-700 font-medium">{task.requester?.name || 'Community Member'}</span></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            <span>Needed: <span className="text-slate-700 font-medium">
                              {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'Flexible'}
                            </span></span>
                          </div>
                          <div className="flex items-center gap-1.5 w-full mt-1">
                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                            {/* FIXED: Uses getDisplayAddress */}
                            <span>Location: <span className="text-slate-700 font-medium">{getDisplayAddress(task)}</span></span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between mt-4 md:mt-0 min-w-[120px]">
                        <p className="text-slate-400 text-sm mb-4">Posted {getTimeAgo(task.createdAt)}</p>
                        
                        {user && user.role === 'volunteer' ? (
  /* Check if the current user already accepted this task */
  task.volunteer === user._id ? (
    <button disabled className="bg-slate-200 text-slate-500 font-medium px-5 py-2.5 rounded-xl text-sm w-full md:w-auto transition-colors text-center inline-block cursor-not-allowed">
      <span className="flex items-center justify-center gap-1">
        <span className="material-symbols-outlined text-[18px]">check_circle</span>
        Task Accepted
      </span>
    </button>
  ) : task.volunteer ? (
    /* Check if someone else already accepted it */
    <button disabled className="bg-slate-100 text-slate-400 border border-slate-200 font-medium px-5 py-2.5 rounded-xl text-sm w-full md:w-auto transition-colors text-center inline-block cursor-not-allowed">
      Already Taken
    </button>
  ) : (
    /* Available to accept */
    <button 
      onClick={() => handleAcceptTask(task._id)}
      className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-medium px-5 py-2.5 rounded-xl text-sm w-full md:w-auto transition-colors text-center inline-block shadow-sm"
    >
      Accept Task
    </button>
  )
) : (
  <Link to="/login" className="bg-slate-100 text-slate-500 font-medium px-5 py-2.5 rounded-xl text-sm w-full md:w-auto hover:bg-slate-200 transition-colors text-center inline-block">
    Sign in to help
  </Link>
)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : !loading ? (
              <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-[48px] text-slate-300 mb-4">search_off</span>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No tasks found</h3>
                <p className="text-slate-500">We couldn't find any tasks matching "{searchTerm}".</p>
                <button onClick={() => setSearchTerm('')} className="mt-6 text-[#2e7d32] font-medium hover:underline">Clear search</button>
              </div>
            ) : null}
          </div>

        ) : (

          /* --- MAP VIEW (Split Layout) --- */
          <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
            
            {/* Left Side: Scrollable Mini-List */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 pb-4 h-[400px] lg:h-full custom-scrollbar">
              {!loading && filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const priorityInfo = getPriorityInfo(task.urgency);
                  
                  // FIXED: Use getDisplayAddress to secure the sidebar
                  const taskAddress = getDisplayAddress(task);
                  const isSelected = selectedLocation === taskAddress; 
                  
                  return (
                    <div 
                      key={task._id} 
                      onClick={() => setSelectedLocation(taskAddress)}
                      className={`p-5 rounded-2xl shadow-sm border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-green-50 border-[#2e7d32] ring-1 ring-[#2e7d32]' 
                          : 'bg-white border-slate-100 hover:border-green-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityInfo.color}`}>
                          {priorityInfo.text}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{task.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-3">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span className="truncate">{taskAddress}</span>
                      </div>
                    </div>
                  );
                })
              ) : !loading ? (
                <div className="bg-white p-6 rounded-xl border border-slate-100 text-center mt-4">
                  <p className="text-slate-500 text-sm">No tasks match your search.</p>
                </div>
              ) : null}
            </div>

            {/* Right Side: Map Container */}
            <div className="w-full lg:w-2/3 h-full bg-slate-200 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
              {/* FIXED: Corrected iframe URL syntax and protocol to https */}
              <iframe 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedLocation)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full"
                frameBorder="0"
                scrolling="no"
                title="Task Locations Map"
              ></iframe>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-slate-100 text-sm font-medium text-slate-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600 text-[18px]">push_pin</span>
                Pinned: {selectedLocation}
              </div>
            </div>
          </div>

        )}

      </div>
    </div>
  );
}

export default FindTasks;
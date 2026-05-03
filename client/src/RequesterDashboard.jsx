import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RequesterDashboard() {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = user?._id?.toString() || user?.userId?.toString() || user?.id?.toString();

  useEffect(() => {
    const fetchMyRequests = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        
        const allTasks = await response.json();

        // Filter tasks where the current user is the requester
        const myTasks = allTasks.filter(task => {
          const taskRequesterId = task.requester?._id?.toString() || task.requester?.toString();
          return taskRequesterId === currentUserId;
        });

        setRequests(myTasks);
      } catch (error) {
        console.error("Error fetching dashboard tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, [currentUserId]);

  const stats = {
    all: requests.length,
    open: requests.filter(r => r.status?.toLowerCase() === 'open').length,
    progress: requests.filter(r => r.status?.toLowerCase() === 'in-progress' || r.status?.toLowerCase() === 'in progress').length,
    completed: requests.filter(r => r.status?.toLowerCase() === 'completed').length,
  };

  const filteredRequests = requests.filter(req => {
    const status = req.status ? req.status.toLowerCase() : '';
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return status === 'open';
    if (activeTab === 'progress') return status === 'in-progress' || status === 'in progress';
    if (activeTab === 'completed') return status === 'completed';
    return true;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center font-plus-jakarta text-slate-500">Loading your dashboard...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-plus-jakarta text-slate-800">
        <h2 className="text-2xl font-bold mb-2">Please Log In</h2>
        <p className="mb-4">You need to be logged in to view your dashboard.</p>
        <button onClick={() => navigate('/login')} className="bg-[#2e7d32] text-white px-6 py-2 rounded-lg font-bold">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 font-plus-jakarta min-h-screen w-full relative">
      <main className="max-w-7xl mx-auto px-6 py-10 w-full">
        
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-[32px] font-bold text-slate-900 leading-tight">My Requests Dashboard</h1>
            <p className="text-slate-500 mt-1">Track your help requests and manage volunteers</p>
          </div>
          <button onClick={() => navigate('/get-help')} className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">add</span>
            New Request
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Requests" count={stats.all} color="text-[#2e7d32]" bg="bg-[#e8f5e9]" icon="description" />
          <StatCard title="Open" count={stats.open} color="text-orange-400" bg="bg-orange-50" icon="schedule" />
          <StatCard title="In Progress" count={stats.progress} color="text-blue-500" bg="bg-blue-50" icon="group" />
          <StatCard title="Completed" count={stats.completed} color="text-[#2e7d32]" bg="bg-[#e8f5e9]" icon="check_circle" />
        </div>

        <div className="bg-white rounded-t-2xl border border-slate-200 shadow-sm border-b-0 flex overflow-x-auto">
          <TabButton label="All Requests" count={stats.all} active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
          <TabButton label="Open" count={stats.open} active={activeTab === 'open'} onClick={() => setActiveTab('open')} />
          <TabButton label="In Progress" count={stats.progress} active={activeTab === 'progress'} onClick={() => setActiveTab('progress')} />
          <TabButton label="Completed" count={stats.completed} active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} />
        </div>

        <div className="bg-white p-6 rounded-b-2xl border border-slate-200 shadow-sm min-h-[400px]">
          {filteredRequests.length === 0 ? (
            <EmptyState tab={activeTab} />
          ) : (
            <div className="flex flex-col gap-4">
              {filteredRequests.map((request) => (
                <div key={request._id} className="border border-slate-100 bg-white p-5 rounded-xl flex justify-between items-center hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full w-fit ${getStatusStyles(request.status)}`}>
                      {request.status}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800">{request.title}</h3>
                    <p className="text-slate-500 text-sm">
                      {request.category} • Posted on {new Date(request.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* THIS IS THE CRITICAL CHANGE: Redirects directly to the detail page */}
                  <button 
                    onClick={() => navigate(`/task/${request._id}`)}
                    className="text-[#2e7d32] font-semibold hover:text-green-800 transition-colors flex items-center gap-1"
                  >
                    View Details
                    <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function StatCard({ title, count, color, bg, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <p className={`text-3xl font-light ${color}`}>{count}</p>
      </div>
      <div className={`w-12 h-12 rounded-full ${bg} ${color} flex items-center justify-center`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
  );
}

function TabButton({ label, count, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex-1 min-w-[140px] py-4 text-sm font-medium text-center border-b-2 transition-all ${active ? 'border-[#2e7d32] text-[#2e7d32] bg-green-50/30' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
      {label} ({count})
    </button>
  );
}

function EmptyState({ tab }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-slate-400">inventory_2</span>
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">No {tab !== 'all' ? tab : ''} requests found</h2>
      <p className="text-slate-500 max-w-sm">
        {tab === 'all' ? "You haven't created any help requests yet. Start by posting a new request!" : `You don't have any requests currently marked as "${tab}".`}
      </p>
    </div>
  );
}

function getStatusStyles(status) {
  const s = status ? status.toLowerCase() : '';
  if (s === 'open') return 'bg-orange-100 text-orange-700';
  if (s === 'in-progress' || s === 'in progress') return 'bg-blue-100 text-blue-700';
  if (s === 'completed') return 'bg-green-100 text-green-700';
  return 'bg-slate-100 text-slate-700';
}

export default RequesterDashboard;
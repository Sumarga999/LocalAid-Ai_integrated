import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks/${id}`);
        if (!response.ok) throw new Error('Task not found');
        const data = await response.json();
        setTask(data);
      } catch (err) {
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetails();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading details...</div>;
  if (!task) return <div className="p-10 text-center">Task not found!</div>;

  // Check if the current user is the volunteer or the requester
//  const isInvolved = user && (
//   task.volunteer?.toString() === (user._id || user.userId) || 
//   task.requester?.toString() === (user._id || user.userId)
// );

// --- PASTE STEP 2 CODE HERE ---
  const currentUserId = user?._id?.toString() || user?.userId?.toString() || user?.id?.toString();
  const taskVolunteerId = task.volunteer?._id?.toString() || task.volunteer?.toString();
  const taskRequesterId = task.requester?._id?.toString() || task.requester?.toString();

  const isInvolved = currentUserId && (
    currentUserId === taskVolunteerId || 
    currentUserId === taskRequesterId
  );
  
  // Optional: Keep the logs to verify it's working
  console.log("Current User:", currentUserId);
  console.log("Volunteer on Task:", taskVolunteerId);
  console.log("Is involved?", isInvolved);

  return (
    <div className="min-h-screen bg-slate-50 font-plus-jakarta pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Image Gallery Section */}
          <div className="bg-slate-100 aspect-video w-full flex items-center justify-center overflow-hidden border-b border-slate-200">
            {task.images && task.images.length > 0 ? (
              <img 
                src={task.images[0]} 
                alt="Task" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <span className="material-symbols-outlined text-6xl">image</span>
                <p>No images provided</p>
              </div>
            )}
          </div>

          {/* Task Content */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {task.category}
                </span>
                <h1 className="text-3xl font-bold text-slate-900 mt-3">{task.title}</h1>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 uppercase font-bold tracking-tighter">Status</p>
                <p className={`font-semibold ${task.status === 'open' ? 'text-green-600' : 'text-blue-600'}`}>
                  {task.status.toUpperCase()}
                </p>
              </div>
            </div>

            <hr className="my-6 border-slate-100" />
            
            {/* username showing */}
            <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-[#2e7d32] text-white flex items-center justify-center font-bold">
                {task.requester?.name?.charAt(0) || 'U'}
            </div>
            <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Requested by</p>
                <p className="text-slate-900 font-semibold">{task.requester?.name || 'Anonymous User'}</p>
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Description Column */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-bold text-slate-800 mb-2">Description</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {task.description}
                </p>
              </div>

              {/* Location/Details Side Column */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600">location_on</span>
                  Location Info
                </h2>
                
                {isInvolved ? (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-900 leading-snug">
                      {task.location?.address}
                    </p>
                    <button 
                    onClick={() => {
                        const encodedAddress = encodeURIComponent(task.location?.address);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');;
                    }}
                    className="w-full py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm flex items-center justify-center gap-2 transition-all"
                    >
                    <span className="material-symbols-outlined text-sm text-blue-500">near_me</span>
                    Open in Maps
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic">
                    Exact location hidden until task is accepted.
                  </div>
                )}
              </div>
            </div>

            {/* Chat Placeholder Button */}
            <div className="mt-10 flex gap-4">
              {isInvolved && (
                <button className="flex-1 bg-[#2e7d32] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#1b5e20] shadow-lg shadow-green-100 transition-all">
                  <span className="material-symbols-outlined">chat</span>
                  Message {task.requester === user._id ? 'Volunteer' : 'Requester'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
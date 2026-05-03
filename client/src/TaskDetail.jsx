import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW: Rating Modal States ---
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetails();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this request?");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete task');
      navigate('/dashboard'); 
    } catch (err) {
      alert(err.message);
    }
  };

  // --- UPDATED: Submits BOTH the completion and the rating ---
  const submitCompletionAndRating = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      // 1. Mark the task as completed
      const taskResponse = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'completed' })
      });
      const taskData = await taskResponse.json();
      if (!taskResponse.ok) throw new Error(taskData.message || 'Failed to complete task');

      // 2. Submit the rating for the volunteer
      if (task.volunteer) {
        const volunteerId = task.volunteer._id || task.volunteer;
        const rateResponse = await fetch(`http://localhost:5000/api/users/${volunteerId}/rate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ rating, taskId: id })
        });
        
        if (!rateResponse.ok) {
          console.error("Failed to submit rating, but task was completed.");
        }
      }

      setTask(taskData); 
      setShowRatingModal(false);
      alert("Task completed and volunteer rated!");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAcceptance = async () => {
    const confirmCancel = window.confirm("Cancel your help for this task?");
    if (!confirmCancel) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${id}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      alert("Assignment cancelled.");
      navigate('/volunteer'); 
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading details...</div>;
  if (error || !task) return <div className="p-10 text-center text-red-500">Error: {error || "Task not found"}</div>;

  const currentUserId = user?._id?.toString() || user?.userId?.toString() || user?.id?.toString();
  const taskVolunteerId = task.volunteer?._id?.toString() || task.volunteer?.toString();
  const taskRequesterId = task.requester?._id?.toString() || task.requester?.toString();

  const isInvolved = currentUserId && (currentUserId === taskVolunteerId || currentUserId === taskRequesterId);
  
  return (
    <div className="min-h-screen bg-slate-50 font-plus-jakarta pb-20 relative">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 cursor-pointer">
          <span className="material-symbols-outlined">arrow_back</span> Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-100 aspect-video w-full flex items-center justify-center border-b border-slate-200">
            {task.images?.length > 0 ? (
              <img src={task.images[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="text-slate-400 flex flex-col items-center">
                <span className="material-symbols-outlined text-6xl">image</span>
                <p>No images</p>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{task.category}</span>
                <h1 className="text-3xl font-bold text-slate-900 mt-3">{task.title}</h1>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 uppercase font-bold tracking-tighter">Status</p>
                <p className={`font-semibold ${task.status === 'completed' ? 'text-gray-500' : task.status === 'open' ? 'text-green-600' : 'text-blue-600'}`}>
                  {task.status?.toUpperCase()}
                </p>
              </div>
            </div>

            <hr className="my-6 border-slate-100" />
            
            <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-[#2e7d32] text-white flex items-center justify-center font-bold">
                  {task.requester?.name?.charAt(0) || 'U'}
              </div>
              <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Requested by</p>
                  <p className="text-slate-900 font-semibold">{task.requester?.name || 'User'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-lg font-bold text-slate-800 mb-2">Description</h2>
                <p className="text-slate-600 whitespace-pre-line">{task.description}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600">location_on</span> Location
                </h2>
                {isInvolved ? (
                  <p className="text-sm font-medium text-slate-900">{task.location?.address}</p>
                ) : (
                  <p className="text-sm text-slate-500 italic">Hidden until accepted.</p>
                )}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {isInvolved && task.status !== 'completed' && (
                <button onClick={() => navigate(`/chat/${id}`)} className="flex-1 min-w-[200px] bg-[#2e7d32] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 cursor-pointer">
                  <span className="material-symbols-outlined">chat</span> Message
                </button>
              )}

              {currentUserId === taskVolunteerId && task.status === 'in-progress' && (
                <button onClick={handleCancelAcceptance} className="flex-1 min-w-[200px] bg-orange-50 text-orange-700 py-4 rounded-2xl font-bold border border-orange-200 cursor-pointer">
                  Cancel My Help
                </button>
              )}

              {/* UPDATED: Now opens the rating modal instead of instantly completing */}
              {currentUserId === taskRequesterId && task.status === 'in-progress' && (
                <button onClick={() => setShowRatingModal(true)} className="flex-1 min-w-[200px] bg-white text-green-700 py-4 rounded-2xl font-bold border-2 border-green-600 cursor-pointer hover:bg-green-50 transition-colors">
                  Mark Complete & Rate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- NEW: Rating Modal --- */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up">
            <h3 className="text-2xl font-bold text-slate-800 text-center mb-2">Rate Your Helper</h3>
            <p className="text-slate-500 text-center text-sm mb-6">How was your experience with the volunteer?</p>
            
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-5xl transition-all duration-200 hover:scale-110 ${rating >= star ? 'text-yellow-400 drop-shadow-md' : 'text-slate-200'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowRatingModal(false)}
                className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                onClick={submitCompletionAndRating}
                className="flex-1 py-3 font-bold text-white bg-[#2e7d32] rounded-xl hover:bg-[#1b5e20] transition-colors shadow-md flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default TaskDetail;
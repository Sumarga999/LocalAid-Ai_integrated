import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Rating State ---
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Image Popup State ---
  const [showPopup, setShowPopup] = useState(false);

  // --- Deny Reasoning Modal State ---
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [rejectionInput, setRejectionInput] = useState("");
  const [isDenying, setIsDenying] = useState(false);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetails();
  }, [id]);

  // --- HANDLER: Delete Open Task ---
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this open task?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete task');
      navigate(-1); 
    } catch (err) {
      alert(err.message);
    }
  };

  // --- HANDLER: Submit Rating ---
  const handleRatingSubmit = async () => {
    if (rating === 0) return alert("Please select a star rating");
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${id}/rate`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ rating, review })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error: Did not return JSON. Check if your backend route exists and is running!");
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setTask(prevTask => ({
        ...prevTask,
        rating: rating,
        review: review
      })); 
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignalDone = async () => {
    if (!window.confirm("Mark this task as finished?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${id}/request-completion`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ completionNote: "" })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setTask(data);
      alert("Task marked as finished! Waiting for requester approval.");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFinalApprove = async () => {
    if (!window.confirm("Confirm work as completed?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'completed' })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setTask(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDenyCompletion = () => {
    setShowDenyModal(true);
  };

  // --- UPDATED: Submits denial and the task resets to "open" ---
  const submitDenyCompletion = async () => {
    if (!rejectionInput.trim()) return alert("Please provide a reason.");
    
    setIsDenying(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rejectionReason: rejectionInput })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setTask(data); // This will now show status as 'open'
      setShowDenyModal(false);
      setRejectionInput("");
      alert("Completion denied. The task is now OPEN again for other volunteers.");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDenying(false);
    }
  };

  const handleCancelHelp = async () => {
    if (!window.confirm("Cancel your help?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${id}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to cancel');
      navigate('/volunteer');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-10 text-center italic">Loading task...</div>;
  if (error || !task) return <div className="p-10 text-center text-red-500 font-bold">Error: {error}</div>;

  const currentUserId = user?._id?.toString() || user?.userId?.toString() || user?.id?.toString();
  const taskVolunteerId = task.volunteer?._id?.toString() || task.volunteer?.toString();
  const taskRequesterId = task.requester?._id?.toString() || task.requester?.toString();
  const isInvolved = currentUserId === taskVolunteerId || currentUserId === taskRequesterId;

  const hasImages = task.images && task.images.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 font-plus-jakarta pb-20 pt-10 relative">
      
      {/* --- CUSTOM POPUP MODAL FOR DENYING COMPLETION --- */}
      {showDenyModal && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">report</span>
                        Deny Completion
                    </h3>
                    <button onClick={() => setShowDenyModal(false)} className="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-500 mb-4">Explain why you are rejecting the completion. The task will be reset to open for others.</p>
                    <textarea 
                        className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none text-sm min-h-[120px] transition-all"
                        placeholder="e.g. The work was not completed as requested..."
                        value={rejectionInput}
                        onChange={(e) => setRejectionInput(e.target.value)}
                    />
                </div>
                <div className="p-6 bg-slate-50 flex gap-3">
                    <button 
                        onClick={() => setShowDenyModal(false)}
                        className="flex-1 py-3 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all border-none cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button 
                        disabled={isDenying}
                        onClick={submitDenyCompletion}
                        className={`flex-1 py-3 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all border-none cursor-pointer shadow-lg shadow-red-100 ${isDenying ? 'opacity-50' : ''}`}
                    >
                        {isDenying ? 'Submitting...' : 'Deny & Reset to Open'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- IMAGE POPUP MODAL --- */}
      {showPopup && (
        <div 
          className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowPopup(false)}
        >
          <span className="material-symbols-outlined absolute top-10 right-10 text-white text-4xl">close</span>
          {hasImages ? (
            <img src={task.images[0]} alt="Full view" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"/>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 bg-white p-16 rounded-3xl shadow-xl">
              <span className="material-symbols-outlined text-[100px] mb-4 opacity-50">image</span>
              <span className="font-bold text-xl opacity-70">No images published</span>
            </div>
          )}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 cursor-pointer border-none bg-transparent font-bold transition-colors">
          <span className="material-symbols-outlined">arrow_back</span> Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="w-full h-64 md:h-[400px] bg-[#f4f6f9] flex items-center justify-center border-b border-slate-100 cursor-pointer" onClick={() => setShowPopup(true)}>
            {hasImages ? (
              <img src={task.images[0]} alt="Task cover" className="w-full h-full object-cover hover:opacity-95 transition-opacity" />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#94a3b8]">
                <span className="material-symbols-outlined text-[64px] mb-2 opacity-60">image</span>
                <span className="font-bold text-sm opacity-80">No images (Click to view)</span>
              </div>
            )}
          </div>

          <div className="p-8 md:p-10">
            <div className="flex justify-between items-center mb-6">
              <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">{task.category}</span>
              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Status</span>
                <span className={`font-bold text-sm uppercase ${
                  task.status === 'completed' ? 'text-gray-500' :
                  task.status === 'pending-completion' ? 'text-orange-600' :
                  task.status === 'open' ? 'text-[#2e7d32]' : 'text-blue-600'
                }`}>
                  {task.status?.replace('-', ' ')}
                </span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">{task.title}</h1>

            <div className="flex items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-10 w-full max-w-md">
              <div className="w-12 h-12 bg-[#2e7d32] text-white rounded-full flex items-center justify-center font-bold text-xl">
                {task.requester?.name ? task.requester.name[0].toUpperCase() : 'U'}
              </div>
              <div className="ml-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Requested By</p>
                <p className="font-bold text-slate-900 text-base">{task.requester?.name || 'Unknown User'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-2">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Description</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{task.description}</p>
              </div>
              <div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#2e7d32]">location_on</span>
                    <span className="font-bold text-slate-800">Location</span>
                  </div>
                  <p className="text-sm text-slate-600 ml-8">
                    {isInvolved ? task.location?.address : "Accept task to view exact address"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4 pt-8 border-t border-slate-100">
              {currentUserId === taskRequesterId && task.status === 'open' && (
                <>
                  <button onClick={() => navigate(`/edit-task/${id}`)} className="flex-1 min-w-[180px] bg-blue-50 text-blue-700 py-4 rounded-2xl font-bold border border-blue-100 hover:bg-blue-100 flex items-center justify-center gap-2 cursor-pointer border-none">
                    <span className="material-symbols-outlined">edit</span> Edit Task
                  </button>
                  <button onClick={handleDelete} className="flex-1 min-w-[180px] bg-red-50 text-red-600 py-4 rounded-2xl font-bold border border-red-100 hover:bg-red-100 flex items-center justify-center gap-2 cursor-pointer border-none">
                    <span className="material-symbols-outlined">delete</span> Delete Task
                  </button>
                </>
              )}

              {isInvolved && task.status !== 'completed' && (
                <button onClick={() => navigate(`/chat/${id}`)} className="flex-1 min-w-[180px] bg-[#2e7d32] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1b5e20] cursor-pointer border-none shadow-sm">
                  <span className="material-symbols-outlined">chat</span> Message
                </button>
              )}

              {currentUserId === taskVolunteerId && task.status === 'in-progress' && (
                <>
                  <button onClick={handleSignalDone} className="flex-1 min-w-[180px] bg-white text-[#2e7d32] py-4 rounded-2xl font-bold border-2 border-[#2e7d32] hover:bg-green-50 cursor-pointer">
                    Mark as Finished
                  </button>
                  <button onClick={handleCancelHelp} className="flex-1 min-w-[180px] bg-red-50 text-red-600 py-4 rounded-2xl font-bold border border-red-100 hover:bg-red-100 cursor-pointer border-none">
                    Cancel Help
                  </button>
                </>
              )}

              {task.status === 'pending-completion' && currentUserId === taskVolunteerId && (
                <div className="w-full bg-orange-50 text-orange-800 p-4 rounded-xl text-center font-medium border border-orange-100">
                  Waiting for requester to verify...
                </div>
              )}

              {task.status === 'pending-completion' && currentUserId === taskRequesterId && (
                <div className="w-full flex flex-col md:flex-row gap-4">
                  <button onClick={handleFinalApprove} className="flex-1 bg-orange-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 cursor-pointer border-none">
                    <span className="material-symbols-outlined">verified</span> Confirm Work
                  </button>
                  <button onClick={handleDenyCompletion} className="flex-1 bg-white text-red-600 py-4 rounded-2xl font-bold border border-red-200 hover:bg-red-50 flex items-center justify-center gap-2 cursor-pointer">
                    <span className="material-symbols-outlined">block</span> Deny
                  </button>
                </div>
              )}
            </div>

            {/* RATING SECTION */}
            {task.status === 'completed' && currentUserId === taskRequesterId && (
              <div className="mt-10 pt-10 border-t border-slate-100">
                {!task.rating ? (
                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Rate the Volunteer</h3>
                    <div className="flex justify-center gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" className="bg-transparent border-none cursor-pointer transition-transform hover:scale-110" onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(rating)}>
                          <span className="material-symbols-outlined text-[42px]" style={{ color: star <= (hover || rating) ? '#FFB800' : '#CBD5E1', fontVariationSettings: star <= (hover || rating) ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                        </button>
                      ))}
                    </div>
                    <textarea className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#2e7d32] outline-none text-sm mb-4" placeholder="Review..." rows="3" value={review} onChange={(e) => setReview(e.target.value)} />
                    <button onClick={handleRatingSubmit} disabled={isSubmitting} className={`w-full py-4 bg-[#1b4332] text-white rounded-2xl font-bold ${isSubmitting ? 'opacity-50' : 'hover:bg-[#081c15]'}`}>
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </div>
                ) : (
                  <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center max-w-2xl mx-auto">
                    <div className="flex justify-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`material-symbols-outlined text-2xl ${i < task.rating ? 'text-yellow-500' : 'text-slate-200'}`} style={{ fontVariationSettings: i < task.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                      ))}
                    </div>
                    {task.review && <p className="text-slate-600 italic text-sm">"{task.review}"</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
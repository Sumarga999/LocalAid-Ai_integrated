import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

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

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to submit");
      
      // Update local state with the task returned from server
      setTask(data); 
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignalDone = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${id}/request-completion`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTask(data);
    } catch (err) { alert(err.message); }
  };

  const handleFinalApprove = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'completed' })
      });
      const data = await response.json();
      setTask(data);
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="p-10 text-center italic">Loading...</div>;
  if (error || !task) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  const currentUserId = (user?._id || user?.userId || user?.id)?.toString();
  const taskVolunteerId = (task.volunteer?._id || task.volunteer)?.toString();
  const taskRequesterId = (task.requester?._id || task.requester)?.toString();
  const isInvolved = currentUserId === taskVolunteerId || currentUserId === taskRequesterId;

  return (
    <div className="min-h-screen bg-slate-50 font-plus-jakarta pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 mb-6 bg-transparent border-none font-bold cursor-pointer">
          <span className="material-symbols-outlined">arrow_back</span> Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-start">
            <div>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase">{task.category}</span>
              <h1 className="text-3xl font-bold text-slate-900 mt-3">{task.title}</h1>
            </div>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 uppercase">
              {task.status?.replace('-', ' ')}
            </span>
          </div>

          <div className="p-8">
            <p className="text-slate-700 leading-relaxed mb-8">{task.description}</p>

            <div className="flex flex-wrap gap-4 pt-8 border-t border-slate-100">
              {isInvolved && task.status !== 'completed' && (
                <button onClick={() => navigate(`/chat/${id}`)} className="flex-1 bg-[#2e7d32] text-white py-4 rounded-2xl font-bold border-none cursor-pointer">Message</button>
              )}
              {currentUserId === taskVolunteerId && task.status === 'in-progress' && (
                <button onClick={handleSignalDone} className="flex-1 bg-white text-[#2e7d32] py-4 rounded-2xl font-bold border-2 border-[#2e7d32] cursor-pointer">Mark Finished</button>
              )}
              {task.status === 'pending-completion' && currentUserId === taskRequesterId && (
                <button onClick={handleFinalApprove} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold border-none cursor-pointer">Confirm & Complete</button>
              )}
            </div>

            {/* RATING SECTION */}
            {task.status === 'completed' && currentUserId === taskRequesterId && (
              <div className="mt-10">
                {!task.rating ? (
                  <div className="p-8 bg-green-50 rounded-3xl border border-green-100 text-center">
                    <h3 className="text-xl font-bold mb-4">Rate the Volunteer</h3>
                    <div className="flex justify-center gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="material-symbols-outlined text-[40px] cursor-pointer transition-colors"
                          style={{ color: star <= (hover || rating) ? '#FFB800' : '#CBD5E1', fontVariationSettings: star <= (hover || rating) ? "'FILL' 1" : "'FILL' 0" }}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(rating)}>star</span>
                      ))}
                    </div>
                    <textarea className="w-full p-4 rounded-xl border border-slate-200 mb-4 outline-none" placeholder="Review..." value={review} onChange={(e) => setReview(e.target.value)} />
                    <button onClick={handleRatingSubmit} disabled={isSubmitting} className="w-full py-4 bg-[#2e7d32] text-white rounded-2xl font-bold border-none cursor-pointer">
                      {isSubmitting ? "Sending..." : "Submit Feedback"}
                    </button>
                  </div>
                ) : (
                  <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined">verified</span>
                    </div>
                    <h3 className="font-bold text-slate-900">Feedback Submitted</h3>
                    <div className="flex justify-center gap-1 my-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`material-symbols-outlined ${i < task.rating ? 'text-yellow-500' : 'text-slate-200'}`} style={{ fontVariationSettings: i < task.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                      ))}
                    </div>
                    {task.review && <p className="text-slate-500 italic">"{task.review}"</p>}
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
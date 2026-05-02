import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  // This state tracks which box the user has clicked (UI only)
  const [loginType, setLoginType] = useState('volunteer'); 

  // Backend logic states
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Handle input typing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsError(false);
        setMessage('Welcome back! Redirecting...');
        
        // Save the token and user info to localStorage so they stay logged in
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setTimeout(() => {
          navigate('/'); // Redirect to the dashboard/home
        }, 1500);
      } else {
        setIsError(true);
        setMessage(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setIsError(true);
      setMessage('Could not connect to the server.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        
        {/* Top Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-[#2e7d32]" data-weight="fill">favorite</span>
          </div>
        </div>

        {/* Headers */}
        <div className="text-center mt-6 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500">Sign in to continue helping your community</p>
        </div>

        {/* Display Success/Error Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-bold text-center ${isError ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-[#2e7d32] border border-green-100'}`}>
            {message}
          </div>
        )}

        {/* Login Type Selection Boxes */}
        <div className="mb-6">
          <p className="text-center text-sm text-slate-600 mb-3">Login as:</p>
          <div className="grid grid-cols-2 gap-4">
            
            {/* Volunteer Option */}
            <button 
              type="button"
              onClick={() => setLoginType('volunteer')}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                loginType === 'volunteer' 
                  ? 'border-[#2e7d32] bg-[#f1f8f1] shadow-sm' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className={`material-symbols-outlined mb-2 text-3xl ${loginType === 'volunteer' ? 'text-[#2e7d32]' : 'text-slate-400'}`}>
                volunteer_activism
              </span>
              <span className={`font-semibold ${loginType === 'volunteer' ? 'text-slate-900' : 'text-slate-600'}`}>Volunteer</span>
              <span className="text-xs text-slate-500 mt-1">Help others</span>
            </button>

            {/* Get Help Option */}
            <button 
              type="button"
              onClick={() => setLoginType('getHelp')}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                loginType === 'getHelp' 
                  ? 'border-[#2e7d32] bg-[#f1f8f1] shadow-sm' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className={`material-symbols-outlined mb-2 text-3xl ${loginType === 'getHelp' ? 'text-[#2e7d32]' : 'text-slate-400'}`}>
                account_circle
              </span>
              <span className={`font-semibold ${loginType === 'getHelp' ? 'text-slate-900' : 'text-slate-600'}`}>Get Help</span>
              <span className="text-xs text-slate-500 mt-1">Request support</span>
            </button>
          </div>
        </div>

        {/* Login Form - Added onSubmit */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">mail</span>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] transition-all placeholder:text-slate-400"
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-slate-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">lock</span>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] transition-all placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button - Changed type to "submit" */}
          <button 
            type="submit"
            className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white py-3.5 rounded-lg font-medium transition-colors mt-2"
          >
            Sign In
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#2e7d32] hover:underline font-medium">
            Sign up
          </Link>
        </div>
        
      </div>
    </div>
  );
}

export default Login;
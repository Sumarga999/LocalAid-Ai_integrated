import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  // This state tracks which box the user has clicked
  const [loginType, setLoginType] = useState('volunteer'); 

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

        {/* Login Form */}
        <form className="space-y-5">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">mail</span>
              <input 
                type="email" 
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
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] transition-all placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="button"
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
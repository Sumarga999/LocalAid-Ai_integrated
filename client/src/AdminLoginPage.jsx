import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@localaid.org');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Logging in as admin with:', email, password);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6 relative overflow-y-auto">
      {/* Main Card Container */}
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-neutral-100">
        
        {/* Top Green Circular Badge with Shield Icon */}
        <div className="mx-auto w-24 h-24 bg-green-900 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 18c-3.1 0-5.61-2.51-5.61-5.61s2.51-5.61 5.61-5.61 5.61 2.51 5.61 5.61S15.1 20 12 20zm-1.5-10.5v4l3.5 2" />
          </svg>
        </div>

        {/* Title and Subtitle */}
        <h1 className="text-4xl font-extrabold text-black text-center mb-2">Admin Portal</h1>
        <p className="text-base text-neutral-500 text-center mb-8">Secure access for administrators only</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base text-neutral-600 mb-1" htmlFor="admin-email">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 border border-neutral-200 rounded-xl bg-white text-base text-black placeholder:text-neutral-400 focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none"
              placeholder="admin@localaid.org"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-base text-neutral-600 mb-1" htmlFor="admin-password">
              Admin Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 border border-neutral-200 rounded-xl bg-white text-base text-black placeholder:text-neutral-400 focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none"
              placeholder="Enter admin password"
              required
            />
            {/* Lock Icon inside input */}
            <span className="absolute right-6 top-[3.25rem] -translate-y-1/2 text-neutral-400 text-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M18 10H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2Zm0 10H6v-8h12v8Z" />
                <path d="M7 10V6a5 5 0 0 1 10 0v4H7Zm2 0h6V6a3 3 0 0 0-6 0v4Z" />
              </svg>
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-green-900 text-white font-bold py-4.5 rounded-2xl text-lg hover:bg-green-800 transition"
          >
            Login as Admin
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="mt-10 bg-neutral-50 p-6 rounded-2xl text-center text-sm text-neutral-600 space-y-1.5 border border-neutral-100">
          <p className="font-semibold">Demo credentials:</p>
          <p>Email: admin@localaid.org</p>
          <p>Password: admin123</p>
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-green-700 hover:text-green-800 font-medium text-base gap-2"
          >
            <u>Back to Home</u>
          </Link>
        </div>
      </div>

      {/* Outer Question Mark Icon */}
      <div className="absolute bottom-8 right-8">
        <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center text-white text-xl">
          ?
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
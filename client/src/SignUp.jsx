import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();

  // 1. Combine role tracking and form inputs into one state object
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // Added this to match your new UI
    role: 'volunteer'
  });

  // State for success/error messages
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // 2. Handle input typing
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Handle the actual form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    navigate('/dashboard');
    // Check if passwords match before sending to backend!
    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We don't need to send the confirmPassword to the database
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsError(false);
        setMessage('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/Login'); 
        }, 2000);
      } else {
        setIsError(true);
        setMessage(data.message || 'Signup failed.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setIsError(true);
      setMessage('Could not connect to the server.');
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center py-l px-6 bg-pattern relative min-h-[80vh]">
      {/* Abstract Background Shape for Visual Interest */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary-fixed/10 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-secondary-fixed/10 blur-[120px] rounded-full -z-10"></div>
      
      {/* Main Signup Card */}
      <div className="w-full max-w-[560px] bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-outline-variant/30 my-12 z-10">
        <div className="text-center mb-lg">
          <h1 className="font-headline-xl text-primary text-headline-xl mb-base">Join LocalAid</h1>
          <p className="font-body-lg text-on-surface-variant text-body-lg">Start making a difference today</p>
        </div>

        {/* Display Success/Error Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-bold text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
        
        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-md mb-lg">
          
          {/* Volunteer Button */}
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, role: 'volunteer' })}
            className={`flex flex-col items-center justify-center p-md rounded-xl border-2 transition-all group ${
              formData.role === 'volunteer' 
                ? 'border-primary bg-primary/5' 
                : 'border-outline-variant hover:border-primary/50 bg-transparent'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-sm transition-colors ${
              formData.role === 'volunteer'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-highest text-on-surface-variant group-hover:bg-primary-fixed'
            }`}>
              <span className="material-symbols-outlined">volunteer_activism</span>
            </div>
            <span className={`font-label-md ${
              formData.role === 'volunteer' ? 'text-primary' : 'text-on-surface-variant'
            }`}>Volunteer</span>
          </button>

          {/* Get Help Button */}
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, role: 'getHelp' })}
            className={`flex flex-col items-center justify-center p-md rounded-xl border-2 transition-all group ${
              formData.role === 'getHelp' 
                ? 'border-primary bg-primary/5' 
                : 'border-outline-variant hover:border-primary/50 bg-transparent'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-sm transition-colors ${
              formData.role === 'getHelp'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-highest text-on-surface-variant group-hover:bg-primary-fixed'
            }`}>
              <span className="material-symbols-outlined">person_pin_circle</span>
            </div>
            <span className={`font-label-md ${
              formData.role === 'getHelp' ? 'text-primary' : 'text-on-surface-variant'
            }`}>Get Help</span>
          </button>

        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-lg">
          <div className="space-y-xs">
            <label className="font-label-md text-on-surface-variant">Full Name</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
                placeholder="John Doe" 
                type="text" 
              />
            </div>
          </div>
          
          <div className="space-y-xs">
            <label className="font-label-md text-on-surface-variant">Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
              <input 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
                placeholder="john@example.com" 
                type="email" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="space-y-xs">
              <label className="font-label-md text-on-surface-variant">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
                  placeholder="••••••••" 
                  type="password" 
                />
              </div>
            </div>
            <div className="space-y-xs">
              <label className="font-label-md text-on-surface-variant">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
                  placeholder="••••••••" 
                  type="password" 
                />
              </div>
            </div>
          </div>
          
          <button className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-md text-body-md hover:bg-primary-container transition-all shadow-md active:scale-[0.98] mt-md" type="submit">
            Create Account
          </button>
        </form>
        
        <div className="mt-lg text-center">
          {/* Changed this to a React Router Link! */}
          <Link to="/login" className="font-label-md text-primary hover:underline decoration-2 underline-offset-4">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

export default SignUp;
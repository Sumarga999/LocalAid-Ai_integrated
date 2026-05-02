import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from './Home';
import SignUp from './SignUp';
import Login from './Login';
import AdminLoginPage from './AdminLoginPage';
import AboutUs from './AboutUs';
import OurImpact from './OurImpact';
import ScrollToTop from './ScrollToTop';

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      {/* This wrapper keeps the background styles consistent and pushes the footer to the bottom */}
      <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
        
        <Navbar />
        
        {/* The Routes section represents the changing middle part of the site */}
        <div className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/ourimpact" element={<OurImpact />} />
          </Routes>
        </div>
        
        <Footer />
        
      </div>
    </BrowserRouter>
  );
}

export default App;
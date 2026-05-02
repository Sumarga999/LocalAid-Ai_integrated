import React from 'react';
import { Link } from 'react-router-dom';

function OurImpact() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. Hero Section */}
      <section className="bg-green-800 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          <span className="bg-green-700/50 text-green-100 text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
            Our Mission in Action
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 max-w-4xl leading-tight">
            Building Stronger Communities Across Australia
          </h1>
          <p className="text-lg md:text-xl text-green-50 mb-10 max-w-2xl opacity-95">
            LocalAid is bridging the gap between neighbors in need and those ready to help. From the busy coastlines to the rural periphery, we are proving that no one has to do it alone.
          </p>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="py-16 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'Tasks Completed', value: '12,500+', icon: 'task_alt' },
            { label: 'Active Volunteers', value: '4,200+', icon: 'group' },
            { label: 'Hours Donated', value: '35,000+', icon: 'schedule' },
            { label: 'Aussie Suburbs Reached', value: '150+', icon: 'location_on' },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-green-700 text-3xl">{stat.icon}</span>
              </div>
              <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Core Services / Areas of Impact */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How We Help Everyday</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Our platform facilitates essential day-to-day services, ensuring vulnerable community members get exactly what they need, exactly when they need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-green-600 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">medication</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Medication Delivery</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Ensuring those who are homebound, sick, or elderly never miss a prescription. Volunteers pick up and drop off essential medicines safely and securely.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-green-600 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">child_care</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Child Day Care</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Emergency and short-term child minding. Helping busy parents and single-parent households manage unexpected schedule changes with trusted neighbors.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-green-600 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">pets</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Animal Day Care</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dog walking, pet sitting, and feeding. Keeping furry family members happy and healthy when their owners are unable to due to illness or work.
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-green-600 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-green-50 text-green-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Grocery Delivery</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Doing the heavy lifting. Volunteers handle grocery runs for those without transport or physical capability to shop for themselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Chat / Connection Feature */}
      <section className="py-20 px-6 bg-green-900 text-white overflow-hidden relative">
        {/* Background decorative pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">More Than Just Tasks. <br/>It's About Connection.</h2>
            <p className="text-green-100 text-lg mb-6 leading-relaxed">
              We believe help is personal. That's why LocalAid features built-in real-time chat between requesters and volunteers. 
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-400 mt-1">check_circle</span>
                <span><strong className="text-white">Coordinate Details:</strong> Discuss grocery lists, pet diets, or exact drop-off locations instantly.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-400 mt-1">check_circle</span>
                <span><strong className="text-white">Build Trust:</strong> Get to know the neighbor helping you before they arrive at your door.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-400 mt-1">check_circle</span>
                <span><strong className="text-white">Reduce Loneliness:</strong> Sometimes, a friendly chat is just as impactful as the service itself.</span>
              </li>
            </ul>
          </div>
          
          {/* Mock Chat Interface Visual */}
          <div className="md:w-1/2 w-full flex justify-center">
            <div className="bg-white rounded-3xl p-4 w-full max-w-sm shadow-2xl text-slate-800 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">M</div>
                <div>
                  <div className="font-bold text-sm">Mateo (Volunteer)</div>
                  <div className="text-xs text-slate-500">Active now</div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none text-sm w-4/5">
                  Hi Sarah! I saw your request for medication pickup. I'm heading to the pharmacy in 10 mins.
                </div>
                <div className="bg-green-600 text-white p-3 rounded-2xl rounded-tr-none text-sm w-4/5 ml-auto">
                  Oh Mateo, thank you so much! My prescription is ready under 'Sarah Jenkins'.
                </div>
                <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none text-sm w-4/5">
                  Perfect. I'll grab it and swing by. Do you still need any milk or bread while I'm out?
                </div>
                <div className="bg-green-600 text-white p-3 rounded-2xl rounded-tr-none text-sm w-4/5 ml-auto">
                  Some milk would be a lifesaver. Thank you, truly. ❤️
                </div>
              </div>
              <div className="relative">
                <input type="text" disabled placeholder="Type a message..." className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-4 pr-10 text-sm" />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-xl">send</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-24 px-6 bg-green-50 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-green-200 text-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl" data-weight="fill">volunteer_activism</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Ready to make your mark?</h2>
          <p className="text-lg text-slate-600 mb-10">
            Whether you have an hour to spare to walk a dog, or you need someone to pick up your weekly groceries, there is a place for you in the LocalAid community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-green-700/20">
              Become a Volunteer
            </Link>
            <Link to="/login" className="bg-white hover:bg-slate-50 text-green-700 border-2 border-green-700 px-8 py-4 rounded-xl font-bold text-lg transition-colors">
              Request Help
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}

export default OurImpact;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function Home() {
  // 1. Setup our state variables for the Map
  const [mapCenter, setMapCenter] = useState({ lat: -25.274398, lng: 133.775136, zoom: 4 });
  const [locationStatus, setLocationStatus] = useState('');
  const [isLocationFound, setIsLocationFound] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 2. Setup state variables for our Dynamic Stats!
  // These are placeholder numbers. Once your database is connected, 
  // you will fetch the real numbers and update this state.
  const [stats, setStats] = useState({
    activeVolunteers: 0,
    tasksCompleted: 0,
    activeTasks: 0 // Replaced "Volunteer Hours" with this!
  });

  // Example of how you will make this truly dynamic with your backend later:
  useEffect(() => {
    /* // WHEN YOUR MONGODB/BACKEND IS READY, UNCOMMENT THIS:
      fetch('http://localhost:5000/api/stats')
        .then(response => response.json())
        .then(data => {
          setStats({
            activeVolunteers: data.totalUsers,
            tasksCompleted: data.completedTasksCount,
            activeTasks: data.openTasksCount
          });
        })
        .catch(error => console.error("Error fetching stats:", error));
    */
  }, []);

  // Smooth scroll effect triggered when the URL has a hash
  useEffect(() => {
    if (location.hash === '#urgent-requests') {
      const element = document.getElementById('urgent-requests');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  // 3. Create the function to get the user's location
  const handleGetLocation = () => {
    setLocationStatus('Locating...');
    
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus('');
        setIsLocationFound(true);
        setMapCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 14
        });
      },
      (error) => {
        setLocationStatus('Location access denied. Showing default map.');
      }
    );
  };

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  // Generate the map URL dynamically based on our state
  const mapUrl = `https://maps.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=${mapCenter.zoom}&output=embed`;

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <main>
        {/* Hero Section */}
        <section className="hero-gradient text-white py-xxl px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <h1 className="font-headline-xl text-headline-xl mb-md max-w-3xl">Stronger Together</h1>
            <p className="font-body-lg text-body-lg text-on-primary-container mb-xl max-w-2xl opacity-90">
              Empowering neighborhoods through direct action. LocalAid connects those who can give with those who need help, building a more resilient community one task at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-md">
              <button onClick={handleSignUpRedirect}
              className="bg-secondary-container hover:bg-secondary text-on-secondary-container px-8 py-4 rounded-lg font-headline-md text-headline-md shadow-lg transition-transform active:scale-95">Get Started</button>
              <button onClick={() => {
                const element = document.getElementById('urgent-requests');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }} className="border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded-lg font-headline-md text-headline-md transition-colors">View Tasks</button>
            </div>
          </div>
        </section>

        {/* DYNAMIC Stats Section */}
        <section className="py-xl px-6 bg-white border-b border-surface-variant">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-lg">
            
            {/* Active Volunteers Stat */}
            <div className="flex flex-col items-center text-center p-lg rounded-xl bg-surface-container-low">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-primary" data-icon="group">group</span>
              </div>
              <div className="font-headline-lg text-primary">{stats.activeVolunteers}</div>
              <div className="font-label-md text-outline">Active Volunteers</div>
            </div>
            
            {/* Tasks Completed Stat */}
            <div className="flex flex-col items-center text-center p-lg rounded-xl bg-surface-container-low">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-secondary" data-icon="task_alt">task_alt</span>
              </div>
              <div className="font-headline-lg text-primary">{stats.tasksCompleted}</div>
              <div className="font-label-md text-outline">Tasks Completed</div>
            </div>
            
            {/* Active Tasks Stat (Replaced Volunteer Hours) */}
            <div className="flex flex-col items-center text-center p-lg rounded-xl bg-surface-container-low">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center mb-md">
                {/* Changed the icon from 'schedule' to 'assignment' to match the new stat */}
                <span className="material-symbols-outlined text-tertiary" data-icon="assignment">assignment</span>
              </div>
              <div className="font-headline-lg text-primary">{stats.activeTasks}</div>
              <div className="font-label-md text-outline">Active Tasks</div>
            </div>

          </div>
        </section>

        {/* Urgent Requests Section */}
        <section id="urgent-requests" className="py-xxl px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-xl">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Urgent Requests</h2>
                <p className="text-outline">Immediate needs in your local area that require support.</p>
              </div>
              <Link to="/tasks" className="text-primary font-label-md flex items-center gap-2 hover:underline decoration-2 underline-offset-4">
                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              
              {/* Task Card 1 */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-surface-variant overflow-hidden flex flex-col h-full">
                <div className="p-lg flex-grow">
                  <div className="flex justify-between items-start mb-md">
                    <span className="bg-error-container text-on-error-container text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">High Priority</span>
                    <span className="text-outline flex items-center gap-1 font-label-sm">
                      <span className="material-symbols-outlined text-sm">schedule</span> 2h ago
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-sm">Grocery Shopping</h3>
                  <p className="text-on-surface-variant body-md mb-lg">Elderly neighbor requires help picking up weekly groceries from the local market. Heavy lifting involved.</p>
                  <div className="space-y-sm">
                    <div className="flex items-center gap-2 text-outline font-label-md">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      Downtown, North Sector
                    </div>
                  </div>
                </div>
                <div className="p-lg pt-0">
                  <Link to="/signup" className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-lg font-label-md transition-colors flex items-center justify-center gap-2">
                    Help Now <span className="material-symbols-outlined text-sm">volunteer_activism</span>
                  </Link>
                </div>
              </div>

              {/* Task Card 2 */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-surface-variant overflow-hidden flex flex-col h-full">
                <div className="p-lg flex-grow">
                  <div className="flex justify-between items-start mb-md">
                    <span className="bg-error-container text-on-error-container text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">High Priority</span>
                    <span className="text-outline flex items-center gap-1 font-label-sm">
                      <span className="material-symbols-outlined text-sm">schedule</span> 4h ago
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-sm">After-School Childcare</h3>
                  <p className="text-on-surface-variant body-md mb-lg">A single parent needs emergency assistance watching two school-aged children for two hours this evening.</p>
                  <div className="space-y-sm">
                    <div className="flex items-center gap-2 text-outline font-label-md">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      Maplewood Estates
                    </div>
                  </div>
                </div>
                <div className="p-lg pt-0">
                  <Link to="/signup" className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-lg font-label-md transition-colors flex items-center justify-center gap-2">
                    Help Now <span className="material-symbols-outlined text-sm">volunteer_activism</span>
                  </Link>
                </div>
              </div>

              {/* Task Card 3 */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-surface-variant overflow-hidden flex flex-col h-full">
                <div className="p-lg flex-grow">
                  <div className="flex justify-between items-start mb-md">
                    <span className="bg-error-container text-on-error-container text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">High Priority</span>
                    <span className="text-outline flex items-center gap-1 font-label-sm">
                      <span className="material-symbols-outlined text-sm">schedule</span> 1h ago
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-sm">Pharmacy Pickup</h3>
                  <p className="text-on-surface-variant body-md mb-lg">Urgent pickup of essential medication for a resident currently unable to leave their home due to mobility issues.</p>
                  <div className="space-y-sm">
                    <div className="flex items-center gap-2 text-outline font-label-md">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      Riverside Clinic Area
                    </div>
                  </div>
                </div>
                <div className="p-lg pt-0">
                  <Link to="/signup" className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-lg font-label-md transition-colors flex items-center justify-center gap-2">
                    Help Now <span className="material-symbols-outlined text-sm">volunteer_activism</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* INTERACTIVE MAP SECTION */}
        <section className="py-xxl px-6 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-on-background mb-xl text-center">Find Help Near You</h2>
            
            <div className="relative bg-white rounded-2xl shadow-sm border border-surface-variant overflow-hidden min-h-[400px] flex items-center justify-center">
              
              {/* Google Maps Iframe */}
              <iframe 
                className="absolute inset-0 w-full h-full object-cover opacity-60" 
                src={mapUrl}
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0"
                title="Interactive Map"
              ></iframe>
              
              {/* Overlay Content */}
              {!isLocationFound && (
              <div className="relative z-10 flex flex-col items-center gap-md bg-white/90 p-8 rounded-xl shadow-lg backdrop-blur-sm border border-slate-100 max-w-md text-center">
                <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-4xl" data-weight="fill">location_on</span>
                </div>
                <p className="font-headline-md text-headline-md text-primary">Find Local Tasks</p>
                <p className="text-outline text-sm">
                  {locationStatus || "Allow location access to see tasks and volunteers in your immediate neighborhood."}
                </p>
                
                <button 
                  onClick={handleGetLocation}
                  className="mt-4 bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-lg font-label-md transition-colors shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">my_location</span>
                  Use My Location
                </button>
              </div>
              )}
            </div>

          </div>
        </section>

        {/* CTA Section */}
        <section className="py-xxl px-6 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-headline-lg text-headline-xl mb-md">Ready to Make a Difference?</h2>
            <p className="font-body-lg text-body-lg mb-xl opacity-90">Join thousands of your neighbors who are already making our community a better place to live. Sign up takes less than two minutes.</p>
            <button onClick={handleSignUpRedirect}
            className="bg-secondary-container hover:bg-secondary text-on-secondary-container px-12 py-5 rounded-xl font-headline-md text-headline-md shadow-xl transition-all hover:-translate-y-1 active:scale-95">Sign Up Now</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
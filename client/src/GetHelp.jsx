import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GetHelp() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    urgency: 'Medium',
    dueDate: '',
    address: '',
    latitude: null,
    longitude: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- NEW: State for location suggestions ---
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // --- NEW: Handle typing in the address bar to get suggestions ---
  const handleAddressChange = (e) => {
    const query = e.target.value;
    setFormData({ ...formData, address: query });

    // Clear the previous timeout so we don't spam the API while typing
    if (searchTimeout) clearTimeout(searchTimeout);

    if (query.length > 2) {
      const timeout = setTimeout(async () => {
        try {
          // Fetch suggestions from OpenStreetMap (Works globally, including Kathmandu & Australia)
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Error fetching location suggestions:", err);
        }
      }, 500); // Wait 500ms after user stops typing
      setSearchTimeout(timeout);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // --- NEW: Handle clicking a suggestion ---
  const handleSelectSuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      address: suggestion.display_name,
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon)
    }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            
            let finalAddress = formData.address;
            
            if (data && data.address) {
              const { house_number, road, neighbourhood, suburb, city, town, village, state } = data.address;
              const addressParts = [
                house_number ? `${house_number} ${road || ''}`.trim() : road,
                neighbourhood || suburb,
                city || town || village,
                state
              ].filter(Boolean); 
              
              finalAddress = addressParts.join(', ');
            }

            setFormData(prev => ({
              ...prev,
              latitude: lat,
              longitude: lon,
              address: finalAddress
            }));
          } catch (err) {
            console.error("Error converting coordinates to address:", err);
            setFormData(prev => ({ ...prev, latitude: lat, longitude: lon }));
          }
        },
        (err) => {
          console.error("Error getting location:", err);
          alert("Could not get your location. Please ensure location services are enabled.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.latitude || !formData.longitude) {
      setError("Please select a location from the suggestions or click 'Get My Location'.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("You must be logged in to request help.");

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('urgency', formData.urgency);
      submitData.append('address', formData.address);
      submitData.append('latitude', formData.latitude);
      submitData.append('longitude', formData.longitude);
      
      if (formData.dueDate) submitData.append('dueDate', formData.dueDate);
      if (imageFile) submitData.append('image', imageFile);

      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData 
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create request');
      }

      navigate('/dashboard'); 
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-plus-jakarta py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-[#2e7d32] px-8 py-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Request Help</h1>
          <p className="text-green-100">Fill out the details below so local volunteers can assist you.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 text-sm font-medium">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Task Title *</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g., Need help picking up groceries" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2e7d32] outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2e7d32] outline-none bg-white">
                <option value="Grocery Delivery">Grocery Delivery</option>
                <option value="Medication Delivery">Medication Delivery</option>
                <option value="Child Day Care">Child Day Care</option>
                <option value="Animal Day Care">Animal Day Care</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
            <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} placeholder="Provide more details about what you need..." className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2e7d32] outline-none transition-all resize-y"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload an Image (Optional)</label>
            <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2e7d32] outline-none bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-[#2e7d32] hover:file:bg-green-100 cursor-pointer" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Urgency Level</label>
              <select name="urgency" value={formData.urgency} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2e7d32] outline-none bg-white">
                <option value="Low">Low - Whenever possible</option>
                <option value="Medium">Medium - Sometime soon</option>
                <option value="High">High - Within 24 hours</option>
                <option value="Critical">Critical - Urgent/Immediate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date (Optional)</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2e7d32] outline-none" />
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2e7d32]">location_on</span>
              Location Details
            </h3>
            
            <div className="space-y-4">
              
              {/* UPDATED ADDRESS INPUT WITH DROPDOWN */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">Search Store or Street Address *</label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleAddressChange} 
                  placeholder="Type a location (e.g. Kathmandu, Sydney, 123 Main St)..." 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2e7d32] outline-none" 
                  autoComplete="off"
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <li 
                        key={suggestion.place_id}
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-slate-100 last:border-b-0 text-sm text-slate-700 flex items-start gap-2"
                      >
                        <span className="material-symbols-outlined text-slate-400 text-[18px] mt-0.5">place</span>
                        {suggestion.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500 font-medium">OR</span>
                <button type="button" onClick={handleGetLocation} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">my_location</span>
                  Get My Current Location
                </button>
                {formData.latitude && formData.longitude && !showSuggestions && (
                  <span className="text-[#2e7d32] text-sm font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Location set!
                  </span>
                )}
              </div>

            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-white font-bold text-lg transition-colors flex items-center justify-center gap-2 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#2e7d32] hover:bg-[#1b5e20]'}`}>
              {loading ? 'Submitting...' : 'Post Request'}
              {!loading && <span className="material-symbols-outlined">send</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GetHelp;
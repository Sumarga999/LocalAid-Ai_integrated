import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [loading, setLoading] = useState(true);
  
  // Create Admin States
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();

  // 1. Security Check & Data Fetching
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    if (!user || user.role !== 'admin') {
      alert("Access Denied. Admins only.");
      navigate('/admin');
      return;
    }

    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [usersRes, tasksRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/users', { headers }),
        fetch('http://localhost:5000/api/admin/tasks', { headers })
      ]);

      if (usersRes.ok && tasksRes.ok) {
        setUsers(await usersRes.json());
        setTasks(await tasksRes.json());
      } else {
        throw new Error("Failed to fetch admin data");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Delete Handlers
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to completely delete this user?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setTasks(tasks.filter(t => t._id !== id));
      }
    } catch (err) {
      alert("Failed to delete task.");
    }
  };

  // 3. Create Admin Handler
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/create-admin', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAdmin)
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || "Failed to create admin");
      
      // Add the new admin to the table immediately
      setUsers([...users, data]);
      setNewAdmin({ name: '', email: '', password: '' });
      setShowAdminForm(false);
      alert("New Admin Created Successfully!");
      
    } catch (err) {
      alert(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Loading Admin Portal...</div>;

  return (
    <div className="min-h-[80vh] bg-slate-50 font-plus-jakarta p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <span className="material-symbols-outlined text-red-600 text-4xl">admin_panel_settings</span>
          Admin Dashboard
        </h1>

        <div className="flex gap-4 mb-6 border-b border-slate-200 pb-2">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'tasks' ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
          >
            Manage Tasks ({tasks.length})
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'users' ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
          >
            Manage Users ({users.length})
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                    <th className="p-4 border-b">Title</th>
                    <th className="p-4 border-b">Status</th>
                    <th className="p-4 border-b">Requester</th>
                    <th className="p-4 border-b text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-800">{task.title}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${task.status === 'completed' ? 'bg-slate-200 text-slate-600' : task.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{task.requester?.name || 'Unknown'}</td>
                      <td className="p-4 text-right space-x-4">
                        <button onClick={() => navigate(`/task/${task._id}`)} className="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors">View</button>
                        <button onClick={() => handleDeleteTask(task._id)} className="text-red-600 font-bold text-sm hover:text-red-800 transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div>
              {/* Action Bar */}
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
                <span className="text-sm text-slate-500 font-medium">Viewing all registered platform users.</span>
                <button 
                  onClick={() => setShowAdminForm(!showAdminForm)}
                  className="bg-[#1b5e20] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#124016] transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">{showAdminForm ? 'close' : 'add'}</span>
                  {showAdminForm ? 'Cancel' : 'Add New Admin'}
                </button>
              </div>

              {/* Create Admin Form Dropdown */}
              {showAdminForm && (
                <div className="p-6 bg-slate-100 border-b border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-700">shield_person</span>
                    Create Administrator Account
                  </h3>
                  <form onSubmit={handleCreateAdmin} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                      <input type="text" required value={newAdmin.name} onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none" placeholder="Jane Doe" />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                      <input type="email" required value={newAdmin.email} onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none" placeholder="jane@localaid.org" />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                      <input type="password" required minLength="6" value={newAdmin.password} onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none" placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={isCreating} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm w-full md:w-auto">
                      {isCreating ? 'Saving...' : 'Create Admin'}
                    </button>
                  </form>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-white text-slate-600 text-sm uppercase tracking-wider border-b border-slate-200">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-800 flex items-center gap-2">
                          {user.role === 'admin' && <span className="material-symbols-outlined text-red-600 text-[18px]" title="Admin">shield</span>}
                          {user.name}
                        </td>
                        <td className="p-4 text-sm text-slate-600">{user.email}</td>
                        <td className="p-4 text-sm font-bold text-slate-500 uppercase">
                          <span className={`px-2 py-1 rounded-md ${user.role === 'admin' ? 'text-red-700 bg-red-50' : 'text-slate-600 bg-slate-100'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {user.role !== 'admin' && (
                            <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 font-bold text-sm hover:text-red-800 transition-colors">Delete User</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {((activeTab === 'tasks' && tasks.length === 0) || (activeTab === 'users' && users.length === 0)) && (
            <div className="p-10 text-center text-slate-400 font-medium">No data found in this category.</div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
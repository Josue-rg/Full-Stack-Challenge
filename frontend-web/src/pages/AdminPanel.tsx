import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  role: string;
  totalGames: number;
  totalWins: number;
  createdAt: string;
}

const AdminPanel: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    loadUsers();
  }, [isAdmin, navigate]);

  const loadUsers = async () => {
    try {
      const usersData = await authService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      await api.patch(`api/auth/users/${userId}/role`, { role: newRole });
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (!isAdmin()) {
    return <div>Access denied</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Admin Panel</h1>
        <p className="text-purple-300 mb-6">Welcome, {user?.username} (Role: <span className="text-cyan-400">{user?.role}</span>)</p>
        
        <h2 className="text-xl font-semibold text-white mb-4">User Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-[#0f0f1a] rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-purple-900/50">
                <th className="border border-purple-500/30 px-4 py-3 text-left text-white font-semibold">ID</th>
                <th className="border border-purple-500/30 px-4 py-3 text-left text-white font-semibold">Username</th>
                <th className="border border-purple-500/30 px-4 py-3 text-left text-white font-semibold">Role</th>
                <th className="border border-purple-500/30 px-4 py-3 text-center text-white font-semibold">Games</th>
                <th className="border border-purple-500/30 px-4 py-3 text-center text-white font-semibold">Wins</th>
                <th className="border border-purple-500/30 px-4 py-3 text-left text-white font-semibold">Created At</th>
                <th className="border border-purple-500/30 px-4 py-3 text-center text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-purple-900/20 transition-colors">
                  <td className="border border-purple-500/20 px-4 py-3 text-gray-300 text-sm">{u.id}</td>
                  <td className="border border-purple-500/20 px-4 py-3 text-white font-medium">{u.username}</td>
                  <td className="border border-purple-500/20 px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      u.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="border border-purple-500/20 px-4 py-3 text-center text-gray-300">{u.totalGames}</td>
                  <td className="border border-purple-500/20 px-4 py-3 text-center text-gray-300">{u.totalWins}</td>
                  <td className="border border-purple-500/20 px-4 py-3 text-gray-300 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="border border-purple-500/20 px-4 py-3 text-center">
                    <select 
                      value={u.role} 
                      onChange={(e) => updateUserRole(u.id, e.target.value)}
                      className="bg-[#1a1a2e] text-white border border-purple-500/30 rounded px-3 py-1 text-sm focus:outline-none focus:border-purple-500"
                    >
                      <option value="user" className="bg-[#1a1a2e]">User</option>
                      <option value="admin" className="bg-[#1a1a2e]">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6">
          <button 
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
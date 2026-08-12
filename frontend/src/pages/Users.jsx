import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { UserPlus, Shield, CheckCircle, XCircle } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'Password123!',
    role: 'RECRUITER',
    department: 'Human Resources'
  });

  const fetchUsers = async () => {
    try {
      const res = await userService.getUsers();
      if (res.success) setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await userService.toggleUserStatus(id);
      fetchUsers();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await userService.createUser(newUser);
      setShowAddModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Management & RBAC
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Super Admin control panel for team access and roles.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/25 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{u.firstName} {u.lastName}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-600">{u.department}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      u.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u._id)}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Add Team User</h3>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <input
                type="text"
                placeholder="First Name"
                required
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs"
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs"
              />
              <input
                type="email"
                placeholder="Work Email"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs"
              >
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="HR_MANAGER">HR_MANAGER</option>
                <option value="RECRUITER">RECRUITER</option>
                <option value="INTERVIEWER">INTERVIEWER</option>
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

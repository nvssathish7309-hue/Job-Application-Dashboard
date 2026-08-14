import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Shield, CheckCircle, XCircle, UserCheck, Search, Key, Lock, Copy, Check, Filter, Eye, EyeOff, Edit3 } from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'SUPER_ADMIN', label: 'Super Admin', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'HR_MANAGER', label: 'HR Manager', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'RECRUITER', label: 'Recruiter', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'INTERVIEWER', label: 'Interviewer', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'CANDIDATE', label: 'Candidate', color: 'bg-sky-100 text-sky-700 border-sky-200' },
];

export default function Users() {
  const { user: currentUser, updateCurrentUser } = useAuth();
  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'HR_MANAGER';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Edit Team Member Modal State
  const [editModalUser, setEditModalUser] = useState(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editUpdating, setEditUpdating] = useState(false);

  // Password Visibility State (Revealed ONLY for Super Admin)
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'Password123!',
    role: 'RECRUITER',
    department: 'Human Resources',
    phone: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await userService.getUsers();
      if (res.success && res.data) {
        setUsers(res.data);
        localStorage.setItem('users', JSON.stringify(res.data));
        window.dispatchEvent(new CustomEvent('teamMembersUpdated', { detail: res.data }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    setUpdatingId(id);
    try {
      await userService.updateUserRole(id, newRole);
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await userService.toggleUserStatus(id);
      if (res.success) {
        setUsers(users.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
      }
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const generateRoleEmail = (role, firstName = '', lastName = '') => {
    const f = (firstName || '').toLowerCase().trim();
    const l = (lastName || '').toLowerCase().trim();
    const namePrefix = f ? (l ? `${f}.${l}` : f) : '';

    if (role === 'HR_MANAGER') {
      return namePrefix ? `${namePrefix}.hr@mindmatrix.com` : 'hr@mindmatrix.com';
    }
    if (role === 'RECRUITER') {
      return namePrefix ? `${namePrefix}.recruiter@mindmatrix.com` : 'recruiter@mindmatrix.com';
    }
    if (role === 'INTERVIEWER') {
      return namePrefix ? `${namePrefix}.interviewer@mindmatrix.com` : 'interviewer@mindmatrix.com';
    }
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      return namePrefix ? `${namePrefix}.admin@mindmatrix.com` : 'admin@mindmatrix.com';
    }
    if (role === 'CANDIDATE') {
      return namePrefix ? `${namePrefix}@gmail.com` : 'candidate@mindmatrix.com';
    }
    return 'hr@mindmatrix.com';
  };

  const handleOpenAddModal = () => {
    const defaultRole = 'HR_MANAGER';
    setNewUser({
      firstName: '',
      lastName: '',
      email: generateRoleEmail(defaultRole),
      password: 'Password123!',
      role: defaultRole,
      department: 'Human Resources',
      phone: ''
    });
    setShowAddModal(true);
  };

  const handleRoleSelectChange = (newRole) => {
    const newEmail = generateRoleEmail(newRole, newUser.firstName, newUser.lastName);
    setNewUser(prev => ({
      ...prev,
      role: newRole,
      email: newEmail
    }));
  };

  const handleNameInputChange = (field, val) => {
    setNewUser(prev => {
      const fn = field === 'firstName' ? val : prev.firstName;
      const ln = field === 'lastName' ? val : prev.lastName;
      const newEmail = generateRoleEmail(prev.role, fn, ln);
      return {
        ...prev,
        [field]: val,
        email: newEmail
      };
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await userService.createUser(newUser);
      if (res.success && res.data) {
        const createdUser = res.data;
        const fullName = `${createdUser.firstName || ''} ${createdUser.lastName || ''}`.trim();
        const updatedProfile = {
          name: fullName,
          phone: createdUser.phone || newUser.phone || '',
          email: createdUser.email || newUser.email,
          title: createdUser.department || newUser.department || 'Senior HR Manager'
        };
        localStorage.setItem('hrProfile', JSON.stringify(updatedProfile));
        window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: updatedProfile }));
      }
      setShowAddModal(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: generateRoleEmail('HR_MANAGER'),
        password: 'Password123!',
        role: 'HR_MANAGER',
        department: 'Human Resources',
        phone: ''
      });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleOpenEditModal = (u) => {
    setEditModalUser(u);
    setEditFirstName(u.firstName || '');
    setEditLastName(u.lastName || '');
    setEditDepartment(u.department || 'Human Resources');
    setEditPhone(u.phone || '');
    setEditPassword('');
    setShowPasswordText(false);
  };

  const handleUpdateUserDetails = async (e) => {
    e.preventDefault();
    if (!editModalUser) return;

    if (!editFirstName.trim() || !editLastName.trim() || !editDepartment.trim() || !editPhone.trim()) {
      alert('First Name, Last Name, Department, and Phone Number are all required fields.');
      return;
    }

    let digits = editPhone.replace(/\D/g, '');
    if (digits.startsWith('91')) digits = digits.slice(2);
    if (digits.length !== 10) {
      alert('Phone Number must be exactly 10 digits.');
      return;
    }

    setEditUpdating(true);
    try {
      const payload = {
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
        department: editDepartment.trim(),
        phone: editPhone.trim()
      };
      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      const res = await userService.updateUser(editModalUser._id, payload);
      if (res.success && res.data) {
        alert(`Successfully updated details for ${editModalUser.email}`);
        
        // Sync HR Profile automatically so Settings & Header auto-update!
        const fullName = `${res.data.firstName || editFirstName || ''} ${res.data.lastName || editLastName || ''}`.trim();
        const updatedProfile = {
          name: fullName,
          phone: res.data.phone || editPhone || '',
          email: res.data.email || editModalUser.email,
          title: res.data.department || editDepartment || 'Senior HR Manager'
        };
        // Update local users array in localStorage
        try {
          const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
          const userIdx = savedUsers.findIndex(u => (u._id || u.email) === (editModalUser._id || editModalUser.email));
          if (userIdx !== -1) {
            savedUsers[userIdx] = { ...savedUsers[userIdx], ...res.data, firstName: editFirstName, lastName: editLastName, department: editDepartment, phone: editPhone };
            localStorage.setItem('users', JSON.stringify(savedUsers));
          }
        } catch (e) {}

        // Dispatch global custom events for live component auto-update
        window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: updatedProfile }));
        window.dispatchEvent(new CustomEvent('teamMembersUpdated'));

        setEditModalUser(null);
        fetchUsers();
      } else {
        alert(res.message || 'Failed to update user details');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user details');
    } finally {
      setEditUpdating(false);
    }
  };

  const handleCopyCredentials = (u) => {
    const credText = `MindMatrix Team Access Credentials:\nRole: ${u.role}\nEmail: ${u.email}`;
    navigator.clipboard.writeText(credText);
    setCopyFeedback(u._id);
    setTimeout(() => setCopyFeedback(false), 2000);
  };
  const filteredUsers = users.filter(u => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = fullName.includes(query) || u.email?.toLowerCase().includes(query) || u.role?.toLowerCase().includes(query);
    const matchesRole = roleFilter === 'ALL'
      ? u.role !== 'CANDIDATE'
      : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-7 h-7 text-blue-600" />
            <span>User Management &amp; Team Access</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {isAdmin ? 'Super Admin Control Panel' : 'HR Management Panel'}: Edit team member names, departments, and reset access passwords.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Grant Team Access / Create Account</span>
        </button>
      </div>

      {/* Team Role Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">HR Managers</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">
              {users.filter(u => u.role === 'HR_MANAGER').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Recruiters</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">
              {users.filter(u => u.role === 'RECRUITER').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Interviewers</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">
              {users.filter(u => u.role === 'INTERVIEWER').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Active Team Users</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">
              {users.filter(u => u.role !== 'CANDIDATE' && u.isActive !== false).length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Role Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team members by name, email, or role..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Team Members' },
            { id: 'HR_MANAGER', label: 'HR Manager' },
            { id: 'RECRUITER', label: 'Recruiter' },
            { id: 'INTERVIEWER', label: 'Interviewer' },
            { id: 'SUPER_ADMIN', label: 'Super Admin' },
            { id: 'CANDIDATE', label: 'Candidates (Portal)' }
          ].map(roleItem => (
            <button
              key={roleItem.id}
              onClick={() => setRoleFilter(roleItem.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                roleFilter === roleItem.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {roleItem.label}
            </button>
          ))}
        </div>

      </div>



      {/* Table Container */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Assigned Role {isAdmin ? '(Super Admin Override)' : ''}</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Account Access</th>
                <th className="py-3.5 px-4 text-right">Edit Name &amp; Password</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(u => (
                <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                        {(u.firstName?.[0] || 'U')}{(u.lastName?.[0] || '')}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm">
                          {u.firstName || 'User'} {u.lastName || ''}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                          <span>{u.email}</span>
                          <button
                            onClick={() => handleCopyCredentials(u)}
                            className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Copy user details"
                          >
                            {copyFeedback === u._id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Dynamic Role Dropdown / Pill */}
                  <td className="py-3.5 px-4">
                    {isAdmin ? (
                      <select
                        value={u.role}
                        disabled={updatingId === u._id}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-extrabold text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer transition-all"
                      >
                        {ROLE_OPTIONS.map(r => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-xs inline-block border border-slate-200">
                        {u.role?.replace('_', ' ')}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-600">
                    {u.department || 'General'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                      u.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {u.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(u)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs rounded-xl border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Edit member name, department, or set password"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Edit / Set Password</span>
                      </button>

                      <button
                        onClick={() => handleToggleStatus(u._id)}
                        className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-colors cursor-pointer ${
                          u.isActive 
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200' 
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grant Access / Create Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>Grant Team Access &amp; Create Account</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.firstName}
                    onChange={(e) => handleNameInputChange('firstName', e.target.value)}
                    placeholder="Jane"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    style={{ color: '#0f172a' }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.lastName}
                    onChange={(e) => handleNameInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    style={{ color: '#0f172a' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address (Team Login Email) *
                </label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="hr@mindmatrix.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  style={{ color: '#0f172a' }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Initial Password *
                </label>
                <div className="flex items-center w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-xs overflow-hidden">
                  <input
                    type={isAdmin && showNewUserPassword ? "text" : "password"}
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Password123!"
                    className="w-full bg-transparent text-sm font-extrabold text-slate-900 placeholder:text-slate-400 border-0 outline-none focus:outline-none focus:ring-0 pr-2"
                    style={{ color: '#0f172a', opacity: 1 }}
                  />
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                      className="shrink-0 text-slate-400 hover:text-blue-600 transition-colors p-1 cursor-pointer flex items-center justify-center"
                      title={showNewUserPassword ? "Hide password" : "Show password"}
                    >
                      {showNewUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                {!isAdmin && (
                  <span className="text-[10px] font-semibold text-slate-400 mt-1 block">
                    Password visibility is restricted to Super Admin.
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned Access Role *
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => handleRoleSelectChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 cursor-pointer focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="HR_MANAGER">HR Manager</option>
                  <option value="RECRUITER">Recruiter</option>
                  <option value="INTERVIEWER">Interviewer</option>
                  {isAdmin && <option value="SUPER_ADMIN">Super Admin</option>}
                  <option value="CANDIDATE">Candidate</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  placeholder="Talent Acquisition / Engineering"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  style={{ color: '#0f172a' }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                >
                  Create &amp; Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Team Member Modal (Name, Department & Password) */}
      {editModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>Edit Team Member Details</span>
              </h3>
              <button 
                onClick={() => setEditModalUser(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium flex items-center justify-between">
              <div>
                Updating details for <span className="font-extrabold">{editModalUser.email}</span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-blue-600 text-white font-extrabold text-[10px] uppercase">
                {editModalUser.role?.replace('_', ' ')}
              </span>
            </div>

            <form onSubmit={handleUpdateUserDetails} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    style={{ color: '#0f172a' }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    style={{ color: '#0f172a' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Department / Role Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engineering / Human Resources"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  style={{ color: '#0f172a' }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number (Ph. No) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  style={{ color: '#0f172a' }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Access Password (New Password)
                </label>
                <div className="flex items-center w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-xs overflow-hidden">
                  <input
                    type={isAdmin && showPasswordText ? "text" : "password"}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Enter new password (or leave blank to keep)"
                    className="w-full bg-transparent text-sm font-extrabold text-slate-900 placeholder:text-slate-400 border-0 outline-none focus:outline-none focus:ring-0 pr-2"
                    style={{ color: '#0f172a', opacity: 1 }}
                  />
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowPasswordText(!showPasswordText)}
                      className="shrink-0 text-slate-400 hover:text-blue-600 transition-colors p-1 cursor-pointer flex items-center justify-center"
                      title={showPasswordText ? "Hide password" : "Show password"}
                    >
                      {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                  {isAdmin 
                    ? "As Super Admin, you can view or toggle password visibility." 
                    : "🔒 Password visibility is restricted to Super Admin only."}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditModalUser(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editUpdating}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-70"
                >
                  {editUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

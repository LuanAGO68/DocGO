import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Shield, Mail, Building, Briefcase, Search, Filter } from 'lucide-react';
import { User } from '../types/user';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onAddUser: (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => void;
  onUpdateUser: (userId: string, userData: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'employee' as 'employee' | 'manager' | 'admin' | 'legal',
    department: '',
    position: '',
    permissions: {
      canUpload: true,
      canApprove: false,
      canManageUsers: false,
      canViewAnalytics: false,
      canSign: false
    }
  });

  const getRoleText = (role: string) => {
    switch (role) {
      case 'employee': return 'Nhân viên';
      case 'manager': return 'Quản lý';
      case 'director': return 'Giám đốc';
      case 'finance': return 'Tài chính';
      case 'admin': return 'Quản trị viên';
      case 'legal': return 'Pháp chế';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'employee': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'director': return 'bg-purple-100 text-purple-800';
      case 'finance': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'legal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser(newUser);
    setNewUser({
      email: '',
      name: '',
      role: 'employee',
      department: '',
      position: '',
      permissions: {
        canUpload: true,
        canApprove: false,
        canManageUsers: false,
        canViewAnalytics: false,
        canSign: false
      }
    });
    setShowAddForm(false);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUser(editingUser.id, editingUser);
      setEditingUser(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const departments = [...new Set(users.map(u => u.department))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Quản lý người dùng</h2>
        </div>
        {currentUser.permissions.canManageUsers && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm người dùng</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="employee">Nhân viên</option>
          <option value="manager">Quản lý</option>
          <option value="director">Giám đốc</option>
          <option value="finance">Tài chính</option>
          <option value="admin">Quản trị viên</option>
          <option value="legal">Pháp chế</option>
        </select>
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả phòng ban</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm người dùng mới</h3>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
              <input
                type="text"
                required
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="employee">Nhân viên</option>
                <option value="manager">Quản lý</option>
                <option value="admin">Quản trị viên</option>
                <option value="legal">Pháp chế</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phòng ban</label>
              <input
                type="text"
                required
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chức vụ</label>
              <input
                type="text"
                required
                value={newUser.position}
                onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quyền hạn</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newUser.permissions.canUpload}
                    onChange={(e) => setNewUser({
                      ...newUser,
                      permissions: { ...newUser.permissions, canUpload: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Tải lên</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newUser.permissions.canApprove}
                    onChange={(e) => setNewUser({
                      ...newUser,
                      permissions: { ...newUser.permissions, canApprove: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Phê duyệt</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newUser.permissions.canSign}
                    onChange={(e) => setNewUser({
                      ...newUser,
                      permissions: { ...newUser.permissions, canSign: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Ký hợp đồng</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newUser.permissions.canViewAnalytics}
                    onChange={(e) => setNewUser({
                      ...newUser,
                      permissions: { ...newUser.permissions, canViewAnalytics: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Xem thống kê</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newUser.permissions.canManageUsers}
                    onChange={(e) => setNewUser({
                      ...newUser,
                      permissions: { ...newUser.permissions, canManageUsers: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Quản lý user</span>
                </label>
              </div>
            </div>
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thêm người dùng
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng ban
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quyền hạn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">{user.position}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.department}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.canUpload && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Upload</span>
                      )}
                      {user.permissions.canApprove && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Duyệt</span>
                      )}
                      {user.permissions.canSign && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Ký</span>
                      )}
                      {user.permissions.canManageUsers && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Admin</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isActive ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {currentUser.permissions.canManageUsers && user.id !== currentUser.id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa người dùng</h3>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="employee">Nhân viên</option>
                    <option value="manager">Quản lý</option>
                    <option value="director">Giám đốc</option>
                    <option value="finance">Tài chính</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="legal">Pháp chế</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                  <select
                    value={editingUser.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.value === 'active' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm khóa</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quyền hạn</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingUser.permissions.canUpload}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        permissions: { ...editingUser.permissions, canUpload: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Tải lên</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingUser.permissions.canApprove}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        permissions: { ...editingUser.permissions, canApprove: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Phê duyệt</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingUser.permissions.canSign}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        permissions: { ...editingUser.permissions, canSign: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Ký hợp đồng</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingUser.permissions.canViewAnalytics}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        permissions: { ...editingUser.permissions, canViewAnalytics: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Xem thống kê</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingUser.permissions.canManageUsers}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        permissions: { ...editingUser.permissions, canManageUsers: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Quản lý user</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
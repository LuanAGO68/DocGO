import React from 'react';
import { X, Check, XCircle, User, Mail, Building, Briefcase } from 'lucide-react';
import { User as UserType } from '../types/user';

interface UserApprovalPanelProps {
  users: UserType[];
  onClose: () => void;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

export const UserApprovalPanel: React.FC<UserApprovalPanelProps> = ({
  users,
  onClose,
  onApprove,
  onReject
}) => {
  const getRoleText = (role: string) => {
    switch (role) {
      case 'employee': return 'Nhân viên';
      case 'manager': return 'Quản lý';
      case 'admin': return 'Quản trị viên';
      case 'legal': return 'Pháp chế';
      case 'director': return 'Giám đốc';
      case 'finance': return 'Tài chính';
      default: return role;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Phê duyệt tài khoản ({users.length})
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Không có tài khoản nào cần phê duyệt</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Building className="w-4 h-4" />
                            <span>{user.department}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Briefcase className="w-4 h-4" />
                            <span>{user.position}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="font-medium">Vai trò:</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {getRoleText(user.role)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Đăng ký: {new Date(user.createdAt).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onApprove(user.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>Phê duyệt</span>
                      </button>
                      <button
                        onClick={() => onReject(user.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Từ chối</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
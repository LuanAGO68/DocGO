import React, { useState } from 'react';
import { X, User, CheckCircle, AlertTriangle, Brain, Edit } from 'lucide-react';
import { Contract } from '../types/contract';
import { User as UserType } from '../types/user';

interface ApprovalWorkflowModalProps {
  contract: Contract;
  users: UserType[];
  onSubmit: (approvers: Array<{ userId: string; role: string; stepNumber: number }>) => void;
  onClose: () => void;
}

interface SuggestedApprover {
  user: UserType;
  role: 'content' | 'finance' | 'legal';
  reason: string;
  confidence: number;
}

export const ApprovalWorkflowModal: React.FC<ApprovalWorkflowModalProps> = ({
  contract,
  users,
  onSubmit,
  onClose
}) => {
  const [selectedApprovers, setSelectedApprovers] = useState<Array<{ userId: string; role: string; stepNumber: number }>>([]);
  const [isManualMode, setIsManualMode] = useState(false);

  // AI-suggested approvers based on contract content and value
  const getSuggestedApprovers = (): SuggestedApprover[] => {
    const suggestions: SuggestedApprover[] = [];
    const contractValue = contract.extractedInfo?.numericValue || 0;
    const contractType = contract.extractedInfo?.contractType || '';
    const isCommercial = contract.contractCategory === 'commercial';

    // Content approver suggestion
    const contentApprovers = users.filter(u => 
      u.permissions.canApprove && 
      (u.role === 'manager' || u.role === 'director') &&
      u.maxContractValue >= contractValue
    );
    
    if (contentApprovers.length > 0) {
      const bestContentApprover = contentApprovers.reduce((best, current) => 
        current.approvalLevel > best.approvalLevel ? current : best
      );
      
      suggestions.push({
        user: bestContentApprover,
        role: 'content',
        reason: `Có quyền phê duyệt hợp đồng giá trị ${contractValue.toLocaleString('vi-VN')} VND và kinh nghiệm với loại hợp đồng ${contractType}`,
        confidence: 0.9
      });
    }

    // Finance approver suggestion
    if (contractValue > 100000000 || isCommercial) { // > 100M VND or commercial
      const financeApprovers = users.filter(u => 
        u.role === 'finance' && u.permissions.canApprove
      );
      
      if (financeApprovers.length > 0) {
        suggestions.push({
          user: financeApprovers[0],
          role: 'finance',
          reason: `Hợp đồng có giá trị cao (${contractValue.toLocaleString('vi-VN')} VND) cần kiểm tra tài chính`,
          confidence: 0.85
        });
      }
    }

    // Legal approver suggestion
    if (isCommercial || contractType.includes('thuê') || contractType.includes('mua bán')) {
      const legalApprovers = users.filter(u => 
        u.role === 'legal' && u.permissions.canApprove
      );
      
      if (legalApprovers.length > 0) {
        suggestions.push({
          user: legalApprovers[0],
          role: 'legal',
          reason: `Hợp đồng ${isCommercial ? 'thương mại' : 'có tính chất pháp lý phức tạp'} cần kiểm tra pháp lý`,
          confidence: 0.8
        });
      }
    }

    return suggestions;
  };

  const suggestedApprovers = getSuggestedApprovers();

  React.useEffect(() => {
    // Auto-select suggested approvers
    const autoSelected = suggestedApprovers.map((suggestion, index) => ({
      userId: suggestion.user.id,
      role: suggestion.role,
      stepNumber: index + 1
    }));
    setSelectedApprovers(autoSelected);
  }, []);

  const handleApproverChange = (stepNumber: number, userId: string, role: string) => {
    setSelectedApprovers(prev => {
      const updated = prev.filter(a => a.stepNumber !== stepNumber);
      if (userId) {
        updated.push({ userId, role, stepNumber });
      }
      return updated.sort((a, b) => a.stepNumber - b.stepNumber);
    });
  };

  const handleSubmit = () => {
    if (selectedApprovers.length > 0) {
      onSubmit(selectedApprovers);
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'content': return 'Phê duyệt nội dung';
      case 'finance': return 'Phê duyệt tài chính';
      case 'legal': return 'Phê duyệt pháp lý';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'content': return 'bg-blue-100 text-blue-800';
      case 'finance': return 'bg-green-100 text-green-800';
      case 'legal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Gửi hợp đồng để phê duyệt</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contract Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">{contract.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Loại:</span>
                <div className="font-medium">{contract.contractCategory === 'commercial' ? 'Thương mại' : 'Nội bộ'}</div>
              </div>
              <div>
                <span className="text-gray-500">Giá trị:</span>
                <div className="font-medium">{contract.extractedInfo?.value || 'Chưa xác định'}</div>
              </div>
              <div>
                <span className="text-gray-500">Thời hạn:</span>
                <div className="font-medium">{contract.extractedInfo?.duration || 'Chưa xác định'}</div>
              </div>
              <div>
                <span className="text-gray-500">Các bên:</span>
                <div className="font-medium">{contract.extractedInfo?.parties.length || 0} bên</div>
              </div>
            </div>
          </div>

          {/* AI Suggestions Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium text-gray-900">
                {isManualMode ? 'Chọn người duyệt thủ công' : 'Gợi ý AI cho luồng phê duyệt'}
              </h3>
            </div>
            <button
              onClick={() => setIsManualMode(!isManualMode)}
              className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>{isManualMode ? 'Dùng gợi ý AI' : 'Chỉnh sửa thủ công'}</span>
            </button>
          </div>

          {!isManualMode && (
            <div className="space-y-4">
              {/* AI Suggestions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Gợi ý dựa trên AI</h4>
                </div>
                <div className="space-y-3">
                  {suggestedApprovers.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{suggestion.user.name}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(suggestion.role)}`}>
                            {getRoleText(suggestion.role)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${
                              suggestion.confidence > 0.8 ? 'bg-green-500' : 
                              suggestion.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <span className="text-xs text-gray-500">
                              {Math.round(suggestion.confidence * 100)}% phù hợp
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{suggestion.reason}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {suggestion.user.department} • {suggestion.user.position}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Manual Selection */}
          {isManualMode && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Content Approver */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phê duyệt nội dung
                  </label>
                  <select
                    value={selectedApprovers.find(a => a.role === 'content')?.userId || ''}
                    onChange={(e) => handleApproverChange(1, e.target.value, 'content')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn người duyệt</option>
                    {users.filter(u => u.permissions.canApprove && (u.role === 'manager' || u.role === 'director')).map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.position})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Finance Approver */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phê duyệt tài chính (tùy chọn)
                  </label>
                  <select
                    value={selectedApprovers.find(a => a.role === 'finance')?.userId || ''}
                    onChange={(e) => handleApproverChange(2, e.target.value, 'finance')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Không cần</option>
                    {users.filter(u => u.role === 'finance' && u.permissions.canApprove).map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.position})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Legal Approver */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phê duyệt pháp lý (tùy chọn)
                  </label>
                  <select
                    value={selectedApprovers.find(a => a.role === 'legal')?.userId || ''}
                    onChange={(e) => handleApproverChange(3, e.target.value, 'legal')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Không cần</option>
                    {users.filter(u => u.role === 'legal' && u.permissions.canApprove).map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.position})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Selected Approvers Summary */}
          {selectedApprovers.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-3">Luồng phê duyệt được chọn:</h4>
              <div className="space-y-2">
                {selectedApprovers
                  .sort((a, b) => a.stepNumber - b.stepNumber)
                  .map((approver, index) => {
                    const user = users.find(u => u.id === approver.userId);
                    return (
                      <div key={approver.userId} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{user?.name}</span>
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(approver.role)}`}>
                            {getRoleText(approver.role)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedApprovers.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Gửi phê duyệt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
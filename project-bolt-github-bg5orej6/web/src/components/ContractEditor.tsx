import React, { useState } from 'react';
import { Save, X, FileText, Edit3 } from 'lucide-react';
import { Contract, ContractTag } from '../types/contract';

interface ContractEditorProps {
  contract: Contract;
  availableTags: ContractTag[];
  onSave: (contractId: string, updates: Partial<Contract>) => void;
  onClose: () => void;
  canEdit: boolean;
}

export const ContractEditor: React.FC<ContractEditorProps> = ({
  contract,
  availableTags,
  onSave,
  onClose,
  canEdit
}) => {
  const [editedContract, setEditedContract] = useState({
    title: contract.title,
    description: contract.description,
    tags: contract.tags,
    extractedInfo: contract.extractedInfo || {
      contractType: '',
      parties: [],
      value: '',
      duration: '',
      summary: '',
      fullText: ''
    }
  });

  const [newParty, setNewParty] = useState('');

  const handleSave = () => {
    onSave(contract.id, editedContract);
    onClose();
  };

  const handleAddTag = (tag: ContractTag) => {
    if (!editedContract.tags.find(t => t.id === tag.id)) {
      setEditedContract({
        ...editedContract,
        tags: [...editedContract.tags, tag]
      });
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setEditedContract({
      ...editedContract,
      tags: editedContract.tags.filter(t => t.id !== tagId)
    });
  };

  const handleAddParty = () => {
    if (newParty.trim() && !editedContract.extractedInfo.parties.includes(newParty.trim())) {
      setEditedContract({
        ...editedContract,
        extractedInfo: {
          ...editedContract.extractedInfo,
          parties: [...editedContract.extractedInfo.parties, newParty.trim()]
        }
      });
      setNewParty('');
    }
  };

  const handleRemoveParty = (party: string) => {
    setEditedContract({
      ...editedContract,
      extractedInfo: {
        ...editedContract.extractedInfo,
        parties: editedContract.extractedInfo.parties.filter(p => p !== party)
      }
    });
  };

  const getTagColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
      red: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  if (!canEdit) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không thể chỉnh sửa</h3>
            <p className="text-gray-600 mb-4">
              Hợp đồng này không thể chỉnh sửa ở trạng thái hiện tại.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Chỉnh sửa hợp đồng</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên hợp đồng
              </label>
              <input
                type="text"
                value={editedContract.title}
                onChange={(e) => setEditedContract({ ...editedContract, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={editedContract.description}
                onChange={(e) => setEditedContract({ ...editedContract, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {editedContract.tags.map(tag => (
                  <span
                    key={tag.id}
                    className={`px-3 py-1 text-sm font-medium rounded-full border ${getTagColor(tag.color)} cursor-pointer`}
                    onClick={() => handleRemoveTag(tag.id)}
                  >
                    {tag.name} ×
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter(tag => !editedContract.tags.find(t => t.id === tag.id))
                  .map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => handleAddTag(tag)}
                      className={`px-3 py-1 text-sm font-medium rounded-full border border-dashed hover:bg-opacity-50 ${getTagColor(tag.color)}`}
                    >
                      + {tag.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Extracted Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Thông tin trích xuất</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại hợp đồng
                </label>
                <input
                  type="text"
                  value={editedContract.extractedInfo.contractType}
                  onChange={(e) => setEditedContract({
                    ...editedContract,
                    extractedInfo: { ...editedContract.extractedInfo, contractType: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá trị hợp đồng
                </label>
                <input
                  type="text"
                  value={editedContract.extractedInfo.value}
                  onChange={(e) => setEditedContract({
                    ...editedContract,
                    extractedInfo: { ...editedContract.extractedInfo, value: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời hạn
                </label>
                <input
                  type="text"
                  value={editedContract.extractedInfo.duration}
                  onChange={(e) => setEditedContract({
                    ...editedContract,
                    extractedInfo: { ...editedContract.extractedInfo, duration: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Các bên tham gia
              </label>
              <div className="space-y-2 mb-3">
                {editedContract.extractedInfo.parties.map((party, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{party}</span>
                    <button
                      onClick={() => handleRemoveParty(party)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newParty}
                  onChange={(e) => setNewParty(e.target.value)}
                  placeholder="Thêm bên tham gia..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddParty()}
                />
                <button
                  onClick={handleAddParty}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Thêm
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tóm tắt nội dung
              </label>
              <textarea
                value={editedContract.extractedInfo.summary}
                onChange={(e) => setEditedContract({
                  ...editedContract,
                  extractedInfo: { ...editedContract.extractedInfo, summary: e.target.value }
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung đầy đủ
              </label>
              <textarea
                value={editedContract.extractedInfo.fullText}
                onChange={(e) => setEditedContract({
                  ...editedContract,
                  extractedInfo: { ...editedContract.extractedInfo, fullText: e.target.value }
                })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
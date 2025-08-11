import React, { useState } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { Contract } from '../types/contract';

interface ContractUploadProps {
  onUpload: (file: File, isBasedOnExisting: boolean, parentContractId?: string) => void;
  onClose: () => void;
  existingContracts: Contract[];
}

export const ContractUpload: React.FC<ContractUploadProps> = ({
  onUpload,
  onClose,
  existingContracts
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isBasedOnExisting, setIsBasedOnExisting] = useState(false);
  const [selectedParentContract, setSelectedParentContract] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploadStatus('uploading');
    
    // Simulate upload process
    setTimeout(() => {
      setUploadStatus('success');
      onUpload(selectedFile, isBasedOnExisting, selectedParentContract || undefined);
    }, 2000);
  };

  const filteredContracts = existingContracts.filter(contract =>
    contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (uploadStatus === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tải lên thành công!</h3>
            <p className="text-gray-600 mb-6">
              Hợp đồng đã được tải lên và đang được xử lý OCR.
            </p>
            
            <div className="space-y-3">
              {isBasedOnExisting && selectedParentContract && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Đã tạo phiên bản mới dựa trên hợp đồng: {existingContracts.find(c => c.id === selectedParentContract)?.title}
                  </p>
                </div>
              )}
              
              <div className="flex space-x-3">
                {isBasedOnExisting && selectedParentContract && (
                  <button
                    onClick={() => {
                      // Navigate to parent contract
                      onClose();
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Xem hợp đồng gốc
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Vào mục Hợp đồng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Tải lên hợp đồng</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : selectedFile
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <FileText className="w-12 h-12 text-green-500 mx-auto" />
                <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Xóa file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Kéo thả file vào đây hoặc
                  </p>
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-800 font-medium">
                      chọn file từ máy tính
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Hỗ trợ: PDF, JPG, PNG (tối đa 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Based on Existing Contract Option */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="basedOnExisting"
                checked={isBasedOnExisting}
                onChange={(e) => setIsBasedOnExisting(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="basedOnExisting" className="text-sm font-medium text-gray-700">
                Dựa trên hợp đồng cũ (tạo phiên bản mới)
              </label>
            </div>

            {isBasedOnExisting && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm hợp đồng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2">
                  {filteredContracts.map(contract => (
                    <div
                      key={contract.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedParentContract === contract.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedParentContract(contract.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="parentContract"
                          checked={selectedParentContract === contract.id}
                          onChange={() => setSelectedParentContract(contract.id)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{contract.title}</h4>
                          <p className="text-sm text-gray-500">{contract.description}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                            <span>Phiên bản: {contract.currentVersion}</span>
                            <span>Cập nhật: {new Date(contract.uploadDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredContracts.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Không tìm thấy hợp đồng nào
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploadStatus === 'uploading' || (isBasedOnExisting && !selectedParentContract)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {uploadStatus === 'uploading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang tải lên...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Tải lên</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
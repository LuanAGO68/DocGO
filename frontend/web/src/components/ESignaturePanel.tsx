import React, { useState } from 'react';
import { Send, CheckCircle, Clock, Mail, FileSignature } from 'lucide-react';
import { Contract, ESignatureRequest } from '../types/contract';
import { User } from '../types/user';

interface ESignaturePanelProps {
  contract: Contract;
  availableSigners: User[];
  onSendForSignature: (signers: Array<{ email: string; name: string; role: string }>, provider: string) => void;
}

export const ESignaturePanel: React.FC<ESignaturePanelProps> = ({
  contract,
  availableSigners,
  onSendForSignature
}) => {
  const [signers, setSigners] = useState([
    { email: '', name: '', role: '' }
  ]);
  const [provider, setProvider] = useState('docusign');
  const [signOrder, setSignOrder] = useState<{ [key: number]: number }>({});

  const addSigner = () => {
    setSigners([...signers, { email: '', name: '', role: '' }]);
  };

  const updateSigner = (index: number, field: string, value: string) => {
    const updated = signers.map((signer, i) => 
      i === index ? { ...signer, [field]: value } : signer
    );
    setSigners(updated);
  };

  const removeSigner = (index: number) => {
    setSigners(signers.filter((_, i) => i !== index));
  };

  const updateSignOrder = (index: number, order: number) => {
    setSignOrder({ ...signOrder, [index]: order });
  };

  const addUserAsSigner = (user: User) => {
    if (!signers.find(s => s.email === user.email)) {
      setSigners([...signers, {
        email: user.email,
        name: user.name,
        role: user.position
      }]);
    }
  };

  const handleSend = () => {
    const validSigners = signers.filter(s => s.email && s.name && s.role);
    if (validSigners.length > 0) {
      onSendForSignature(validSigners, provider);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <FileSignature className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Chữ ký điện tử</h3>
        </div>
      </div>

      <div className="p-6">
        {contract.eSignature ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Trạng thái ký</h4>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                contract.eSignature.status === 'completed' 
                  ? 'bg-green-100 text-green-800'
                  : contract.eSignature.status === 'pending'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {contract.eSignature.status === 'completed' ? 'Hoàn thành' :
                 contract.eSignature.status === 'pending' ? 'Đang chờ ký' : 'Đã hủy'}
              </span>
            </div>

            <div className="space-y-3">
              {contract.eSignature.signers.map((signer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{signer.name}</div>
                    <div className="text-sm text-gray-500">{signer.email} • {signer.role}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {signer.signed ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-600">
                          Đã ký {signer.signedAt && new Date(signer.signedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-amber-500" />
                        <span className="text-sm text-amber-600">Chờ ký</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-500">
              Nhà cung cấp: {contract.eSignature.provider === 'docusign' ? 'DocuSign' : 
                            contract.eSignature.provider === 'adobe' ? 'Adobe Sign' : 'ViettelSign'}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhà cung cấp chữ ký
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="docusign">DocuSign</option>
                <option value="adobe">Adobe Sign</option>
                <option value="viettel">ViettelSign</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Chọn từ danh sách người dùng
                </label>
              </div>
              <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                {availableSigners
                  .filter(user => user.permissions.canSign)
                  .map(user => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email} • {user.position}</div>
                      </div>
                      <button
                        onClick={() => addUserAsSigner(user)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Thêm
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Người ký
                </label>
                <button
                  onClick={addSigner}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Thêm người ký
                </button>
              </div>

              <div className="space-y-3">
                {signers.map((signer, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="text"
                      placeholder="Họ tên"
                      value={signer.name}
                      onChange={(e) => updateSigner(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={signer.email}
                      onChange={(e) => updateSigner(index, 'email', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Vai trò"
                      value={signer.role}
                      onChange={(e) => updateSigner(index, 'role', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      value={signOrder[index] || ''}
                      onChange={(e) => updateSignOrder(index, parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Thứ tự ký</option>
                      {Array.from({ length: signers.length }, (_, i) => (
                        <option key={i + 1} value={i + 1}>Thứ {i + 1}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeSigner(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {signers.length > 1 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-800 font-medium mb-2">Thứ tự ký:</div>
                <div className="text-sm text-blue-700">
                  {signers
                    .map((signer, index) => ({ ...signer, index, order: signOrder[index] || 999 }))
                    .sort((a, b) => a.order - b.order)
                    .map((signer, sortedIndex) => (
                      <div key={signer.index}>
                        {sortedIndex + 1}. {signer.name} ({signer.role})
                      </div>
                    ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={signers.filter(s => s.email && s.name && s.role).length === 0}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Gửi yêu cầu ký</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
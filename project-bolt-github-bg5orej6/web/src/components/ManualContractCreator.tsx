import React, { useState } from 'react';
import { X, Save, FileText, Plus, Minus } from 'lucide-react';
import { Contract, ContractTag } from '../types/contract';

interface ManualContractCreatorProps {
  onClose: () => void;
  onSave: (contract: Omit<Contract, 'id' | 'status' | 'uploadDate' | 'versions' | 'currentVersion' | 'approvalSteps' | 'currentStep' | 'reminders'>) => void;
  availableTags: ContractTag[];
}

export const ManualContractCreator: React.FC<ManualContractCreatorProps> = ({
  onClose,
  onSave,
  availableTags
}) => {
  const [contractData, setContractData] = useState({
    title: '',
    description: '',
    tags: [] as ContractTag[],
    extractedInfo: {
      contractType: '',
      parties: [''],
      value: '',
      numericValue: 0,
      duration: '',
      summary: '',
      detailedSummary: {
        generalInfo: {
          contractName: '',
          contractNumber: '',
          signDate: '',
          effectiveDate: '',
          expiryDate: '',
          parties: [
            { name: '', address: '', representative: '', role: 'A' as 'A' | 'B' },
            { name: '', address: '', representative: '', role: 'B' as 'A' | 'B' }
          ]
        },
        purpose: '',
        financialInfo: {
          totalValue: '',
          unitPrice: '',
          paymentMethod: '',
          paymentSchedule: ''
        },
        timeline: {
          duration: '',
          milestones: [''],
          terminationConditions: ''
        },
        obligations: {
          partyA: [''],
          partyB: ['']
        },
        warranties: {
          warranty: '',
          confidentiality: '',
          penalties: ''
        },
        disputeResolution: {
          jurisdiction: '',
          venue: ''
        },
        attachments: [''],
        currentStatus: '',
        notes: ''
      },
      fullText: ''
    }
  });

  const handleSave = () => {
    if (!contractData.title.trim()) {
      alert('Vui lòng nhập tên hợp đồng');
      return;
    }

    // Parse numeric value from string
    const numericValue = parseFloat(contractData.extractedInfo.value.replace(/[^\d.]/g, '')) || 0;
    
    const finalData = {
      ...contractData,
      extractedInfo: {
        ...contractData.extractedInfo,
        numericValue,
        parties: contractData.extractedInfo.parties.filter(p => p.trim()),
        fullText: generateFullText()
      }
    };

    onSave(finalData);
  };

  const generateFullText = () => {
    const { detailedSummary } = contractData.extractedInfo;
    return `
HỢP ĐỒNG: ${detailedSummary?.generalInfo.contractName || contractData.title}
Số hợp đồng: ${detailedSummary?.generalInfo.contractNumber || 'N/A'}

CÁC BÊN THAM GIA:
${detailedSummary?.generalInfo.parties.map(p => 
  `Bên ${p.role}: ${p.name}\nĐịa chỉ: ${p.address}\nĐại diện: ${p.representative}`
).join('\n\n')}

MỤC ĐÍCH: ${detailedSummary?.purpose}

GIÁ TRỊ HỢP ĐỒNG: ${contractData.extractedInfo.value}
THỜI HẠN: ${contractData.extractedInfo.duration}

NGHĨA VỤ CÁC BÊN:
Bên A: ${detailedSummary?.obligations.partyA.join(', ')}
Bên B: ${detailedSummary?.obligations.partyB.join(', ')}

BẢO HÀNH VÀ BẢO MẬT:
${detailedSummary?.warranties.warranty}
${detailedSummary?.warranties.confidentiality}

GIẢI QUYẾT TRANH CHẤP:
Cơ quan: ${detailedSummary?.disputeResolution.jurisdiction}
Địa điểm: ${detailedSummary?.disputeResolution.venue}
    `.trim();
  };

  const addArrayItem = (path: string) => {
    const keys = path.split('.');
    const newData = { ...contractData };
    let current: any = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    const lastKey = keys[keys.length - 1];
    if (Array.isArray(current[lastKey])) {
      current[lastKey].push('');
    }
    
    setContractData(newData);
  };

  const removeArrayItem = (path: string, index: number) => {
    const keys = path.split('.');
    const newData = { ...contractData };
    let current: any = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    const lastKey = keys[keys.length - 1];
    if (Array.isArray(current[lastKey])) {
      current[lastKey].splice(index, 1);
    }
    
    setContractData(newData);
  };

  const updateArrayItem = (path: string, index: number, value: string) => {
    const keys = path.split('.');
    const newData = { ...contractData };
    let current: any = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    const lastKey = keys[keys.length - 1];
    if (Array.isArray(current[lastKey])) {
      current[lastKey][index] = value;
    }
    
    setContractData(newData);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Tạo hợp đồng thủ công</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">1. Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên hợp đồng *</label>
                <input
                  type="text"
                  required
                  value={contractData.title}
                  onChange={(e) => setContractData({ ...contractData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số hợp đồng</label>
                <input
                  type="text"
                  value={contractData.extractedInfo.detailedSummary?.generalInfo.contractNumber || ''}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: {
                      ...contractData.extractedInfo,
                      detailedSummary: {
                        ...contractData.extractedInfo.detailedSummary!,
                        generalInfo: {
                          ...contractData.extractedInfo.detailedSummary!.generalInfo,
                          contractNumber: e.target.value
                        }
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày ký</label>
                <input
                  type="date"
                  value={contractData.extractedInfo.detailedSummary?.generalInfo.signDate || ''}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: {
                      ...contractData.extractedInfo,
                      detailedSummary: {
                        ...contractData.extractedInfo.detailedSummary!,
                        generalInfo: {
                          ...contractData.extractedInfo.detailedSummary!.generalInfo,
                          signDate: e.target.value
                        }
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hiệu lực từ</label>
                <input
                  type="date"
                  value={contractData.extractedInfo.detailedSummary?.generalInfo.effectiveDate || ''}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: {
                      ...contractData.extractedInfo,
                      detailedSummary: {
                        ...contractData.extractedInfo.detailedSummary!,
                        generalInfo: {
                          ...contractData.extractedInfo.detailedSummary!.generalInfo,
                          effectiveDate: e.target.value
                        }
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <textarea
                value={contractData.description}
                onChange={(e) => setContractData({ ...contractData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Parties */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">2. Các bên tham gia</h3>
            {contractData.extractedInfo.detailedSummary?.generalInfo.parties.map((party, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Bên {party.role}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                    <input
                      type="text"
                      value={party.name}
                      onChange={(e) => {
                        const newParties = [...contractData.extractedInfo.detailedSummary!.generalInfo.parties];
                        newParties[index] = { ...party, name: e.target.value };
                        setContractData({
                          ...contractData,
                          extractedInfo: {
                            ...contractData.extractedInfo,
                            detailedSummary: {
                              ...contractData.extractedInfo.detailedSummary!,
                              generalInfo: {
                                ...contractData.extractedInfo.detailedSummary!.generalInfo,
                                parties: newParties
                              }
                            }
                          }
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đại diện</label>
                    <input
                      type="text"
                      value={party.representative}
                      onChange={(e) => {
                        const newParties = [...contractData.extractedInfo.detailedSummary!.generalInfo.parties];
                        newParties[index] = { ...party, representative: e.target.value };
                        setContractData({
                          ...contractData,
                          extractedInfo: {
                            ...contractData.extractedInfo,
                            detailedSummary: {
                              ...contractData.extractedInfo.detailedSummary!,
                              generalInfo: {
                                ...contractData.extractedInfo.detailedSummary!.generalInfo,
                                parties: newParties
                              }
                            }
                          }
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      value={party.address}
                      onChange={(e) => {
                        const newParties = [...contractData.extractedInfo.detailedSummary!.generalInfo.parties];
                        newParties[index] = { ...party, address: e.target.value };
                        setContractData({
                          ...contractData,
                          extractedInfo: {
                            ...contractData.extractedInfo,
                            detailedSummary: {
                              ...contractData.extractedInfo.detailedSummary!,
                              generalInfo: {
                                ...contractData.extractedInfo.detailedSummary!.generalInfo,
                                parties: newParties
                              }
                            }
                          }
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">3. Thông tin tài chính</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tổng giá trị *</label>
                <input
                  type="text"
                  required
                  value={contractData.extractedInfo.value}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: {
                      ...contractData.extractedInfo,
                      value: e.target.value,
                      detailedSummary: {
                        ...contractData.extractedInfo.detailedSummary!,
                        financialInfo: {
                          ...contractData.extractedInfo.detailedSummary!.financialInfo,
                          totalValue: e.target.value
                        }
                      }
                    }
                  })}
                  placeholder="VD: 1.000.000.000 VND"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
                <input
                  type="text"
                  value={contractData.extractedInfo.detailedSummary?.financialInfo.paymentMethod || ''}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: {
                      ...contractData.extractedInfo,
                      detailedSummary: {
                        ...contractData.extractedInfo.detailedSummary!,
                        financialInfo: {
                          ...contractData.extractedInfo.detailedSummary!.financialInfo,
                          paymentMethod: e.target.value
                        }
                      }
                    }
                  })}
                  placeholder="VD: Chuyển khoản"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">4. Mục đích hợp đồng</h3>
            <textarea
              value={contractData.extractedInfo.detailedSummary?.purpose || ''}
              onChange={(e) => setContractData({
                ...contractData,
                extractedInfo: {
                  ...contractData.extractedInfo,
                  detailedSummary: {
                    ...contractData.extractedInfo.detailedSummary!,
                    purpose: e.target.value
                  }
                }
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mô tả mục đích và nội dung chính của hợp đồng..."
            />
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">5. Tags</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {contractData.tags.map(tag => (
                <span
                  key={tag.id}
                  className={`px-3 py-1 text-sm font-medium rounded-full border cursor-pointer ${getTagColor(tag.color)}`}
                  onClick={() => setContractData({
                    ...contractData,
                    tags: contractData.tags.filter(t => t.id !== tag.id)
                  })}
                >
                  {tag.name} ×
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags
                .filter(tag => !contractData.tags.find(t => t.id === tag.id))
                .map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => setContractData({
                      ...contractData,
                      tags: [...contractData.tags, tag]
                    })}
                    className={`px-3 py-1 text-sm font-medium rounded-full border border-dashed hover:bg-opacity-50 ${getTagColor(tag.color)}`}
                  >
                    + {tag.name}
                  </button>
                ))}
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
              <span>Tạo hợp đồng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
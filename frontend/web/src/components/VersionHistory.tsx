import React, { useState } from 'react';
import { Clock, User, FileText, Eye, GitBranch } from 'lucide-react';
import { Contract, ContractVersion } from '../types/contract';

interface VersionHistoryProps {
  contract: Contract;
  onVersionSelect: (version: ContractVersion) => void;
  onCompareVersions: (v1: ContractVersion, v2: ContractVersion) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  contract,
  onVersionSelect,
  onCompareVersions
}) => {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const handleVersionCheck = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    }
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      const v1 = contract.versions.find(v => v.id === selectedVersions[0]);
      const v2 = contract.versions.find(v => v.id === selectedVersions[1]);
      if (v1 && v2) {
        onCompareVersions(v1, v2);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Lịch sử phiên bản</h3>
          </div>
          {selectedVersions.length === 2 && (
            <button
              onClick={handleCompare}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              So sánh phiên bản
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {contract.versions.map((version, index) => (
            <div
              key={version.id}
              className={`border rounded-lg p-4 ${
                version.version === contract.currentVersion
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedVersions.includes(version.id)}
                    onChange={() => handleVersionCheck(version.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        Phiên bản {version.version}
                      </span>
                      {version.version === contract.currentVersion && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Hiện tại
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{version.title}</p>
                    {version.changes && (
                      <p className="text-sm text-gray-500 mt-1">
                        Thay đổi: {version.changes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{version.createdBy}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(version.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onVersionSelect(version)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
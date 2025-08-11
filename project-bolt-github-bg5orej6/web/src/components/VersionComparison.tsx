import React from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { ContractVersion } from '../types/contract';

interface VersionComparisonProps {
  version1: ContractVersion;
  version2: ContractVersion;
  onClose: () => void;
}

export const VersionComparison: React.FC<VersionComparisonProps> = ({
  version1,
  version2,
  onClose
}) => {
  // Simulate diff calculation
  const getDiff = (text1: string, text2: string) => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    
    const diff = [];
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 !== line2) {
        if (line1 && !line2) {
          diff.push({ type: 'removed', content: line1, lineNumber: i + 1 });
        } else if (!line1 && line2) {
          diff.push({ type: 'added', content: line2, lineNumber: i + 1 });
        } else {
          diff.push({ type: 'modified', content1: line1, content2: line2, lineNumber: i + 1 });
        }
      } else if (line1) {
        diff.push({ type: 'unchanged', content: line1, lineNumber: i + 1 });
      }
    }
    return diff;
  };

  const diff = getDiff(version1.content, version2.content);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">So sánh phiên bản</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="text-center">
              <div className="font-medium text-gray-900">Phiên bản {version1.version}</div>
              <div className="text-sm text-gray-500">{new Date(version1.createdAt).toLocaleString('vi-VN')}</div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div className="text-center">
              <div className="font-medium text-gray-900">Phiên bản {version2.version}</div>
              <div className="text-sm text-gray-500">{new Date(version2.createdAt).toLocaleString('vi-VN')}</div>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-2">
            {diff.map((item, index) => (
              <div key={index} className="flex">
                <div className="w-12 text-xs text-gray-400 text-right pr-2 py-1">
                  {item.lineNumber}
                </div>
                <div className="flex-1">
                  {item.type === 'unchanged' && (
                    <div className="py-1 px-2 text-gray-700 font-mono text-sm">
                      {item.content}
                    </div>
                  )}
                  {item.type === 'removed' && (
                    <div className="py-1 px-2 bg-red-50 text-red-800 font-mono text-sm border-l-4 border-red-400">
                      - {item.content}
                    </div>
                  )}
                  {item.type === 'added' && (
                    <div className="py-1 px-2 bg-green-50 text-green-800 font-mono text-sm border-l-4 border-green-400">
                      + {item.content}
                    </div>
                  )}
                  {item.type === 'modified' && (
                    <div className="space-y-1">
                      <div className="py-1 px-2 bg-red-50 text-red-800 font-mono text-sm border-l-4 border-red-400">
                        - {item.content1}
                      </div>
                      <div className="py-1 px-2 bg-green-50 text-green-800 font-mono text-sm border-l-4 border-green-400">
                        + {item.content2}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-green-400"></div>
                <span className="text-gray-600">Thêm mới</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-red-400"></div>
                <span className="text-gray-600">Xóa bỏ</span>
              </div>
            </div>
            <div className="text-gray-500">
              {diff.filter(d => d.type !== 'unchanged').length} thay đổi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
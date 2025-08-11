import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ArrowLeft, Calendar, Filter, TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { Contract, DashboardStats, TimeFilter, RejectionReason } from '../types/contract';

interface TimeFilteredAnalyticsProps {
  stats: DashboardStats;
  contracts: Contract[];
  onBack: () => void;
  onContractClick: (contract: Contract) => void;
}

export const TimeFilteredAnalytics: React.FC<TimeFilteredAnalyticsProps> = ({
  stats,
  contracts,
  onBack,
  onContractClick
}) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>({
    period: '30days',
    groupBy: 'day'
  });
  const [selectedView, setSelectedView] = useState<'overview' | 'rejection-detail'>('overview');
  const [selectedRejectionReason, setSelectedRejectionReason] = useState<RejectionReason | null>(null);

  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    
    switch (timeFilter.period) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        startDate = timeFilter.startDate ? new Date(timeFilter.startDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const endDate = timeFilter.period === 'custom' && timeFilter.endDate ? new Date(timeFilter.endDate) : now;

    const filtered = contracts.filter(contract => {
      const contractDate = new Date(contract.uploadDate);
      return contractDate >= startDate && contractDate <= endDate;
    });

    // Group data by time period
    const groupedData: { [key: string]: { uploads: number; approvals: number; rejections: number; date: string } } = {};
    
    filtered.forEach(contract => {
      const contractDate = new Date(contract.uploadDate);
      let key: string;
      
      switch (timeFilter.groupBy) {
        case 'day':
          key = contractDate.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${contractDate.getFullYear()}-${String(contractDate.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'year':
          key = contractDate.getFullYear().toString();
          break;
        default:
          key = contractDate.toISOString().split('T')[0];
      }

      if (!groupedData[key]) {
        groupedData[key] = { uploads: 0, approvals: 0, rejections: 0, date: key };
      }

      groupedData[key].uploads++;
      if (contract.status === 'approved') groupedData[key].approvals++;
      if (contract.status === 'rejected') groupedData[key].rejections++;
    });

    const timeSeriesData = Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));

    // Calculate rejection reasons for filtered data
    const rejectionReasons: RejectionReason[] = [];
    const reasonMap: { [key: string]: string[] } = {};

    filtered.filter(c => c.status === 'rejected').forEach(contract => {
      const reason = contract.comments || 'Không có lý do cụ thể';
      if (!reasonMap[reason]) {
        reasonMap[reason] = [];
      }
      reasonMap[reason].push(contract.id);
    });

    Object.entries(reasonMap).forEach(([reason, contractIds]) => {
      rejectionReasons.push({
        id: reason.toLowerCase().replace(/\s+/g, '-'),
        reason,
        count: contractIds.length,
        contracts: contractIds
      });
    });

    return {
      contracts: filtered,
      timeSeriesData,
      rejectionReasons,
      stats: {
        totalContracts: filtered.length,
        pendingApproval: filtered.filter(c => c.status === 'pending').length,
        approved: filtered.filter(c => c.status === 'approved').length,
        rejected: filtered.filter(c => c.status === 'rejected').length,
        approvalRate: filtered.length > 0 ? Math.round((filtered.filter(c => c.status === 'approved').length / filtered.length) * 100) : 0
      }
    };
  }, [contracts, timeFilter]);

  const handleRejectionReasonClick = (reason: RejectionReason) => {
    setSelectedRejectionReason(reason);
    setSelectedView('rejection-detail');
  };

  const renderRejectionDetail = () => {
    if (!selectedRejectionReason) return null;

    const rejectedContracts = contracts.filter(c => 
      selectedRejectionReason.contracts.includes(c.id)
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedView('overview')}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            Hợp đồng bị từ chối: "{selectedRejectionReason.reason}"
          </h2>
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            {selectedRejectionReason.count} hợp đồng
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="space-y-4">
              {rejectedContracts.map(contract => (
                <div
                  key={contract.id}
                  onClick={() => onContractClick(contract)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{contract.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{contract.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span>Tải lên: {new Date(contract.uploadDate).toLocaleDateString('vi-VN')}</span>
                        {contract.reviewDate && (
                          <span>Từ chối: {new Date(contract.reviewDate).toLocaleDateString('vi-VN')}</span>
                        )}
                        {contract.reviewer && <span>Bởi: {contract.reviewer}</span>}
                      </div>
                      {contract.comments && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          <strong>Lý do:</strong> {contract.comments}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (selectedView === 'rejection-detail') {
    return renderRejectionDetail();
  }

  return (
    <div className="space-y-6">
      {/* Time Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-700">Khoảng thời gian:</span>
          </div>
          
          <select
            value={timeFilter.period}
            onChange={(e) => setTimeFilter({ ...timeFilter, period: e.target.value as any })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="90days">90 ngày qua</option>
            <option value="1year">1 năm qua</option>
            <option value="custom">Tùy chọn</option>
          </select>

          {timeFilter.period === 'custom' && (
            <>
              <input
                type="date"
                value={timeFilter.startDate || ''}
                onChange={(e) => setTimeFilter({ ...timeFilter, startDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500">đến</span>
              <input
                type="date"
                value={timeFilter.endDate || ''}
                onChange={(e) => setTimeFilter({ ...timeFilter, endDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </>
          )}

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Nhóm theo:</span>
            <select
              value={timeFilter.groupBy}
              onChange={(e) => setTimeFilter({ ...timeFilter, groupBy: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="day">Ngày</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng hợp đồng</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredData.stats.totalContracts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredData.stats.pendingApproval}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredData.stats.approved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tỷ lệ phê duyệt</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredData.stats.approvalRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng theo thời gian</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredData.timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => {
                const date = new Date(value);
                switch (timeFilter.groupBy) {
                  case 'day':
                    return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
                  case 'month':
                    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short' });
                  case 'year':
                    return date.getFullYear().toString();
                  default:
                    return value;
                }
              }}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('vi-VN');
              }}
            />
            <Line type="monotone" dataKey="uploads" stroke="#3B82F6" strokeWidth={2} name="Tải lên" />
            <Line type="monotone" dataKey="approvals" stroke="#10B981" strokeWidth={2} name="Phê duyệt" />
            <Line type="monotone" dataKey="rejections" stroke="#EF4444" strokeWidth={2} name="Từ chối" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Rejection Reasons */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Lý do từ chối (Nhấp để xem chi tiết)
        </h3>
        {filteredData.rejectionReasons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Không có hợp đồng nào bị từ chối trong khoảng thời gian này</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.rejectionReasons.map(reason => (
              <div
                key={reason.id}
                onClick={() => handleRejectionReasonClick(reason)}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 cursor-pointer transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{reason.reason}</h4>
                  <p className="text-sm text-gray-500 mt-1">{reason.count} hợp đồng bị từ chối</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    {reason.count}
                  </span>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
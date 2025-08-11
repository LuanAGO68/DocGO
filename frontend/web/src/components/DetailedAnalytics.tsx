import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ArrowLeft, FileText, Calendar, User, TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Contract, DashboardStats } from '../types/contract';

interface DetailedAnalyticsProps {
  stats: DashboardStats;
  contracts: Contract[];
  onBack: () => void;
  onContractClick: (contract: Contract) => void;
}

export const DetailedAnalytics: React.FC<DetailedAnalyticsProps> = ({
  stats,
  contracts,
  onBack,
  onContractClick
}) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'pending' | 'approved' | 'rejected' | 'expiring' | 'monthly'>('overview');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const getContractsByStatus = (status: string) => {
    return contracts.filter(c => c.status === status);
  };

  const getContractsByMonth = (month: number) => {
    return contracts.filter(c => {
      const uploadMonth = new Date(c.uploadDate).getMonth();
      return uploadMonth === month;
    });
  };

  const getExpiringContracts = () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return contracts.filter(c => {
      if (!c.expiryDate) return false;
      const expiryDate = new Date(c.expiryDate);
      return expiryDate >= now && expiryDate <= thirtyDaysFromNow;
    });
  };

  const renderContractList = (contractList: Contract[], title: string) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        {contractList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Không có hợp đồng nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contractList.map(contract => (
              <div
                key={contract.id}
                onClick={() => onContractClick(contract)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{contract.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{contract.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Tải lên: {new Date(contract.uploadDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      {contract.expiryDate && (
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Hết hạn: {new Date(contract.expiryDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      )}
                      {contract.reviewer && (
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>Duyệt bởi: {contract.reviewer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      contract.status === 'approved' ? 'bg-green-100 text-green-800' :
                      contract.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      contract.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contract.status === 'approved' ? 'Đã duyệt' :
                       contract.status === 'pending' ? 'Chờ duyệt' :
                       contract.status === 'rejected' ? 'Từ chối' : 'Nháp'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const monthlyData = stats.monthlyUploads.map((count, index) => ({
    month: `Tháng ${index + 1}`,
    uploads: count,
    monthIndex: index
  }));

  const statusData = [
    { name: 'Đã duyệt', value: stats.approved, color: '#10B981', status: 'approved' },
    { name: 'Chờ duyệt', value: stats.pendingApproval, color: '#F59E0B', status: 'pending' },
    { name: 'Từ chối', value: stats.rejected, color: '#EF4444', status: 'rejected' },
  ];

  const handleChartClick = (data: any, type: string) => {
    if (type === 'status') {
      setSelectedView(data.status);
    } else if (type === 'monthly') {
      setSelectedMonth(data.monthIndex);
      setSelectedView('monthly');
    } else if (type === 'expiring') {
      setSelectedView('expiring');
    }
  };

  const renderDetailView = () => {
    switch (selectedView) {
      case 'pending':
        return renderContractList(getContractsByStatus('pending'), 'Hợp đồng chờ duyệt');
      case 'approved':
        return renderContractList(getContractsByStatus('approved'), 'Hợp đồng đã duyệt');
      case 'rejected':
        return renderContractList(getContractsByStatus('rejected'), 'Hợp đồng bị từ chối');
      case 'expiring':
        return renderContractList(getExpiringContracts(), 'Hợp đồng sắp hết hạn');
      case 'monthly':
        if (selectedMonth !== null) {
          return renderContractList(
            getContractsByMonth(selectedMonth), 
            `Hợp đồng tháng ${selectedMonth + 1}`
          );
        }
        return null;
      default:
        return null;
    }
  };

  if (selectedView !== 'overview') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setSelectedView('overview');
              setSelectedMonth(null);
            }}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại tổng quan</span>
          </button>
        </div>
        {renderDetailView()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => setSelectedView('pending')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingApproval}</p>
              <p className="text-sm text-amber-600 mt-2">Nhấp để xem chi tiết</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => setSelectedView('approved')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
              <p className="text-sm text-green-600 mt-2">Nhấp để xem chi tiết</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => setSelectedView('rejected')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Từ chối</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
              <p className="text-sm text-red-600 mt-2">Nhấp để xem chi tiết</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => setSelectedView('expiring')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sắp hết hạn</p>
              <p className="text-2xl font-semibold text-gray-900">{getExpiringContracts().length}</p>
              <p className="text-sm text-orange-600 mt-2">Nhấp để xem chi tiết</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Uploads Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hợp đồng tải lên theo tháng
            <span className="text-sm font-normal text-gray-500 ml-2">(Nhấp vào cột để xem chi tiết)</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="uploads" 
                fill="#3B82F6" 
                cursor="pointer"
                onClick={(data) => handleChartClick(data, 'monthly')}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Phân bố trạng thái
            <span className="text-sm font-normal text-gray-500 ml-2">(Nhấp vào phần để xem chi tiết)</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onClick={(data) => handleChartClick(data, 'status')}
                cursor="pointer"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rejection Reasons */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lý do từ chối phổ biến</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.rejectionReasons}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="reason" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
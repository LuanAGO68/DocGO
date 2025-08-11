import React, { useState } from 'react';
import { Bell, Calendar, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Contract, ContractReminder } from '../types/contract';

interface ContractRemindersProps {
  contract: Contract;
  onAddReminder: (reminder: Omit<ContractReminder, 'id'>) => void;
  onDeleteReminder: (reminderId: string) => void;
}

export const ContractReminders: React.FC<ContractRemindersProps> = ({
  contract,
  onAddReminder,
  onDeleteReminder
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    type: 'expiry' as 'expiry' | 'renewal' | 'review',
    reminderDate: '',
    message: ''
  });

  const handleAddReminder = () => {
    if (newReminder.reminderDate && newReminder.message) {
      onAddReminder({
        contractId: contract.id,
        type: newReminder.type,
        reminderDate: newReminder.reminderDate,
        message: newReminder.message,
        isActive: true
      });
      setNewReminder({ type: 'expiry', reminderDate: '', message: '' });
      setShowAddForm(false);
    }
  };

  const getReminderTypeText = (type: string) => {
    switch (type) {
      case 'expiry': return 'Hết hạn';
      case 'renewal': return 'Gia hạn';
      case 'review': return 'Xem xét';
      default: return type;
    }
  };

  const getReminderTypeColor = (type: string) => {
    switch (type) {
      case 'expiry': return 'bg-red-100 text-red-800';
      case 'renewal': return 'bg-amber-100 text-amber-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isReminderDue = (reminderDate: string) => {
    return new Date(reminderDate) <= new Date();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">Nhắc nhở</h3>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm nhắc nhở</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {showAddForm && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-4">Thêm nhắc nhở mới</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại nhắc nhở
                </label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="expiry">Hết hạn</option>
                  <option value="renewal">Gia hạn</option>
                  <option value="review">Xem xét</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày nhắc nhở
                </label>
                <input
                  type="datetime-local"
                  value={newReminder.reminderDate}
                  onChange={(e) => setNewReminder({ ...newReminder, reminderDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung nhắc nhở
                </label>
                <textarea
                  value={newReminder.message}
                  onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập nội dung nhắc nhở..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleAddReminder}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {contract.reminders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Chưa có nhắc nhở nào</p>
            </div>
          ) : (
            contract.reminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`p-4 border rounded-lg ${
                  isReminderDue(reminder.reminderDate) 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getReminderTypeColor(reminder.type)}`}>
                        {getReminderTypeText(reminder.type)}
                      </span>
                      {isReminderDue(reminder.reminderDate) && (
                        <div className="flex items-center space-x-1 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs font-medium">Đến hạn</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-900 mb-2">{reminder.message}</p>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(reminder.reminderDate).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteReminder(reminder.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
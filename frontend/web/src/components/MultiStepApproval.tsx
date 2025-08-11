import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, User, ArrowRight } from 'lucide-react';
import { ApprovalStep } from '../types/contract';

interface MultiStepApprovalProps {
  steps: ApprovalStep[];
  currentStep: number;
  onApprove: (stepId: string, comments?: string) => void;
  onReject: (stepId: string, reason: string) => void;
  canApprove: boolean;
}

export const MultiStepApproval: React.FC<MultiStepApprovalProps> = ({
  steps,
  currentStep,
  onApprove,
  onReject,
  canApprove
}) => {
  const [showCommentForm, setShowCommentForm] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (stepId: string) => {
    onApprove(stepId, comments || undefined);
    setComments('');
    setShowCommentForm(null);
  };

  const handleReject = (stepId: string) => {
    if (rejectReason.trim()) {
      onReject(stepId, rejectReason);
      setRejectReason('');
      setShowCommentForm(null);
    }
  };

  const getStepStatus = (step: ApprovalStep, index: number) => {
    if (step.status === 'approved') return 'approved';
    if (step.status === 'rejected') return 'rejected';
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'current':
        return <Clock className="w-6 h-6 text-amber-500" />;
      default:
        return <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'rejected':
        return 'border-red-500 bg-red-50';
      case 'current':
        return 'border-amber-500 bg-amber-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Luồng phê duyệt</h3>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {steps.map((step, index) => {
            const status = getStepStatus(step, index);
            const isCurrentStep = index === currentStep && step.status === 'pending';
            
            return (
              <div key={step.id} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute left-3 top-12 w-0.5 h-16 bg-gray-200"></div>
                )}
                
                <div className={`border-2 rounded-lg p-4 ${getStatusColor(status)}`}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Bước {step.stepNumber}: {step.approverRole}
                          </h4>
                          {step.approverName && (
                            <p className="text-sm text-gray-600 mt-1">
                              Người duyệt: {step.approverName}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          {step.status === 'approved' && step.approvedAt && (
                            <div className="text-sm text-green-600">
                              Đã duyệt {new Date(step.approvedAt).toLocaleDateString('vi-VN')}
                            </div>
                          )}
                          {step.status === 'rejected' && step.approvedAt && (
                            <div className="text-sm text-red-600">
                              Từ chối {new Date(step.approvedAt).toLocaleDateString('vi-VN')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {step.comments && (
                        <div className="mt-3 p-3 bg-white rounded border">
                          <p className="text-sm text-gray-700">{step.comments}</p>
                        </div>
                      )}
                      
                      {isCurrentStep && canApprove && (
                        <div className="mt-4">
                          {showCommentForm === step.id ? (
                            <div className="space-y-3">
                              <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhận xét (tùy chọn)..."
                              />
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => handleApprove(step.id)}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  Phê duyệt
                                </button>
                                <button
                                  onClick={() => setShowCommentForm(null)}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  Hủy
                                </button>
                              </div>
                              
                              <div className="border-t pt-3">
                                <textarea
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                  placeholder="Lý do từ chối..."
                                />
                                <button
                                  onClick={() => handleReject(step.id)}
                                  disabled={!rejectReason.trim()}
                                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                  Từ chối
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowCommentForm(step.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Xem xét phê duyệt
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
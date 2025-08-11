import React, { useState } from 'react';
import { Shield } from "lucide-react";
import { Plus } from 'lucide-react';
import Select from 'react-select';
import { FileText, Upload, CheckCircle, XCircle, Clock, Eye, User, Calendar, Search, Filter, Tag, Bell, MessageCircle, GitBranch, BarChart3, Download, LogOut, Users, Edit3 } from 'lucide-react';
import { Contract, ContractVersion, ContractComment, ContractTag, ApprovalStep, ContractReminder, ESignatureRequest, DashboardStats } from './types/contract';
import { User as UserType, AuthState, LoginCredentials, RegisterData, TimeFilter } from './types/user';
import { VersionHistory } from './components/VersionHistory';
import { VersionComparison } from './components/VersionComparison';
import { ContractUpload } from './components/ContractUpload';
import { ApprovalWorkflowModal } from './components/ApprovalWorkflowModal';
import { ContractDetailView } from './components/ContractDetailView';
import { ESignaturePanel } from './components/ESignaturePanel';
import { ContractReminders } from './components/ContractReminders';
import { AdvancedDashboard } from './components/AdvancedDashboard';
import { ContractComments } from './components/ContractComments';
import { MultiStepApproval } from './components/MultiStepApproval';
import { AuthModal } from './components/AuthModal';
import { UserManagement } from './components/UserManagement';
import { ContractEditor } from './components/ContractEditor';
import { HelpCircle } from 'lucide-react';
import { DetailedAnalytics } from './components/DetailedAnalytics';
import { HelpGuide } from './components/HelpGuide';
import { UserApprovalPanel } from './components/UserApprovalPanel';
import { ManualContractCreator } from './components/ManualContractCreator';
import { TimeFilteredAnalytics } from './components/TimeFilteredAnalytics';


function App() {
  // Authentication state
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });
  const [showAuthModal, setShowAuthModal] = useState(true);

  const [showEditor, setShowEditor] = useState(false);

  // Users data
  const [users, setUsers] = useState<UserType[]>([
    {
      id: '1',
      email: 'admin@company.com',
      name: 'Quản trị viên',
      role: 'admin',
      department: 'IT',
      position: 'System Administrator',
      isActive: true,
      isApproved: true,
      createdAt: '2024-01-01',
      approvalLevel: 4,
      maxContractValue: 999999999999,
      permissions: {
        canUpload: true,
        canApprove: true,
        canManageUsers: true,
        canViewAnalytics: true,
        canSign: true,
        canApproveUsers: true
      }
    },
    {
      id: '2',
      email: 'director@company.com',
      name: 'Giám đốc',
      role: 'director',
      department: 'Management',
      position: 'Director',
      isActive: true,
      isApproved: true,
      createdAt: '2024-01-01',
      approvalLevel: 3,
      maxContractValue: 10000000000, // 10 tỷ
      permissions: {
        canUpload: true,
        canApprove: true,
        canManageUsers: false,
        canViewAnalytics: true,
        canSign: true,
        canApproveUsers: true
      }
    },
    {
      id: '3',
      email: 'manager@company.com',
      name: 'Trưởng phòng',
      role: 'manager',
      department: 'HR',
      position: 'HR Manager',
      isActive: true,
      isApproved: true,
      createdAt: '2024-01-01',
      approvalLevel: 2,
      maxContractValue: 1000000000, // 1 tỷ
      permissions: {
        canUpload: true,
        canApprove: true,
        canManageUsers: false,
        canViewAnalytics: true,
        canSign: true,
        canApproveUsers: false
      }
    },
    {
      id: '4',
      email: 'finance@company.com',
      name: 'Trưởng phòng Tài chính',
      role: 'finance',
      department: 'Finance',
      position: 'Finance Manager',
      isActive: true,
      isApproved: true,
      createdAt: '2024-01-01',
      approvalLevel: 2,
      maxContractValue: 5000000000, // 5 tỷ
      permissions: {
        canUpload: true,
        canApprove: true,
        canManageUsers: false,
        canViewAnalytics: true,
        canSign: true,
        canApproveUsers: false
      }
    },
    {
      id: '5',
      email: 'employee@company.com',
      name: 'Nhân viên',
      role: 'employee',
      department: 'Operations',
      position: 'Staff',
      isActive: true,
      isApproved: true,
      createdAt: '2024-01-01',
      approvalLevel: 1,
      maxContractValue: 0,
      permissions: {
        canUpload: true,
        canApprove: false,
        canManageUsers: false,
        canViewAnalytics: false,
        canSign: false,
        canApproveUsers: false
      }
    },
    {
      id: '6',
      email: 'legal@company.com',
      name: 'Pháp chế',
      role: 'legal',
      department: 'Legal',
      position: 'Legal Counsel',
      isActive: true,
      isApproved: true,
      createdAt: '2024-01-01',
      approvalLevel: 2,
      maxContractValue: 2000000000, // 2 tỷ
      permissions: {
        canUpload: true,
        canApprove: true,
        canManageUsers: false,
        canViewAnalytics: true,
        canSign: true,
        canApproveUsers: false
      }
    }
  ]);
  const [availableTags] = useState<ContractTag[]>([
    { id: '1', name: 'Mua sắm', color: 'blue', category: 'Loại' },
    { id: '2', name: 'Thiết bị', color: 'green', category: 'Danh mục' },
    { id: '3', name: 'Dịch vụ', color: 'purple', category: 'Loại' },
    { id: '4', name: 'IT', color: 'indigo', category: 'Danh mục' },
    { id: '5', name: 'Nội bộ', color: 'gray', category: 'Phạm vi' },
    { id: '6', name: 'Đối tác A', color: 'red', category: 'Đối tác' }
  ]);

  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: '1',
      title: 'Hợp đồng cung cấp dịch vụ IT',
      description: 'Hợp đồng cung cấp dịch vụ phát triển phần mềm cho công ty ABC',
      contractCategory: 'commercial',
      status: 'approved',
      uploadDate: '2024-01-15',
      reviewDate: '2024-01-20',
      expiryDate: '2024-07-15',
      tags: [
        { id: '1', name: 'Mua sắm', color: 'blue', category: 'Loại' },
        { id: '2', name: 'Thiết bị', color: 'green', category: 'Danh mục' }
      ],
      versions: [
        {
          id: 'v1',
          version: 1,
          title: 'Phiên bản ban đầu',
          content: 'Nội dung hợp đồng mua bán thiết bị văn phòng...',
          changes: 'Tạo mới',
          createdAt: '2024-01-15T09:00:00',
          createdBy: 'Nguyễn Văn A'
        }
      ],
      currentVersion: 1,
      approvalSteps: [
        {
          id: 'step1',
          stepNumber: 1,
          approverRole: 'Trưởng phòng Nhân sự',
          status: 'approved',
          approvedAt: '2024-01-16',
          approverName: 'Trần Thị B',
          comments: 'Hợp đồng phù hợp với quy định'
        },
        {
          id: 'step2',
          stepNumber: 2,
          approverRole: 'Phòng Pháp chế',
          status: 'pending'
        }
      ],
      currentStep: 1,
      reminders: [
        {
          id: 'r1',
          contractId: '1',
          type: 'expiry',
          reminderDate: '2024-07-01T09:00:00',
          message: 'Hợp đồng sắp hết hạn, cần xem xét gia hạn',
          isActive: true
        }
      ],
      extractedInfo: {
        contractType: 'Dịch vụ IT',
        parties: ['Công ty TNHH ABC', 'Công ty Phần mềm XYZ'],
        value: '500.000.000 VND',
        numericValue: 500000000,
        duration: '12 tháng',
        summary: 'Hợp đồng cung cấp dịch vụ phát triển ứng dụng web và mobile cho công ty ABC trong thời gian 12 tháng.',
        detailedSummary: {
          generalInfo: {
            contractName: 'Hợp đồng cung cấp dịch vụ IT',
            contractNumber: 'HD-IT-2024-001',
            signDate: '2024-01-15',
            effectiveDate: '2024-01-15',
            expiryDate: '2025-01-15',
            parties: [
              {
                name: 'Công ty TNHH ABC',
                address: '123 Đường ABC, Quận 1, TP.HCM',
                representative: 'Nguyễn Văn A',
                role: 'A',
                taxCode: '0123456789'
              },
              {
                name: 'Công ty Phần mềm XYZ',
                address: '456 Đường XYZ, Quận 3, TP.HCM',
                representative: 'Trần Thị B',
                role: 'B',
                taxCode: '0987654321'
              }
            ]
          },
          purpose: 'Cung cấp dịch vụ phát triển ứng dụng web và mobile theo yêu cầu của khách hàng',
          workScope: {
            description: 'Phát triển ứng dụng web quản lý bán hàng và ứng dụng mobile tương ứng',
            technicalRequirements: 'ReactJS, Node.js, MongoDB, React Native',
            qualityRequirements: 'Đảm bảo 99% uptime, tốc độ tải trang < 3s',
            milestones: [
              {
                name: 'Hoàn thành thiết kế UI/UX',
                deadline: '2024-03-15',
                deliverables: 'File thiết kế Figma và prototype'
              },
              {
                name: 'Hoàn thành phát triển web app',
                deadline: '2024-06-15',
                deliverables: 'Ứng dụng web hoàn chỉnh'
              }
            ]
          },
          financialInfo: {
            totalValue: '500.000.000 VND',
            paymentMethod: 'Chuyển khoản',
            paymentSchedule: 'Thanh toán theo từng milestone',
            currency: 'VND',
            paymentTerms: 'Thanh toán trong vòng 15 ngày sau khi nghiệm thu'
          },
          deliveryAndAcceptance: {
            deliveryDate: '2024-12-15',
            acceptanceCriteria: 'Ứng dụng hoạt động đúng yêu cầu, không có lỗi nghiêm trọng',
            acceptanceProcess: 'Khách hàng test trong 7 ngày, ký biên bản nghiệm thu'
          },
          timeline: {
            duration: '12 tháng',
            milestones: ['Thiết kế - 3 tháng', 'Phát triển - 6 tháng', 'Test & Deploy - 3 tháng'],
            terminationConditions: 'Vi phạm nghiêm trọng hợp đồng'
          },
          obligations: {
            partyA: ['Cung cấp yêu cầu chi tiết', 'Thanh toán đúng hạn', 'Hỗ trợ test'],
            partyB: ['Phát triển đúng yêu cầu', 'Bảo hành 12 tháng', 'Đào tạo sử dụng'],
            penalties: [
              {
                violation: 'Chậm tiến độ',
                penalty: '1% giá trị hợp đồng/ngày'
              }
            ]
          },
          warranties: {
            warranty: 'Bảo hành 12 tháng',
            confidentiality: 'Bảo mật thông tin khách hàng',
            penalties: 'Phạt 10% giá trị hợp đồng nếu vi phạm'
          },
          disputeResolution: {
            jurisdiction: 'Tòa án Nhân dân TP.HCM',
            venue: 'TP.HCM',
            arbitration: 'Trung tâm Trọng tài Quốc tế Việt Nam',
            negotiationFirst: true
          },
          signatures: {
            partyASignature: {
              name: 'Nguyễn Văn A',
              position: 'Giám đốc',
              date: '2024-01-15'
            },
            partyBSignature: {
              name: 'Trần Thị B',
              position: 'Giám đốc',
              date: '2024-01-15'
            }
          },
          keyHighlights: [
            'Hợp đồng có giá trị cao 500 triệu VND cần được giám sát chặt chẽ',
            'Yêu cầu bảo hành 12 tháng sau khi nghiệm thu',
            'Phạt 1% giá trị hợp đồng mỗi ngày chậm tiến độ',
            'Bảo mật thông tin khách hàng là ưu tiên hàng đầu'
          ]
        },
        fullText: 'Nội dung đầy đủ của hợp đồng...'
      }
    },
    {
      id: '2',
      title: 'Hợp đồng thuê văn phòng',
      description: 'Hợp đồng thuê không gian văn phòng tại tòa nhà DEF',
      contractCategory: 'internal',
      status: 'pending',
      uploadDate: '2024-01-20',
      tags: [availableTags[1], availableTags[3]],
      versions: [
        {
          id: 'v2',
          version: 1,
          title: 'Phiên bản ban đầu',
          content: 'Nội dung hợp đồng dịch vụ bảo trì...',
          changes: 'Tạo mới',
          createdAt: '2024-01-10T10:00:00',
          createdBy: 'Lê Văn C'
        }
      ],
      currentVersion: 1,
      approvalSteps: [
        {
          id: 'step3',
          stepNumber: 1,
          approverRole: 'Trưởng phòng IT',
          status: 'approved',
          approvedAt: '2024-01-12',
          approverName: 'Nguyễn Văn A',
          comments: 'Hợp đồng đã được duyệt'
        }
      ],
      currentStep: 0,
      reminders: [],
      extractedInfo: {
        contractType: 'Thuê văn phòng',
        parties: ['Công ty TNHH ABC', 'Công ty Bất động sản DEF'],
        value: '120.000.000 VND',
        numericValue: 120000000,
        duration: '24 tháng',
        summary: 'Hợp đồng thuê văn phòng diện tích 200m2 tại tầng 5 tòa nhà DEF.',
        fullText: 'Nội dung đầy đủ của hợp đồng thuê văn phòng...'
      }
    },
    {
      id: '3',
      title: 'Hợp đồng mua sắm thiết bị',
      description: 'Hợp đồng mua sắm máy tính và thiết bị văn phòng',
      contractCategory: 'commercial',
      status: 'rejected',
      uploadDate: '2024-01-25',
      reviewDate: '2024-01-28',
      reviewer: 'Phạm Văn D',
      comments: 'Giá cả chưa hợp lý, cần thương lượng lại',
      tags: [availableTags[0], availableTags[2]],
      versions: [
        {
          id: 'v3',
          version: 1,
          title: 'Phiên bản ban đầu',
          content: 'Nội dung hợp đồng mua sắm...',
          changes: 'Tạo mới',
          createdAt: '2024-01-25T08:00:00',
          createdBy: 'Hoàng Thị E'
        }
      ],
      currentVersion: 1,
      approvalSteps: [],
      currentStep: 0,
      reminders: [],
      extractedInfo: {
        contractType: 'Mua sắm',
        parties: ['Công ty TNHH ABC', 'Công ty Thiết bị GHI'],
        value: '80.000.000 VND',
        numericValue: 80000000,
        duration: '1 tháng',
        summary: 'Hợp đồng mua 50 máy tính và các thiết bị văn phòng khác.',
        fullText: 'Nội dung đầy đủ của hợp đồng mua sắm...'
      }
    }
  ]);

  const [comments, setComments] = useState<ContractComment[]>([
    {
      id: 'c1',
      contractId: '1',
      userId: 'user1',
      userName: 'Trần Thị B',
      content: 'Cần xem xét lại điều khoản thanh toán',
      highlightedText: 'thanh toán trong vòng 30 ngày',
      createdAt: '2024-01-16T14:30:00',
      isResolved: false
    }
  ]);

  const tagOptions = [
  { value: '', label: 'Tất cả tags' },
  ...availableTags.map(tag => ({
    value: tag.id,
    label: tag.name,
  }))
];
function handleTagChange(selectedOptions) {
  const selectedValues = selectedOptions.map(option => option.value);
  if (selectedValues.includes('')) {
    setFilterTags([]); // Hiển thị tất cả
  } else {
    setFilterTags(selectedValues);
  }
}

  const [dashboardStats] = useState<DashboardStats>({
    totalContracts: contracts.length,
    pendingApproval: contracts.filter(c => c.status === 'pending').length,
    approved: contracts.filter(c => c.status === 'approved').length,
    rejected: contracts.filter(c => c.status === 'rejected').length,
    expiringSoon: 3,
    averageProcessingTime: 5,
    approvalRate: 85,
    monthlyUploads: [12, 15, 8, 22, 18, 25, 20, 16, 19, 23, 21, 18],
    rejectionReasons: [
      { reason: 'Thiếu thông tin', count: 8 },
      { reason: 'Không đúng quy định', count: 5 },
      { reason: 'Cần bổ sung tài liệu', count: 3 },
      { reason: 'Giá trị vượt thẩm quyền', count: 2 }
    ]
  });

  const [activeView, setActiveView] = useState<'dashboard' | 'upload' | 'contracts' | 'approved' | 'analytics' | 'users' | 'help'>('dashboard');
  const [showManualCreator, setShowManualCreator] = useState(false);
  const [showUserApproval, setShowUserApproval] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showVersionComparison, setShowVersionComparison] = useState<{ v1: ContractVersion; v2: ContractVersion } | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState<Contract | null>(null);
  const [showDetailView, setShowDetailView] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [fullTextSearch, setFullTextSearch] = useState('');

  // Authentication functions
  const handleLogin = (credentials: LoginCredentials) => {
    const user = users.find(u => u.email === credentials.email && u.isActive && u.isApproved);
    if (user) {
      setAuthState({
        isAuthenticated: true,
        user,
        token: 'mock-jwt-token'
      });
      setShowAuthModal(false);
    } else {
      const foundUser = users.find(u => u.email === credentials.email);
      if (foundUser && !foundUser.isApproved) {
        alert('Tài khoản của bạn chưa được phê duyệt. Vui lòng liên hệ quản trị viên!');
      } else if (foundUser && !foundUser.isActive) {
        alert('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!');
      } else {
        alert('Email hoặc mật khẩu không đúng!');
      }
    }
  };

  const handleRegister = (data: RegisterData) => {
    const newUser: UserType = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'employee',
      department: data.department,
      position: data.position,
      isActive: true,
      isApproved: false, // Cần phê duyệt
      createdAt: new Date().toISOString(),
      approvalLevel: 1,
      maxContractValue: 0,
      permissions: {
        canUpload: true,
        canApprove: false,
        canManageUsers: false,
        canViewAnalytics: false,
        canSign: false,
        canApproveUsers: false
      }
    };
    setUsers([...users, newUser]);
    alert('Đăng ký thành công! Tài khoản của bạn đang chờ phê duyệt từ quản trị viên.');
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null
    });
    setShowAuthModal(true);
    setActiveView('dashboard');
  };

  // User management functions
  const handleAddUser = (userData: Omit<UserType, 'id' | 'createdAt' | 'isActive'>) => {
    const newUser: UserType = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isActive: true,
      isApproved: true // Admin tạo thì tự động phê duyệt
    };
    setUsers([...users, newUser]);
  };

  const handleUpdateUser = (userId: string, userData: Partial<UserType>) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...userData } : u));
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleApproveUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isApproved: true } : u));
  };

  const handleRejectUser = (userId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn từ chối tài khoản này?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  // Contract version management
  const createNewVersion = (contractId: string, changes: string, content?: string) => {
    setContracts(contracts.map(c => {
      if (c.id === contractId) {
        const newVersion: ContractVersion = {
          id: `v${c.versions.length + 1}`,
          version: c.versions.length + 1,
          title: `Phiên bản ${c.versions.length + 1}`,
          content: content || c.extractedInfo?.fullText || '',
          changes,
          createdAt: new Date().toISOString(),
          createdBy: authState.user?.name || 'Current User'
        };
        return {
          ...c,
          versions: [...c.versions, newVersion],
          currentVersion: newVersion.version
        };
      }
      return c;
    }));
  };

  // Auto-generate approval steps based on contract value
  const generateApprovalSteps = (contractValue: number): ApprovalStep[] => {
    const steps: ApprovalStep[] = [];
    let stepNumber = 1;

    // Luôn cần manager phê duyệt trước
    if (contractValue > 0) {
      steps.push({
        id: `step${stepNumber}`,
        stepNumber: stepNumber++,
        approverRole: 'Trưởng phòng',
        approverLevel: 2,
        requiredValue: 0,
        status: 'pending'
      });
    }

    // Nếu > 1 tỷ cần giám đốc
    if (contractValue > 1000000000) {
      steps.push({
        id: `step${stepNumber}`,
        stepNumber: stepNumber++,
        approverRole: 'Giám đốc',
        approverLevel: 3,
        requiredValue: 1000000000,
        status: 'pending'
      });
    }

    // Nếu > 10 tỷ cần admin
    if (contractValue > 10000000000) {
      steps.push({
        id: `step${stepNumber}`,
        stepNumber: stepNumber++,
        approverRole: 'Quản trị viên',
        approverLevel: 4,
        requiredValue: 10000000000,
        status: 'pending'
      });
    }

    // Luôn cần pháp chế kiểm tra cuối
    steps.push({
      id: `step${stepNumber}`,
      stepNumber: stepNumber++,
      approverRole: 'Pháp chế',
      approverLevel: 2,
      status: 'pending'
    });

    return steps;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Nháp';
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const getStatusCount = (status: string) => {
    return contracts.filter(c => c.status === status).length;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate OCR processing
      const estimatedValue = Math.floor(Math.random() * 2000000000) + 100000000; // Random value for demo
      const newContract: Contract = {
        id: Date.now().toString(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: 'Hợp đồng được tải lên và xử lý tự động',
        status: 'draft',
        uploadDate: new Date().toISOString().split('T')[0],
        file: file,
        tags: [],
        versions: [
          {
            id: 'v1',
            version: 1,
            title: 'Phiên bản ban đầu',
            content: 'Nội dung hợp đồng đang được xử lý...',
            changes: 'Tạo mới',
            createdAt: new Date().toISOString(),
            createdBy: authState.user?.name || 'Current User'
          }
        ],
        currentVersion: 1,
        approvalSteps: generateApprovalSteps(estimatedValue),
        currentStep: 0,
        reminders: [],
        extractedInfo: {
          contractType: 'Được trích xuất tự động',
          parties: ['Đang xử lý OCR...'],
          value: 'Đang phân tích...',
          numericValue: estimatedValue,
          duration: 'Đang phân tích...',
          summary: 'Hệ thống đang xử lý OCR để trích xuất thông tin từ hợp đồng. Vui lòng kiểm tra và chỉnh sửa thông tin nếu cần.',
          fullText: 'Nội dung đầy đủ đang được xử lý...'
        }
      };
      setContracts([...contracts, newContract]);
      setActiveView('contracts');
    }
  };

  const handleUpload = (file: File) => {
    // Simulate file upload and OCR processing
    console.log('Uploading file:', file.name);
  };

  const handleContractUpload = (file: File, isBasedOnExisting: boolean, parentContractId?: string) => {
    // Create new contract
    const newContract: Contract = {
      id: Date.now().toString(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: 'Hợp đồng được tải lên từ file',
      contractCategory: 'commercial',
      status: 'draft',
      uploadDate: new Date().toISOString(),
      tags: [],
      versions: [{
        id: '1',
        version: 1,
        title: file.name.replace(/\.[^/.]+$/, ""),
        content: 'Nội dung sẽ được trích xuất từ OCR...',
        changes: 'Phiên bản đầu tiên',
        createdAt: new Date().toISOString(),
        createdBy: authState.user?.name || 'Unknown'
      }],
      currentVersion: 1,
      approvalSteps: [],
      currentStep: 0,
      reminders: [],
      isBasedOnExisting,
      parentContractId,
      extractedInfo: {
        contractType: 'Đang xử lý...',
        parties: [],
        value: 'Đang xử lý...',
        numericValue: 0,
        duration: 'Đang xử lý...',
        summary: 'Đang xử lý OCR để trích xuất thông tin...',
        fullText: 'Đang xử lý...'
      },
      file
    };

    setContracts(prev => [newContract, ...prev]);
    setShowUpload(false);
  };

  const handleSendForApproval = (contract: Contract, approvers: Array<{ userId: string; role: string; stepNumber: number }>) => {
    const approvalSteps: ApprovalStep[] = approvers.map(approver => {
      const user = users.find(u => u.id === approver.userId);
      return {
        id: `step-${approver.stepNumber}`,
        stepNumber: approver.stepNumber,
        approverRole: approver.role,
        approverLevel: user?.approvalLevel || 1,
        approverName: user?.name,
        status: 'pending' as const
      };
    });

    setContracts(prev => prev.map(c => 
      c.id === contract.id 
        ? { 
            ...c, 
            status: 'pending' as const, 
            approvalSteps,
            currentStep: 0
          }
        : c
    ));
    
    setShowApprovalModal(null);
  };

  const handleSubmitForApproval = (contractId: string) => {
    setContracts(contracts.map(c => {
      if (c.id === contractId) {
        createNewVersion(contractId, 'Gửi phê duyệt');
        return { ...c, status: 'pending' };
      }
      return c;
    }));
  };

  const handleApproveContract = (contractId: string, comments?: string) => {
    setContracts(contracts.map(c => 
      c.id === contractId ? { 
        ...c, 
        status: 'approved', 
        reviewDate: new Date().toISOString().split('T')[0],
        reviewer: authState.user?.name || 'Admin User',
        comments: comments || 'Hợp đồng đã được phê duyệt'
      } : c
    ));
    setSelectedContract(null);
  };

  const handleRejectContract = (contractId: string, reason: string) => {
    setContracts(contracts.map(c => 
      c.id === contractId ? { 
        ...c, 
        status: 'rejected', 
        reviewDate: new Date().toISOString().split('T')[0],
        reviewer: authState.user?.name || 'Admin User',
        comments: reason
      } : c
    ));
    setSelectedContract(null);
  };

  const handleManualContractSave = (contractData: Omit<Contract, 'id' | 'status' | 'uploadDate' | 'versions' | 'currentVersion' | 'approvalSteps' | 'currentStep' | 'reminders'>) => {
    const newContract: Contract = {
      ...contractData,
      id: Date.now().toString(),
      status: 'draft',
      uploadDate: new Date().toISOString(),
      versions: [{
        id: '1',
        version: 1,
        title: contractData.title,
        content: contractData.extractedInfo?.fullText || '',
        changes: 'Phiên bản đầu tiên',
        createdAt: new Date().toISOString(),
        createdBy: authState.user?.name || 'Unknown'
      }],
      currentVersion: 1,
      approvalSteps: [],
      currentStep: 0,
      reminders: []
    };

    setContracts(prev => [newContract, ...prev]);
    setShowManualCreator(false);
  };

  const handleDeleteContract = (contractId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hợp đồng này?')) {
      setContracts(prev => prev.filter(c => c.id !== contractId));
    }
  };

  const handleResubmitContract = (contractId: string) => {
    setContracts(prev => prev.map(c => 
      c.id === contractId 
        ? { ...c, status: 'draft' as const, comments: undefined, reviewDate: undefined }
        : c
    ));
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (fullTextSearch && contract.extractedInfo?.fullText.toLowerCase().includes(fullTextSearch.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || contract.status === filterStatus;
    const matchesTags = filterTags.length === 0 || filterTags.some(tagId => 
      contract.tags.some(tag => tag.id === tagId)
    );
    return matchesSearch && matchesFilter && matchesTags;
  });

  const handleAddVersion = (contractId: string, title: string, content: string, changes: string) => {
    setContracts(contracts.map(c => {
      if (c.id === contractId) {
        const newVersion: ContractVersion = {
          id: `v${c.versions.length + 1}`,
          version: c.versions.length + 1,
          title,
          content,
          changes,
          createdAt: new Date().toISOString(),
          createdBy: authState.user?.name || 'Current User'
        };
        return {
          ...c,
          versions: [...c.versions, newVersion],
          currentVersion: newVersion.version
        };
      }
      return c;
    }));
  };

  const handleAddComment = (contractId: string, content: string, highlightedText?: string) => {
    const newComment: ContractComment = {
      id: `c${comments.length + 1}`,
      contractId,
      userId: authState.user?.id || 'current-user',
      userName: authState.user?.name || 'Current User',
      content,
      highlightedText,
      createdAt: new Date().toISOString(),
      isResolved: false
    };
    setComments([...comments, newComment]);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
  };

  const handleResolveComment = (commentId: string) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, isResolved: true } : c
    ));
  };

  const handleAddReminder = (contractId: string, reminder: Omit<ContractReminder, 'id'>) => {
    setContracts(contracts.map(c => {
      if (c.id === contractId) {
        const newReminder: ContractReminder = {
          ...reminder,
          id: `r${c.reminders.length + 1}`
        };
        return {
          ...c,
          reminders: [...c.reminders, newReminder]
        };
      }
      return c;
    }));
  };

  const handleDeleteReminder = (contractId: string, reminderId: string) => {
    setContracts(contracts.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          reminders: c.reminders.filter(r => r.id !== reminderId)
        };
      }
      return c;
    }));
  };

  const handleSendForSignature = (contractId: string, signers: Array<{ email: string; name: string; role: string }>, provider: string) => {
    setContracts(contracts.map(c => {
      if (c.id === contractId) {
        const eSignature: ESignatureRequest = {
          id: `es${Date.now()}`,
          contractId,
          signers: signers.map(s => ({ ...s, signed: false })),
          provider: provider as any,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        return { ...c, eSignature };
      }
      return c;
    }));
  };

  const handleApprovalStepAction = (contractId: string, stepId: string, action: 'approve' | 'reject', comments?: string) => {
    const currentUser = authState.user;
    if (!currentUser) return;

    setContracts(contracts.map(c => {
      if (c.id === contractId) {
        const currentStep = c.approvalSteps.find(s => s.id === stepId);
        if (!currentStep) return c;

        // Kiểm tra quyền phê duyệt dựa trên level và giá trị hợp đồng
        const contractValue = c.extractedInfo?.numericValue || 0;
        if (currentUser.maxContractValue < contractValue && currentUser.role !== 'admin') {
          alert('Bạn không có quyền phê duyệt hợp đồng với giá trị này!');
          return c;
        }

        const updatedSteps = c.approvalSteps.map(step => {
          if (step.id === stepId) {
            return {
              ...step,
              status: action === 'approve' ? 'approved' : 'rejected',
              approvedAt: new Date().toISOString().split('T')[0],
              approverName: currentUser.name,
              comments
            };
          }
          return step;
        });
        
        // Tạo phiên bản mới khi có hành động phê duyệt
        createNewVersion(contractId, `${action === 'approve' ? 'Phê duyệt' : 'Từ chối'} bởi ${currentUser.name}`);
        
        const currentStepIndex = updatedSteps.findIndex(s => s.id === stepId);
        const newCurrentStep = action === 'approve' ? currentStepIndex + 1 : currentStepIndex;
        const allApproved = updatedSteps.every(s => s.status === 'approved');
        const hasRejected = updatedSteps.some(s => s.status === 'rejected');
        
        return {
          ...c,
          approvalSteps: updatedSteps,
          currentStep: newCurrentStep,
          status: hasRejected ? 'rejected' : allApproved ? 'approved' : 'pending'
        };
      }
      return c;
    }));
  };

  const handleGenerateFinalPDF = (contractId: string) => {
    setContracts(contracts.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          finalPdfUrl: `/contracts/${contractId}/final.pdf`
        };
      }
      return c;
    }));
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

  const canEditContract = (contract: Contract): boolean => {
    if (!authState.user) return false;
    
    // Admin có thể chỉnh sửa mọi hợp đồng
    if (authState.user.role === 'admin') return true;
    
    // Nhân viên chỉ có thể chỉnh sửa hợp đồng nháp hoặc bị từ chối
    return contract.status === 'draft' || contract.status === 'rejected';
  };

  const handleEditContract = (contract: Contract) => {
    if (canEditContract(contract)) {
      setEditingContract(contract);
    }
  };

  const handleSaveContract = (contractId: string, updates: Partial<Contract>) => {
    setContracts(contracts.map(c => {
      if (c.id === contractId) {
        const updatedContract = { ...c, ...updates };
        
        // Tạo phiên bản mới khi có thay đổi quan trọng
        if (updates.extractedInfo || updates.title || updates.description) {
          createNewVersion(contractId, 'Cập nhật thông tin hợp đồng', updates.extractedInfo?.fullText);
          
          // Cập nhật approval steps nếu giá trị thay đổi
          if (updates.extractedInfo?.numericValue && updates.extractedInfo.numericValue !== c.extractedInfo?.numericValue) {
            updatedContract.approvalSteps = generateApprovalSteps(updates.extractedInfo.numericValue);
            updatedContract.currentStep = 0;
          }
        }
        
        return updatedContract;
      }
      return c;
    }));
    setEditingContract(null);
  };

  // Show auth modal if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <FileText className="w-12 h-12 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">ContractFlow</h1>
          </div>
          <p className="text-gray-600 mb-8">Hệ thống quản lý và phê duyệt hợp đồng</p>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </div>
    );
  }

  const renderDashboard = () => (
    <DetailedAnalytics 
      stats={dashboardStats} 
      contracts={contracts}
      onBack={() => setActiveView('dashboard')}
      onContractClick={(contract) => setSelectedContract(contract)}
    />
  );

  const renderUpload = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tải lên hợp đồng</h2>
          <p className="text-gray-600 mb-8">Chọn file PDF hoặc hình ảnh để tải lên. Hệ thống sẽ tự động xử lý OCR và trích xuất thông tin.</p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Chọn file để tải lên</p>
                <p className="text-sm text-gray-500">PDF, JPG, PNG lên đến 10MB</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContracts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-900">Quản lý hợp đồng</h2>
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm hợp đồng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm toàn văn..."
              value={fullTextSearch}
              onChange={(e) => setFullTextSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
          {/* <select
            multiple
            value={filterTags}
            onChange={(e) => setFilterTags(Array.from(e.target.selectedOptions, option => option.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả tags</option>
            {availableTags.map(tag => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select> */}
    {/* the select da chinh sua  */}
          <select
              multiple
              value={filterTags.length === 0 ? [""] : filterTags}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                if (selected.includes("")) {
                  // Nếu chọn "Tất cả tags", thì đặt filterTags về rỗng để thể hiện "không lọc gì"
                  setFilterTags([]);
                } else {
                  setFilterTags(selected);
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả tags</option>
              {availableTags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
          {authState.user?.permissions.canUpload && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Tải lên</span>
              </button>
              <button
                onClick={() => setShowManualCreator(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo thủ công</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hợp đồng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tải lên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người duyệt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{contract.title}</p>
                      <p className="text-sm text-gray-500">{contract.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {contract.tags.map(tag => (
                          <span
                            key={tag.id}
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getTagColor(tag.color)}`}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(contract.status)}`}>
                      {getStatusText(contract.status)}
                    </span>
                    {contract.reminders.some(r => new Date(r.reminderDate) <= new Date()) && (
                      <div className="flex items-center space-x-1 mt-1 text-red-600">
                        <Bell className="w-3 h-3" />
                        <span className="text-xs">Có nhắc nhở</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(contract.uploadDate).toLocaleDateString('vi-VN')}
                    {contract.expiryDate && (
                      <div className="text-xs text-gray-400 mt-1">
                        Hết hạn: {new Date(contract.expiryDate).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contract.reviewer || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {/* <button
                        onClick={() => setShowDetailView(contract)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Xem chi tiết
                      </button> */}
                {/* button đã chỉnh sửa */}
                        <button
                          onClick={() => {
                            setSelectedContract(contract);
                            setShowEditor(true); // giống với nút chỉnh sửa
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Xem chi tiết
                        </button>
                      {canEditContract(contract) && (
                        <button
                          onClick={() => handleEditContract(contract)}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                           Nút Chỉnh sửa
                        </button>
                      )}
                      {contract.status === 'draft' && (
                        <button
                          onClick={() => setShowApprovalModal(contract)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Gửi duyệt
                        </button>
                      )}
                      {contract.status === 'rejected' && (
                        <button
                          onClick={() => handleResubmitContract(contract.id)}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                        >
                          Gửi lại
                        </button>
                      )}
                      {contract.status === 'approved' && contract.finalPdfUrl && (
                        <a
                          href={contract.finalPdfUrl}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          download
                        >
                          Tải PDF
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <UserManagement
      users={users}
      currentUser={authState.user!}
      onAddUser={handleAddUser}
      onUpdateUser={handleUpdateUser}
      onDeleteUser={handleDeleteUser}
    />
  );

  const renderHelpGuide = () => (
    <HelpGuide />
  );
  const renderContractDetail = () => {
    if (!selectedContract) return null;
    const contractComments = comments.filter(c => c.contractId === selectedContract.id);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Chi tiết hợp đồng</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowVersionHistory(!showVersionHistory)}
                  className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>Lịch sử phiên bản</span>
                </button>
                {selectedContract.status === 'approved' && !selectedContract.finalPdfUrl && (
                  <button
                    onClick={() => handleGenerateFinalPDF(selectedContract.id)}
                    className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tạo PDF cuối</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedContract(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tên hợp đồng</label>
                      <p className="text-gray-900">{selectedContract.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedContract.status)}`}>
                        {getStatusText(selectedContract.status)}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Ngày tải lên</label>
                      <p className="text-gray-900">{new Date(selectedContract.uploadDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                    {selectedContract.expiryDate && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Ngày hết hạn</label>
                        <p className="text-gray-900">{new Date(selectedContract.expiryDate).toLocaleDateString('vi-VN')}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedContract.tags.map(tag => (
                        <span
                          key={tag.id}
                          className={`px-3 py-1 text-sm font-medium rounded-full border ${getTagColor(tag.color)}`}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Extracted Info */}
                {selectedContract.extractedInfo && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin trích xuất</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Loại hợp đồng</label>
                        <p className="text-gray-900">{selectedContract.extractedInfo.contractType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Giá trị</label>
                        <p className="text-gray-900">{selectedContract.extractedInfo.value}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Các bên</label>
                        <p className="text-gray-900">{selectedContract.extractedInfo.parties.join(', ')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Thời hạn</label>
                        <p className="text-gray-900">{selectedContract.extractedInfo.duration}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700">Tóm tắt nội dung</label>
                      <p className="text-gray-700 mt-2">{selectedContract.extractedInfo.summary}</p>
                    </div>
                  </div>
                )}

                {/* Multi-step Approval */}
                <MultiStepApproval
                  steps={selectedContract.approvalSteps}
                  currentStep={selectedContract.currentStep}
                  onApprove={(stepId, comments) => handleApprovalStepAction(selectedContract.id, stepId, 'approve', comments)}
                  onReject={(stepId, reason) => handleApprovalStepAction(selectedContract.id, stepId, 'reject', reason)}
                  canApprove={authState.user?.permissions.canApprove || false}
                />

                {/* Comments */}
                <ContractComments
                  comments={contractComments}
                  onAddComment={(content, highlightedText) => handleAddComment(selectedContract.id, content, highlightedText)}
                  onDeleteComment={handleDeleteComment}
                  onResolveComment={handleResolveComment}
                />
              </div>

              {/* Sidebar */}
              <div>
                <div className="space-y-6">
                  {/* E-Signature */}
                  {selectedContract.status === 'approved' && (
                    <ESignaturePanel
                      contract={selectedContract}
                      availableSigners={users}
                      onSendForSignature={(signers, provider) => handleSendForSignature(selectedContract.id, signers, provider)}
                    />
                  )}

                  {/* Reminders */}
                  <ContractReminders
                    contract={selectedContract}
                    onAddReminder={(reminder) => handleAddReminder(selectedContract.id, reminder)}
                    onDeleteReminder={(reminderId) => handleDeleteReminder(selectedContract.id, reminderId)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">ContractFlow</h1>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {authState.user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{authState.user?.name}</p>
                  <p className="text-xs text-gray-500">{authState.user?.position}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-2 flex items-center space-x-1 text-xs text-red-600 hover:text-red-800"
              >
                <LogOut className="w-3 h-3" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
          
          <nav className="mt-6">
            <div className="space-y-1">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 ${
                  activeView === 'dashboard' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <div className="w-4 h-4 rounded bg-blue-100"></div>
                <span>Dashboard</span>
              </button>
              
              {authState.user?.permissions.canUpload && (
                <button
                  onClick={() => setActiveView('upload')}
                  className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 ${
                    activeView === 'upload' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Tải lên</span>
                </button>
              )}
              
              <button
                onClick={() => setActiveView('contracts')}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 ${
                  activeView === 'contracts' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Hợp đồng</span>
              </button>
              
              {authState.user?.permissions.canUpload && (
                <button
                  onClick={() => setShowManualCreator(true)}
                  className="w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 text-gray-700"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Tạo hợp đồng</span>
                </button>
              )}
              
              <button
                onClick={() => setActiveView('approved')}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 ${
                  activeView === 'approved' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Đã duyệt</span>
              </button>
              
              {authState.user?.permissions.canViewAnalytics && (
                <button
                  onClick={() => setActiveView('analytics')}
                  className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 ${
                    activeView === 'analytics' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Thống kê</span>
                </button>
              )}
              
              {authState.user?.permissions.canManageUsers && (
                <button
                  onClick={() => setActiveView('users')}
                  className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 ${
                    activeView === 'users' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Quản lý người dùng</span>
                </button>
              )}
              
              {authState.user?.permissions.canApproveUsers && (
                <button
                  onClick={() => setShowUserApproval(true)}
                  className="w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 text-gray-700"
                >
                  <Shield className="w-4 h-4" />
                  <span>Phê duyệt tài khoản</span>
                  {users.filter(u => !u.isApproved).length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {users.filter(u => !u.isApproved).length}
                    </span>
                  )}
                </button>
              )}
              
              <button
                onClick={() => setActiveView('help')}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 ${
                  activeView === 'help' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Hướng dẫn</span>
              </button>
            </div>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-8">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'upload' && authState.user?.permissions.canUpload && renderUpload()}
          {activeView === 'contracts' && renderContracts()}
          {activeView === 'approved' && renderContracts()}
          {activeView === 'analytics' && authState.user?.permissions.canViewAnalytics && (
            <TimeFilteredAnalytics 
              stats={dashboardStats} 
              contracts={contracts}
              onBack={() => setActiveView('dashboard')}
              onContractClick={(contract) => setSelectedContract(contract)}
            />
          )}
          {activeView === 'users' && authState.user?.permissions.canManageUsers && renderUserManagement()}
          {activeView === 'help' && renderHelpGuide()}
        </div>
      </div>
      
      {selectedContract && renderContractDetail()}
      
      {showUpload && (
        <ContractUpload
          onUpload={handleContractUpload}
          onClose={() => setShowUpload(false)}
          existingContracts={contracts}
        />
      )}

      {showApprovalModal && (
        <ApprovalWorkflowModal
          contract={showApprovalModal}
          users={users}
          onSubmit={(approvers) => handleSendForApproval(showApprovalModal, approvers)}
          onClose={() => setShowApprovalModal(null)}
        />
      )}

      {showDetailView && (
        <ContractDetailView
          contract={showDetailView}
          onBack={() => setShowDetailView(null)}
          onEdit={() => {
            setSelectedContract(showDetailView);
            setShowDetailView(null);
            setShowEditor(true);
          }}
          canEdit={showDetailView.status === 'draft' || showDetailView.status === 'rejected' || authState.user?.role === 'admin'}
        />
      )}

      {showManualCreator && (
        <ManualContractCreator
          onClose={() => setShowManualCreator(false)}
          onSave={handleManualContractSave}
          availableTags={availableTags}
        />
      )}
      
      {showUserApproval && authState.user?.permissions.canApproveUsers && (
        <UserApprovalPanel
          users={users.filter(u => !u.isApproved)}
          onClose={() => setShowUserApproval(false)}
          onApprove={handleApproveUser}
          onReject={handleRejectUser}
        />
      )}
      
      {editingContract && (
        <ContractEditor
          contract={editingContract}
          availableTags={availableTags}
          onSave={handleSaveContract}
          onClose={() => setEditingContract(null)}
          canEdit={canEditContract(editingContract)}
        />
      )}
      
      {showVersionHistory && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Lịch sử phiên bản - {selectedContract.title}</h2>
                <button
                  onClick={() => setShowVersionHistory(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <VersionHistory
                contract={selectedContract}
                onVersionSelect={(version) => console.log('Selected version:', version)}
                onCompareVersions={(v1, v2) => setShowVersionComparison({ v1, v2 })}
              />
            </div>
          </div>
        </div>
      )}
      
      {showVersionComparison && (
        <VersionComparison
          version1={showVersionComparison.v1}
          version2={showVersionComparison.v2}
          onClose={() => setShowVersionComparison(null)}
        />
      )}
    </div>
  );
}

export default App;
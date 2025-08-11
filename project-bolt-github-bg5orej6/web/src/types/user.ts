export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'manager' | 'admin' | 'legal' | 'director' | 'finance';
  department: string;
  position: string;
  avatar?: string;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
  lastLogin?: string;
  approvalLevel: number; // 1: employee, 2: manager, 3: director, 4: admin
  maxContractValue: number; // Giá trị hợp đồng tối đa có thể phê duyệt
  permissions: {
    canUpload: boolean;
    canApprove: boolean;
    canManageUsers: boolean;
    canViewAnalytics: boolean;
    canSign: boolean;
    canApproveUsers: boolean;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  department: string;
  position: string;
}
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../utils/mockData';

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (roleToSelect?: UserRole) => void;
  closeAuthModal: () => void;
  loginWithCredentials: (
    role: UserRole,
    username: string,
    employeeId: string,
    password: string,
    extraMeta?: { phone?: string; jobTitle?: string }
  ) => { success: boolean; error?: string };
  loginAsWorker: (name: string, employeeId: string, phone: string, password?: string) => void;
  loginAsHSE: (name: string, employeeId: string, jobTitle: string, password?: string) => void;
  loginAsGM: (password: string, username?: string, employeeId?: string) => { success: boolean; error?: string };
  loginAsAdmin: (password: string, username?: string, employeeId?: string) => { success: boolean; error?: string };
  switchPortalRole: (role: UserRole) => void;
  logout: () => void;
  targetRoleForModal: UserRole;
  setTargetRoleForModal: (role: UserRole) => void;
  updateUserPoints: (pointsDelta: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('safetypulse_role') as UserRole;
    if (saved === 'worker' || saved === 'hse' || saved === 'gm' || saved === 'admin') return saved;
    return 'worker';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('safetypulse_auth');
    return savedAuth !== 'false';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('safetypulse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_USERS.worker;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('safetypulse_auth');
    return savedAuth === 'false';
  });

  const [targetRoleForModal, setTargetRoleForModal] = useState<UserRole>('worker');

  useEffect(() => {
    localStorage.setItem('safetypulse_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('safetypulse_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('safetypulse_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const openAuthModal = (roleToSelect?: UserRole) => {
    if (roleToSelect) {
      setTargetRoleForModal(roleToSelect);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    if (isAuthenticated) {
      setIsAuthModalOpen(false);
    }
  };

  const loginWithCredentials = (
    role: UserRole,
    username: string,
    employeeId: string,
    password: string,
    extraMeta?: { phone?: string; jobTitle?: string }
  ): { success: boolean; error?: string } => {
    const trimmedUser = username.trim();
    const trimmedId = employeeId.trim().toUpperCase();
    const trimmedPass = password.trim();

    if (!trimmedUser) {
      return { success: false, error: 'اسم المستخدم مطلوب / Username is required' };
    }
    if (!trimmedId) {
      return { success: false, error: 'رقم الأداء الوظيفي مطلوب / Employee ID is required' };
    }
    if (!trimmedPass) {
      return { success: false, error: 'كلمة المرور مطلوبة / Password is required' };
    }

    // Role-specific password verification
    if (role === 'gm') {
      const validGmPasses = ['gm123', 'admin123', '0000', 'gm2026', 'admin'];
      if (!validGmPasses.includes(trimmedPass)) {
        return { success: false, error: 'كلمة مرور المدير العام غير صحيحة (التجريبية: gm123 أو 0000)' };
      }
    } else if (role === 'admin') {
      const validAdminPasses = ['admin123', '0000', 'admin', 'stop2026'];
      if (!validAdminPasses.includes(trimmedPass)) {
        return { success: false, error: 'كلمة مرور مدير النظام غير صحيحة (التجريبية: admin123 أو 0000)' };
      }
    } else if (role === 'hse') {
      const validHsePasses = ['hse123', '4105', '0000', 'admin123', '1234'];
      if (!validHsePasses.includes(trimmedPass)) {
        return { success: false, error: 'كلمة مرور مسؤول السلامة غير صحيحة (التجريبية: hse123 أو 4105)' };
      }
    } else if (role === 'worker') {
      const validWorkerPasses = ['worker123', '1234', '8821', '0000', 'admin123'];
      if (!validWorkerPasses.includes(trimmedPass)) {
        return { success: false, error: 'كلمة مرور العامل غير صحيحة (التجريبية: worker123 أو 1234)' };
      }
    }

    const baseProfile = DEMO_USERS[role];
    const initials = trimmedUser
      .split(' ')
      .map(p => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'SP';

    const updatedUser: UserProfile = {
      ...baseProfile,
      name: trimmedUser,
      employeeId: trimmedId,
      phone: extraMeta?.phone || baseProfile.phone,
      jobTitle: extraMeta?.jobTitle || baseProfile.jobTitle,
      avatar: initials
    };

    setCurrentUser(updatedUser);
    setCurrentRole(role);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const loginAsWorker = (name: string, employeeId: string, phone: string, password: string = 'worker123') => {
    loginWithCredentials('worker', name, employeeId, password, { phone });
  };

  const loginAsHSE = (name: string, employeeId: string, jobTitle: string, password: string = 'hse123') => {
    loginWithCredentials('hse', name, employeeId, password, { jobTitle });
  };

  const loginAsGM = (password: string, username: string = DEMO_USERS.gm.name, employeeId: string = DEMO_USERS.gm.employeeId) => {
    return loginWithCredentials('gm', username, employeeId, password);
  };

  const loginAsAdmin = (password: string, username: string = DEMO_USERS.admin.name, employeeId: string = DEMO_USERS.admin.employeeId) => {
    return loginWithCredentials('admin', username, employeeId, password);
  };

  const switchPortalRole = (role: UserRole) => {
    // Role switching requires re-authentication per security guidelines
    setTargetRoleForModal(role);
    setIsAuthModalOpen(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAuthModalOpen(true);
  };

  const updateUserPoints = (pointsDelta: number) => {
    setCurrentUser(prev => ({
      ...prev,
      safetyPoints: prev.safetyPoints + pointsDelta,
      reportsSubmitted: prev.reportsSubmitted + 1
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithCredentials,
        loginAsWorker,
        loginAsHSE,
        loginAsGM,
        loginAsAdmin,
        switchPortalRole,
        logout,
        targetRoleForModal,
        setTargetRoleForModal,
        updateUserPoints
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

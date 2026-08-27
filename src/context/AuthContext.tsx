import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, AcademicLevel, UserRole, SellerStatus, AdminPermissions } from '../types';
import { StorageService } from '../services/storageService';

interface SignupData {
  fullName: string;
  username: string;
  email: string;
  password?: string;
  universityId: string;
  campusId: string;
  facultyId?: string;
  departmentId?: string;
  level?: AcademicLevel;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  bio?: string;
  avatarUrl?: string;
  role?: UserRole;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  sellerStatus: SellerStatus;
  isLoading: boolean;
  savedAccounts: UserProfile[];
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  googleLogin: (account?: { email: string; name?: string; avatarUrl?: string }) => Promise<{ success: boolean; message?: string }>;
  loginWithSavedAccount: (userId: string) => Promise<{ success: boolean; message?: string }>;
  removeSavedAccount: (userId: string) => void;
  signup: (data: SignupData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; message?: string }>;
  completeSellerOnboarding: (data: {
    sellerBio?: string;
    sellerPickupLocations?: string[];
    phone?: string;
    whatsapp?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  hasAdminPermission: (permission: keyof AdminPermissions) => boolean;
  switchDemoUser: (userId: string) => void;
  demoUsers: UserProfile[];
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demoUsers, setDemoUsers] = useState<UserProfile[]>([]);
  const [savedAccounts, setSavedAccounts] = useState<UserProfile[]>([]);

  const refreshUser = useCallback(() => {
    StorageService.initialize();
    const user = StorageService.getCurrentUser();
    setCurrentUser(user);
    setDemoUsers(StorageService.getUsers());
    setSavedAccounts(StorageService.getSavedAccounts());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen for storage updates
    const handleStorageUpdate = () => {
      refreshUser();
    };

    window.addEventListener('campusplug_storage_update', handleStorageUpdate);
    return () => {
      window.removeEventListener('campusplug_storage_update', handleStorageUpdate);
    };
  }, [refreshUser]);

  const login = async (email: string, _password?: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    // Simulate brief network authentication
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const users = StorageService.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === email.toLowerCase());

    if (!user) {
      setIsLoading(false);
      return { success: false, message: 'No account found with this email or username. Please check your credentials or create an account.' };
    }

    if (user.accountStatus === 'suspended' || user.accountStatus === 'banned' || user.accountStatus === 'SUSPENDED') {
      setIsLoading(false);
      return { success: false, message: 'This account has been suspended by CampusPlug safety moderation.' };
    }

    StorageService.setCurrentUser(user.id);
    StorageService.addSavedAccount(user);
    setCurrentUser(user);
    setSavedAccounts(StorageService.getSavedAccounts());
    setIsLoading(false);
    return { success: true };
  };

  const googleLogin = async (account?: {
    email: string;
    name?: string;
    avatarUrl?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));

    const targetEmail = (account?.email || 'davesbrown88@gmail.com').toLowerCase().trim();
    const targetName = account?.name || (targetEmail.includes('davesbrown') ? 'Dave Brown' : 'UNIOSUN Scholar');
    const targetAvatar =
      account?.avatarUrl ||
      (targetEmail.includes('davesbrown')
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');

    const users = StorageService.getUsers();
    let user = users.find((u) => u.email.toLowerCase() === targetEmail);

    const isSuperAdminEmail =
      targetEmail === StorageService.SUPER_ADMIN_EMAIL.toLowerCase() ||
      targetEmail === 'davesbrown88@gmail.com';

    if (!user) {
      // Create authenticated Google user
      const username = targetEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') || `user_${Date.now()}`;
      user = StorageService.createUser({
        fullName: targetName,
        username: username,
        email: targetEmail,
        avatarUrl: targetAvatar,
        role: isSuperAdminEmail ? 'SUPER_ADMIN' : 'USER',
        sellerStatus: isSuperAdminEmail ? 'VERIFIED_SELLER' : 'NOT_SELLER',
        sellerOnboardingCompleted: isSuperAdminEmail,
        universityId: 'uni-uniosun',
        universityName: 'Osun State University',
        campusId: 'campus-osogbo',
        campusName: 'Osogbo Main Campus',
        facultyId: 'fac-eng',
        facultyName: 'Faculty of Engineering',
        departmentId: 'dept-mech',
        departmentName: 'Mechanical Engineering',
        level: '300L',
        bio: isSuperAdminEmail
          ? 'Founder & Super Administrator of CampusPlug by Ace Tech. Managing multi-campus student commerce and ecosystem trust.'
          : 'Student at Osun State University connected via Google.',
        phone: isSuperAdminEmail ? '+2348012345678' : undefined,
        whatsapp: isSuperAdminEmail ? '2348012345678' : undefined,
        showPhonePublicly: true,
        showDepartmentPublicly: true,
        rating: 5.0,
        totalRatings: 1,
        verificationBadge: isSuperAdminEmail ? 'trusted_seller' : 'verified_student',
        accountStatus: 'active',
      });
    } else {
      // Ensure Super Admin status if email matches
      if (isSuperAdminEmail && user.role !== 'SUPER_ADMIN') {
        const updated = StorageService.updateUser(user.id, {
          role: 'SUPER_ADMIN',
          sellerStatus: 'VERIFIED_SELLER',
          sellerOnboardingCompleted: true,
        });
        if (updated) user = updated;
      }
    }

    if (user.accountStatus === 'suspended' || user.accountStatus === 'banned') {
      setIsLoading(false);
      return { success: false, message: 'This Google account has been suspended by CampusPlug safety moderation.' };
    }

    StorageService.setCurrentUser(user.id);
    StorageService.addSavedAccount(user);
    setCurrentUser(user);
    setSavedAccounts(StorageService.getSavedAccounts());
    setIsLoading(false);

    return {
      success: true,
      message: isSuperAdminEmail
        ? `Welcome Dave Brown! Signed in as Super Administrator.`
        : `Signed in as ${user.fullName}`,
    };
  };

  const loginWithSavedAccount = async (userId: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const user = StorageService.getUserById(userId);
    if (!user) {
      StorageService.removeSavedAccount(userId);
      setSavedAccounts(StorageService.getSavedAccounts());
      setIsLoading(false);
      return { success: false, message: 'Saved account not found.' };
    }

    if (user.accountStatus === 'suspended' || user.accountStatus === 'banned') {
      setIsLoading(false);
      return { success: false, message: 'This account has been suspended by safety moderation.' };
    }

    StorageService.setCurrentUser(user.id);
    StorageService.addSavedAccount(user);
    setCurrentUser(user);
    setSavedAccounts(StorageService.getSavedAccounts());
    setIsLoading(false);
    return { success: true };
  };

  const removeSavedAccount = (userId: string) => {
    StorageService.removeSavedAccount(userId);
    setSavedAccounts(StorageService.getSavedAccounts());
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));

    const users = StorageService.getUsers();
    const existing = users.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase() || u.username.toLowerCase() === data.username.toLowerCase()
    );

    if (existing) {
      setIsLoading(false);
      return { success: false, message: 'An account with this email or username already exists on CampusPlug.' };
    }

    const universities = StorageService.getUniversities();
    const campuses = StorageService.getCampuses();
    const faculties = StorageService.getFaculties();
    const departments = StorageService.getDepartments();

    const selectedUni = universities.find((u) => u.id === data.universityId);
    const selectedCampus = campuses.find((c) => c.id === data.campusId);
    const selectedFaculty = faculties.find((f) => f.id === data.facultyId);
    const selectedDept = departments.find((d) => d.id === data.departmentId);

    const isSuperAdminEmail = data.email.toLowerCase().trim() === StorageService.SUPER_ADMIN_EMAIL.toLowerCase();

    const newUser = StorageService.createUser({
      fullName: data.fullName,
      username: data.username.toLowerCase().trim(),
      email: data.email.toLowerCase().trim(),
      avatarUrl:
        data.avatarUrl ||
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      role: isSuperAdminEmail ? 'SUPER_ADMIN' : 'USER',
      sellerStatus: isSuperAdminEmail ? 'VERIFIED_SELLER' : 'NOT_SELLER',
      sellerOnboardingCompleted: isSuperAdminEmail,
      universityId: data.universityId,
      universityName: selectedUni?.name || 'Osun State University',
      campusId: data.campusId,
      campusName: selectedCampus?.name || 'Osogbo Main Campus',
      facultyId: data.facultyId,
      facultyName: selectedFaculty?.name,
      departmentId: data.departmentId,
      departmentName: selectedDept?.name,
      level: data.level || '100L',
      bio: data.bio || 'New student on CampusPlug! Looking forward to connecting with fellow students.',
      phone: data.phone,
      whatsapp: data.whatsapp || (data.phone ? data.phone.replace(/[^0-9]/g, '') : undefined),
      telegram: data.telegram,
      showPhonePublicly: true,
      showDepartmentPublicly: true,
      rating: 5.0,
      totalRatings: 1,
      verificationBadge: 'unverified',
      accountStatus: 'active',
    });

    // Create a welcome notification
    StorageService.createNotification({
      userId: newUser.id,
      title: 'Welcome to CampusPlug!',
      message: `Welcome ${newUser.fullName}! You are registered under ${newUser.universityName} (${newUser.campusName}). Explore student listings, find hostels, or start selling with escrow protection.`,
      type: 'system_announcement',
    });

    StorageService.addSavedAccount(newUser);
    setCurrentUser(newUser);
    setDemoUsers(StorageService.getUsers());
    setSavedAccounts(StorageService.getSavedAccounts());
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) return { success: false, message: 'You must be logged in to update your profile.' };

    const updated = StorageService.updateUser(currentUser.id, updates);
    if (updated) {
      setCurrentUser(updated);
      setDemoUsers(StorageService.getUsers());
      return { success: true };
    }
    return { success: false, message: 'Failed to update profile.' };
  };

  const completeSellerOnboarding = async (data: {
    sellerBio?: string;
    sellerPickupLocations?: string[];
    phone?: string;
    whatsapp?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) return { success: false, message: 'Please sign in first.' };

    const res = StorageService.completeSellerOnboarding(currentUser.id, data);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setDemoUsers(StorageService.getUsers());
      return { success: true, message: 'Seller profile activated! You can now create listings.' };
    }
    return { success: false, message: 'Failed to complete seller onboarding.' };
  };

  const switchDemoUser = (userId: string) => {
    const user = StorageService.getUserById(userId);
    if (user) {
      StorageService.setCurrentUser(user.id);
      setCurrentUser(user);
    }
  };

  const isSuperAdmin = StorageService.isSuperAdmin(currentUser);
  const isAdmin = StorageService.isAdmin(currentUser);

  const sellerStatus: SellerStatus =
    currentUser?.sellerStatus ||
    (currentUser?.role === 'seller' ? 'SELLER' : isSuperAdmin ? 'VERIFIED_SELLER' : 'NOT_SELLER');

  const isSeller =
    sellerStatus === 'SELLER' ||
    sellerStatus === 'VERIFIED_SELLER' ||
    currentUser?.sellerOnboardingCompleted === true ||
    isSuperAdmin;

  const hasAdminPermission = (permission: keyof AdminPermissions): boolean => {
    if (!currentUser) return false;
    if (isSuperAdmin) return true;
    if (!isAdmin) return false;
    if (!currentUser.adminPermissions) return true; // Default admin has all if not restricted
    return !!currentUser.adminPermissions[permission];
  };

  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isSuperAdmin,
        isAdmin,
        isSeller,
        sellerStatus,
        isLoading,
        savedAccounts,
        login,
        googleLogin,
        loginWithSavedAccount,
        removeSavedAccount,
        signup,
        logout,
        updateProfile,
        completeSellerOnboarding,
        hasAdminPermission,
        switchDemoUser,
        demoUsers,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

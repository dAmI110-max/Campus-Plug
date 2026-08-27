import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storageService';
import { AdminPermissions, AdminUserRecord, UserProfile } from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Crown,
  KeyRound,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Search,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminManagementTabProps {
  onRefresh: () => void;
}

export const AdminManagementTab: React.FC<AdminManagementTabProps> = ({ onRefresh }) => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { success, error: showError } = useToast();

  const [adminRecords, setAdminRecords] = useState<AdminUserRecord[]>(() =>
    StorageService.getAdminUsers()
  );
  const [allUsers] = useState<UserProfile[]>(() => StorageService.getUsers());

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUserRecord | null>(null);

  // New admin creation state
  const [selectedUserId, setSelectedUserId] = useState('');
  const [permissions, setPermissions] = useState<AdminPermissions>({
    canManageUsers: true,
    canSuspendUsers: true,
    canManageListings: true,
    canFeatureListings: true,
    canModerateReports: true,
    canManageFinance: true,
    canReviewDisputes: true,
    canManageEvents: true,
    canManageJobs: true,
    canModerateCommunities: true,
    canManageSupport: true,
    canManageSettings: false,
  });

  const refreshList = () => {
    setAdminRecords(StorageService.getAdminUsers());
    onRefresh();
  };

  const handleTogglePermission = (key: keyof AdminPermissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAssignAdmin = () => {
    if (!currentUser) return;
    if (!selectedUserId) {
      showError('Please select a student user to appoint as Administrator.');
      return;
    }

    const res = StorageService.assignAdmin(currentUser.id, selectedUserId, permissions);
    if (res.success) {
      success(res.message);
      setShowCreateModal(false);
      setSelectedUserId('');
      refreshList();
    } else {
      showError(res.message);
    }
  };

  const handleUpdatePermissions = () => {
    if (!currentUser || !selectedAdmin) return;

    const res = StorageService.updateAdminPermissions(currentUser.id, selectedAdmin.userId, permissions);
    if (res.success) {
      success(res.message);
      setShowEditModal(false);
      setSelectedAdmin(null);
      refreshList();
    } else {
      showError(res.message);
    }
  };

  const handleRevokeAdmin = (admin: AdminUserRecord) => {
    if (!currentUser) return;
    if (admin.role === 'SUPER_ADMIN' || admin.email.toLowerCase() === StorageService.SUPER_ADMIN_EMAIL.toLowerCase()) {
      showError('Primary Super Admin cannot be revoked.');
      return;
    }

    if (window.confirm(`Are you sure you want to revoke Administrator privileges for ${admin.fullName}?`)) {
      const res = StorageService.revokeAdmin(currentUser.id, admin.userId);
      if (res.success) {
        success(res.message);
        refreshList();
      } else {
        showError(res.message);
      }
    }
  };

  const openEditModal = (admin: AdminUserRecord) => {
    setSelectedAdmin(admin);
    setPermissions(admin.permissions);
    setShowEditModal(true);
  };

  const filteredAdmins = adminRecords.filter(
    (a) =>
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableUsersToPromote = allUsers.filter(
    (u) => !adminRecords.some((a) => a.userId === u.id || a.email.toLowerCase() === u.email.toLowerCase())
  );

  const permissionLabels: { key: keyof AdminPermissions; label: string; desc: string }[] = [
    { key: 'canManageUsers', label: 'User Management', desc: 'View student accounts & profiles' },
    { key: 'canSuspendUsers', label: 'Account Suspension', desc: 'Suspend or ban abusive accounts' },
    { key: 'canManageListings', label: 'Marketplace Moderation', desc: 'Delete or edit marketplace items' },
    { key: 'canFeatureListings', label: 'Boost & Feature Listings', desc: 'Pin top student products on home feed' },
    { key: 'canModerateReports', label: 'Safety Reports Desk', desc: 'Review & resolve student abuse reports' },
    { key: 'canManageFinance', label: 'Escrow & Financials', desc: 'View transactions & escrow balances' },
    { key: 'canReviewDisputes', label: 'Dispute Arbitration', desc: 'Resolve buyer/seller escrow disputes' },
    { key: 'canManageEvents', label: 'Event Moderation', desc: 'Approve & manage campus events' },
    { key: 'canManageJobs', label: 'Campus Gigs & Jobs', desc: 'Moderate student part-time jobs' },
    { key: 'canModerateCommunities', label: 'Communities & Clubs', desc: 'Moderate faculty discussion groups' },
    { key: 'canManageSupport', label: 'Support Desk Tickets', desc: 'Reply & manage student support tickets' },
    { key: 'canManageSettings', label: 'Platform & Global Config', desc: 'Modify fees, policies & feature flags' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-amber-400/30">
              <Crown className="w-3 h-3 text-amber-300" /> Super Admin Authorization Desk
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-indigo-400" />
            Administrative Team & RBAC
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Grant and manage granular permissions for Ace Tech moderators. Primary Super Admin role is bound to{' '}
            <strong className="text-white underline">{StorageService.SUPER_ADMIN_EMAIL}</strong>.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => {
              setPermissions({
                canManageUsers: true,
                canSuspendUsers: true,
                canManageListings: true,
                canFeatureListings: true,
                canModerateReports: true,
                canManageFinance: true,
                canReviewDisputes: true,
                canManageEvents: true,
                canManageJobs: true,
                canModerateCommunities: true,
                canManageSupport: true,
                canManageSettings: false,
              });
              setShowCreateModal(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Appoint Administrator
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search admins by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="text-xs font-bold text-slate-500">
          Total Appointed Admins: <span className="text-indigo-600 font-black">{adminRecords.length}</span>
        </div>
      </div>

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAdmins.map((admin) => {
          const isPrimarySuper = admin.email.toLowerCase() === StorageService.SUPER_ADMIN_EMAIL.toLowerCase();

          return (
            <div
              key={admin.id}
              className={`p-5 rounded-3xl border transition-all ${
                isPrimarySuper
                  ? 'bg-gradient-to-br from-amber-50/70 via-white to-indigo-50/60 border-amber-300 shadow-md'
                  : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white shrink-0 ${
                      isPrimarySuper
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-md shadow-amber-500/25'
                        : 'bg-slate-800 shadow-xs'
                    }`}
                  >
                    {isPrimarySuper ? (
                      <Crown className="w-6 h-6 text-white" />
                    ) : (
                      <ShieldCheck className="w-6 h-6 text-indigo-300" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{admin.fullName}</span>
                      {isPrimarySuper ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black uppercase">
                          Super Admin
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200 text-[10px] font-bold uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{admin.email}</div>
                  </div>
                </div>

                {isSuperAdmin && !isPrimarySuper && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(admin)}
                      className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Edit Permissions"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRevokeAdmin(admin)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Revoke Admin Access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Permissions Pills */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Active Permissions
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(admin.permissions).map(([key, enabled]) => {
                    if (!enabled) return null;
                    const matched = permissionLabels.find((p) => p.key === key);
                    return (
                      <span
                        key={key}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {matched?.label || key}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Appointed by: {admin.assignedByName}</span>
                <span>{new Date(admin.assignedAt).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-400" /> Appoint New Administrator
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Select a student account to grant administrative privileges and configure roles.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-full"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Student Account *
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="">-- Choose student user --</option>
                  {availableUsersToPromote.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.email}) — {u.departmentName || 'Student'} ({u.level || '100L'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Granular Permissions Matrix
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {permissionLabels.map((perm) => {
                    const isChecked = permissions[perm.key];
                    return (
                      <button
                        key={perm.key}
                        type="button"
                        onClick={() => handleTogglePermission(perm.key)}
                        className={`p-2.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-2 ${
                          isChecked
                            ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{perm.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{perm.desc}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-0"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignAdmin}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" /> Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Permissions Modal */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Edit className="w-5 h-5 text-indigo-400" /> Edit Admin Permissions
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Updating role capabilities for <strong>{selectedAdmin.fullName}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-full"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {permissionLabels.map((perm) => {
                  const isChecked = permissions[perm.key];
                  return (
                    <button
                      key={perm.key}
                      type="button"
                      onClick={() => handleTogglePermission(perm.key)}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-2 ${
                        isChecked
                          ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{perm.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{perm.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-0"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdatePermissions}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

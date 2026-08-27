import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storageService';
import { AccountStatus, UserProfile } from '../../types';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Ban,
  CheckCircle2,
  AlertTriangle,
  UserX,
  RefreshCw,
  Mail,
  GraduationCap,
} from 'lucide-react';

interface UserModerationTabProps {
  onRefresh: () => void;
}

export const UserModerationTab: React.FC<UserModerationTabProps> = ({ onRefresh }) => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { success, error: showError } = useToast();

  const [users, setUsers] = useState<UserProfile[]>(() => StorageService.getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [campusFilter, setCampusFilter] = useState<string>('all');

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  const refreshList = () => {
    setUsers(StorageService.getUsers());
    onRefresh();
  };

  const handleUpdateStatus = (user: UserProfile, newStatus: AccountStatus) => {
    if (!currentUser) return;

    if (user.email.toLowerCase() === StorageService.SUPER_ADMIN_EMAIL.toLowerCase()) {
      showError('Security Guard: Super Admin account cannot be suspended or banned.');
      return;
    }

    if (newStatus === 'suspended' || newStatus === 'banned') {
      setSelectedUser(user);
      setSuspensionReason('Violation of student trust & safety guidelines.');
      setShowSuspendModal(true);
      return;
    }

    // Reactivate
    const res = StorageService.updateUserAccountStatus(currentUser.id, user.id, newStatus);
    if (res.success) {
      success(`User account for ${user.fullName} reactivated.`);
      refreshList();
    } else {
      showError(res.message);
    }
  };

  const handleConfirmSuspension = () => {
    if (!currentUser || !selectedUser) return;

    const res = StorageService.updateUserAccountStatus(
      currentUser.id,
      selectedUser.id,
      'suspended',
      suspensionReason
    );

    if (res.success) {
      success(`Account for ${selectedUser.fullName} has been suspended.`);
      setShowSuspendModal(false);
      setSelectedUser(null);
      refreshList();
    } else {
      showError(res.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || u.accountStatus === statusFilter;
    const matchesCampus = campusFilter === 'all' || u.campusId === campusFilter;

    return matchesSearch && matchesStatus && matchesCampus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Student Account Moderation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Search, moderate, and protect the UNIOSUN student community from bad actors.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-300">
          Total Accounts: <span className="text-indigo-400 font-mono text-sm">{users.length}</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name, email, matric..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-2xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
            <option value="banned">Banned Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">University & Campus</th>
                <th className="py-3 px-4">Department & Level</th>
                <th className="py-3 px-4">Role / Verification</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isSuper = u.email.toLowerCase() === StorageService.SUPER_ADMIN_EMAIL.toLowerCase();

                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl}
                          alt={u.fullName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {u.fullName}
                            {isSuper && (
                              <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                                Super Admin
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-semibold">{u.universityName || 'UNIOSUN'}</div>
                      <div className="text-[10px] text-slate-400">{u.campusName || 'Main Campus'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-semibold">{u.departmentName || 'General Studies'}</div>
                      <div className="text-[10px] text-slate-400">{u.level || '100L'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="capitalize font-bold text-slate-700">
                          {u.sellerStatus === 'SELLER' || u.sellerStatus === 'VERIFIED_SELLER'
                            ? 'Seller'
                            : u.role}
                        </span>
                        {u.verificationBadge === 'verified_student' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" title="Verified Student" />
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.accountStatus === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {u.accountStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {!isSuper && (
                        <div className="flex items-center justify-end gap-1.5">
                          {u.accountStatus === 'active' ? (
                            <button
                              onClick={() => handleUpdateStatus(u, 'suspended')}
                              className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] transition-colors flex items-center gap-1"
                            >
                              <Ban className="w-3 h-3 text-rose-600" /> Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(u, 'active')}
                              className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Reactivate
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suspend Confirmation Modal */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Suspend Student Account
                </h3>
                <p className="text-xs text-slate-500">{selectedUser.fullName} ({selectedUser.email})</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Moderation Reason / Violation Details *
              </label>
              <textarea
                rows={3}
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Reason for suspension (displayed to user upon login)..."
                className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSuspendModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspension}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

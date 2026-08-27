import React, { useState } from 'react';
import { User, Campus } from '../../types';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User as UserIcon, Save, Shield, CheckCircle2 } from 'lucide-react';

interface ProfileSettingsTabProps {
  user: User;
  onRefresh: () => void;
}

export const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({
  user,
  onRefresh,
}) => {
  const { updateProfile } = useAuth();
  const { success, error } = useToast();

  const campuses: Campus[] = StorageService.getCampuses(user.universityId || 'uni-uniosun');

  const [fullName, setFullName] = useState(user.fullName || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [whatsapp, setWhatsapp] = useState(user.whatsapp || '');
  const [telegram, setTelegram] = useState(user.telegram || '');
  const [campusId, setCampusId] = useState(user.campusId || 'campus-osogbo');
  const [department, setDepartment] = useState(user.department || '');
  const [level, setLevel] = useState(user.level || '300');
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');

  // Privacy toggles
  const [showPhonePublicly, setShowPhonePublicly] = useState(
    user.privacySettings?.showPhonePublicly ?? true
  );
  const [showDepartmentPublicly, setShowDepartmentPublicly] = useState(
    user.privacySettings?.showDepartmentPublicly ?? true
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      error('Full Name and Phone Number are required.');
      return;
    }

    const selectedCampus = campuses.find((c) => c.id === campusId);

    setIsSubmitting(true);
    const updated = updateProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      telegram: telegram.trim(),
      campusId,
      campusName: selectedCampus?.name || user.campusName,
      department: department.trim(),
      level: level.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim() || user.avatarUrl,
      privacySettings: {
        showPhonePublicly,
        showDepartmentPublicly,
      },
    });

    setIsSubmitting(false);

    if (updated) {
      success('Student profile updated successfully!');
      onRefresh();
    } else {
      error('Failed to update profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Profile Photo & Quick Info */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <img
          src={avatarUrl || user.avatarUrl}
          alt={fullName}
          referrerPolicy="no-referrer"
          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20"
        />
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Avatar Image URL</label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Paste image URL..."
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            disabled
            value={user.email}
            className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number</label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="e.g. 08123456789"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Telegram Handle (@)</label>
          <input
            type="text"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            placeholder="e.g. @uniosun_ace"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">UNIOSUN Campus *</label>
          <select
            value={campusId}
            onChange={(e) => setCampusId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-hidden focus:border-emerald-500"
          >
            {campuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Course</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g. Computer Science, Accounting, Law..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-hidden focus:border-emerald-500"
          >
            <option value="100">100 Level (Freshman)</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
            <option value="500">500 Level (Final Year)</option>
            <option value="Postgraduate">Postgraduate / Alum</option>
          </select>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / Seller Note</label>
        <textarea
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Brief intro about yourself or what you usually sell on campus..."
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500 resize-none"
        />
      </div>

      {/* Privacy Settings */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Shield className="w-4 h-4 text-emerald-600" /> Privacy & Student Visibility
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
          <input
            type="checkbox"
            checked={showPhonePublicly}
            onChange={(e) => setShowPhonePublicly(e.target.checked)}
            className="w-4 h-4 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          Show my phone number on my listings
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
          <input
            type="checkbox"
            checked={showDepartmentPublicly}
            onChange={(e) => setShowDepartmentPublicly(e.target.checked)}
            className="w-4 h-4 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          Show my department and level on my public profile
        </label>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 active:scale-98 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </div>
    </form>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storageService';
import { RoommateProfile } from '../../types';
import {
  Users,
  X,
  MapPin,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

interface CreateRoommateModalProps {
  existingProfile?: RoommateProfile | null;
  onClose: () => void;
  onSuccess: (profile: RoommateProfile) => void;
}

export const CreateRoommateModal: React.FC<CreateRoommateModalProps> = ({
  existingProfile,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();

  const [campusId, setCampusId] = useState(existingProfile?.campusId || currentUser?.campusId || 'cmp-osogbo');
  const [department, setDepartment] = useState(existingProfile?.department || currentUser?.departmentName || 'Computer Science');
  const [level, setLevel] = useState(existingProfile?.level || currentUser?.level || '300L');
  const [gender, setGender] = useState(existingProfile?.gender || currentUser?.gender || 'male');
  const [preferredGender, setPreferredGender] = useState(existingProfile?.preferredGender || 'same_gender');
  const [budget, setBudget] = useState(existingProfile?.budget?.toString() || '120000');
  const [preferredRoomType, setPreferredRoomType] = useState(existingProfile?.preferredRoomType || 'Self-Contain (Shared) or 2-Bedroom Flat');
  const [preferredLocation, setPreferredLocation] = useState(existingProfile?.preferredLocation || 'Oke-Baale / Powerline Area, Osogbo');
  const [cleanlinessLevel, setCleanlinessLevel] = useState(existingProfile?.cleanlinessLevel || 'very_clean');
  const [smokingTolerance, setSmokingTolerance] = useState(existingProfile?.smokingTolerance || 'non_smoker_only');
  const [studyHabits, setStudyHabits] = useState(existingProfile?.studyHabits || 'balanced');
  const [bio, setBio] = useState(
    existingProfile?.bio ||
      'Looking for a peaceful, focused, and neat roommate to split accommodation costs for next academic session.'
  );
  const [whatsapp, setWhatsapp] = useState(existingProfile?.whatsapp || currentUser?.whatsapp || '+2348012345678');

  if (!currentUser) return null;

  const campuses = StorageService.getCampuses('uni-uniosun');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = Number(budget);
    if (!budgetNum || budgetNum <= 0) {
      showError('Please enter a valid budget');
      return;
    }

    const selectedCampus = campuses.find((c) => c.id === campusId);

    const saved = StorageService.createOrUpdateRoommateProfile(currentUser.id, {
      campusId,
      campusName: selectedCampus?.name || 'Osogbo Campus',
      department,
      level,
      gender,
      preferredGender,
      budget: budgetNum,
      preferredRoomType,
      preferredLocation,
      cleanlinessLevel,
      smokingTolerance,
      studyHabits,
      bio,
      whatsapp,
      isActive: true,
    });

    success('Roommate profile published successfully!');
    onSuccess(saved);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {existingProfile ? 'Update Roommate Listing' : 'Find a Compatible Roommate'}
              </h2>
              <span className="text-xs text-slate-500">Connect with UNIOSUN students to split rent safely</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Campus</label>
              <select
                value={campusId}
                onChange={(e) => setCampusId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Academic Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="100L">100L (Freshman)</option>
                <option value="200L">200L</option>
                <option value="300L">300L</option>
                <option value="400L">400L</option>
                <option value="500L">500L (Final Year)</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">My Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 capitalize"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Roommate Gender</label>
              <select
                value={preferredGender}
                onChange={(e) => setPreferredGender(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="same_gender">Same Gender Only</option>
                <option value="any">Any Gender</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Max Rent Budget (NGN / Year)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2 text-sm font-bold text-slate-400">₦</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 120000"
                className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Room Type</label>
              <input
                type="text"
                value={preferredRoomType}
                onChange={(e) => setPreferredRoomType(e.target.value)}
                placeholder="e.g. Self-Contain or 2-Bed Flat"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Area / Off-Campus Location</label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g. Powerline / Oke-Baale"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Lifestyle & Habits */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-900 block">Lifestyle & Habits</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Cleanliness</label>
                <select
                  value={cleanlinessLevel}
                  onChange={(e) => setCleanlinessLevel(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] font-bold bg-white text-slate-900"
                >
                  <option value="very_clean">Very Clean</option>
                  <option value="moderate">Moderate</option>
                  <option value="relaxed">Relaxed</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Smoking</label>
                <select
                  value={smokingTolerance}
                  onChange={(e) => setSmokingTolerance(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] font-bold bg-white text-slate-900"
                >
                  <option value="non_smoker_only">Non-Smoker</option>
                  <option value="outside_only">Outside Only</option>
                  <option value="smoker_friendly">Smoker Friendly</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Study Habits</label>
                <select
                  value={studyHabits}
                  onChange={(e) => setStudyHabits(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] font-bold bg-white text-slate-900"
                >
                  <option value="quiet">Quiet / Night</option>
                  <option value="balanced">Balanced</option>
                  <option value="group_study">Group Study</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">About Me / Roommate Expectations</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell potential roommates about your study habits, personality, sleep schedule, and what you're looking for."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number for Direct Inquiries</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+23480..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all"
          >
            {existingProfile ? 'Save Changes' : 'Publish Roommate Profile'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

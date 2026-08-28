import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { CommunityCategory } from '../../types';
import {
  X,
  Users,
  Lock,
  Globe,
  Image,
  MapPin,
  Tag,
} from 'lucide-react';
import { motion } from 'motion/react';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { success, error: toastError } = useToast();
  const campuses = StorageService.getCampuses();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<CommunityCategory>('tech');
  const [campusId, setCampusId] = useState(currentUser?.campusId || campuses[0]?.id || 'campus-osogbo');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'
  );
  const [rulesInput, setRulesInput] = useState('Be respectful to all peers, No spam, Post relevant content');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toastError('Please provide a community name.');
      return;
    }
    if (!description.trim() || description.length < 15) {
      toastError('Please describe the purpose of the community (at least 15 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const rules = rulesInput
        .split(',')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      StorageService.createCommunity({
        creatorId: currentUser.id,
        creatorName: currentUser.fullName,
        creatorAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        campusId,
        universityId: currentUser.universityId || 'uni-uniosun',
        name: name.trim(),
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description.trim(),
        category,
        privacy,
        icon: '👥',
        coverImage: coverImage.trim(),
        avatarImage: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        rules: rules.length > 0 ? rules : ['Be respectful to peers'],
        moderators: [currentUser.id],
        verified: false,
      });

      success('Student community created successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toastError(err.message || 'Failed to create community.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-base">Launch a Student Community</h2>
              <p className="text-[11px] text-slate-500">Create a hub for your department, hostel, or interest group</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Community Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. UNIOSUN Computer Science Guild (COSSA)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CommunityCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium outline-none focus:border-indigo-500"
              >
                <option value="tech">Tech & Developers</option>
                <option value="academic">Academic & Study</option>
                <option value="hostel">Hostel & Living</option>
                <option value="creative">Creative & Arts</option>
                <option value="gaming">Gaming & Esports</option>
                <option value="sports">Sports & Fitness</option>
                <option value="general">General Campus Life</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Campus *
              </label>
              <select
                value={campusId}
                onChange={(e) => setCampusId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium outline-none focus:border-indigo-500"
              >
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Privacy
              </label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value as 'public' | 'private')}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium outline-none focus:border-indigo-500"
              >
                <option value="public">Public (Anyone can join)</option>
                <option value="private">Private (Approval required)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description & Purpose *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the goals of this community, upcoming projects, study groups..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Community Rules (comma-separated)
            </label>
            <input
              type="text"
              value={rulesInput}
              onChange={(e) => setRulesInput(e.target.value)}
              placeholder="e.g. No advertising without permission, Keep discussions civil"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Community'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { StudentCommunity, PollOption } from '../../types';
import {
  X,
  Send,
  Image,
  BarChart2,
  AlertCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';

interface CreatePostModalProps {
  community: StudentCommunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  community,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [postType, setPostType] = useState<'text' | 'image' | 'poll' | 'announcement'>('text');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2']);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !community || !currentUser) return null;

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
    }
  };

  const handlePollOptionChange = (index: number, val: string) => {
    const updated = [...pollOptions];
    updated[index] = val;
    setPollOptions(updated);
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toastError('Please write some post content.');
      return;
    }

    setSubmitting(true);
    try {
      const pollOptionsMapped: PollOption[] | undefined =
        postType === 'poll' && pollQuestion.trim()
          ? pollOptions
              .filter((opt) => opt.trim().length > 0)
              .map((opt, idx) => ({
                id: `opt-${idx}`,
                text: opt.trim(),
                votes: [],
              }))
          : undefined;

      const isAnnouncement = postType === 'announcement';

      StorageService.createCommunityPost({
        communityId: community.id,
        communityName: community.name,
        authorId: currentUser.id,
        authorName: currentUser.fullName,
        authorAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        authorDepartment: currentUser.department,
        authorLevel: currentUser.level,
        authorBadge: currentUser.verificationBadge || undefined,
        title: isAnnouncement ? `Announcement: ${content.trim().slice(0, 40)}` : (pollQuestion || content.trim().slice(0, 40)),
        postType,
        content: content.trim(),
        images: imageUrl.trim() ? [imageUrl.trim()] : undefined,
        pollOptions: pollOptionsMapped,
        isPinned: isAnnouncement,
      });

      success('Post published to community!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toastError(err.message || 'Failed to publish post.');
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
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="font-black text-slate-900 text-base">Create Community Post</h2>
            <p className="text-[11px] text-slate-500">Posting in {community.name}</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Post Type Selector */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setPostType('text')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                postType === 'text' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
              }`}
            >
              Discussion
            </button>
            <button
              type="button"
              onClick={() => setPostType('image')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                postType === 'image' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
              }`}
            >
              Photo
            </button>
            <button
              type="button"
              onClick={() => setPostType('poll')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                postType === 'poll' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
              }`}
            >
              Poll
            </button>
            <button
              type="button"
              onClick={() => setPostType('announcement')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                postType === 'announcement' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'
              }`}
            >
              Announcement
            </button>
          </div>

          {/* Post Content */}
          <div>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Share study tips, project queries, questions..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-indigo-500 text-sm outline-none"
            />
          </div>

          {/* Optional Image */}
          {postType === 'image' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Poll Builder */}
          {postType === 'poll' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Poll Question *
              </label>
              <input
                type="text"
                required
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="e.g. Which programming language should we learn next?"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-500"
              />

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Poll Options (2-5)
              </label>
              {pollOptions.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handlePollOptionChange(i, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs outline-none"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePollOption(i)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {pollOptions.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Option
                </button>
              )}
            </div>
          )}

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
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Posting...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

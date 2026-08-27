import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storageService';
import { Order, Review } from '../../types';
import {
  Star,
  X,
  ShieldCheck,
  CheckCircle2,
  Heart,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ReviewModalProps {
  order?: Order | null;
  targetUserId?: string;
  targetUserName?: string;
  onClose: () => void;
  onSuccess?: (review: Review) => void;
}

const REVIEW_TAGS = [
  'Accurate Condition',
  'Punctual Meetup',
  'Polite Communication',
  'Great Value for Price',
  'Recommended Student',
  'Fast Response',
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  order,
  targetUserId,
  targetUserName,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();

  const reviewedId = targetUserId || (order ? order.sellerId : '');
  const reviewedName = targetUserName || (order ? order.sellerName : 'Student');

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser || !reviewedId) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showError('Please write a brief comment describing your experience');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const fullComment = selectedTags.length > 0
        ? `${comment.trim()} [Tags: ${selectedTags.join(', ')}]`
        : comment.trim();

      const newReview = StorageService.createReview({
        orderId: order?.id,
        orderNumber: order?.orderNumber,
        reviewerId: currentUser.id,
        reviewerName: currentUser.fullName,
        reviewerAvatar: currentUser.avatarUrl,
        reviewedUserId: reviewedId,
        rating,
        comment: fullComment,
      });

      setIsSubmitting(false);
      success(`Review submitted! Thank you for helping build trust in the campus community.`);
      if (onSuccess) onSuccess(newReview);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative"
      >
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Leave a Student Review</h2>
              <span className="text-xs text-slate-500">Rate your experience with {reviewedName}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
          >
            &times;
          </button>
        </div>

        {order && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 mb-4 flex items-center gap-3">
            <img
              src={order.productImage}
              alt={order.productTitle}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="font-bold text-slate-900 truncate block">{order.productTitle}</span>
              <span className="text-[11px] text-slate-500">Order #{order.orderNumber}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Selector */}
          <div className="text-center py-2">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Overall Rating
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                return (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 text-2xl focus:outline-none transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-extrabold text-slate-700 mt-1 block">
              {rating === 5 && 'Outstanding & Highly Recommended!'}
              {rating === 4 && 'Very Good / Satisfactory'}
              {rating === 3 && 'Average Experience'}
              {rating === 2 && 'Below Expectations'}
              {rating === 1 && 'Poor Experience'}
            </span>
          </div>

          {/* Quick Compliment Tags */}
          <div>
            <span className="block text-xs font-bold text-slate-700 mb-1.5">Highlight Positives</span>
            <div className="flex flex-wrap gap-1.5">
              {REVIEW_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Detailed Feedback</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Share details about your transaction, punctuality, and the product quality...`}
              rows={3}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Star className="w-4 h-4 fill-white" />
            Submit Verified Review
          </button>
        </form>
      </motion.div>
    </div>
  );
};

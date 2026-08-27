import React from 'react';
import { Review } from '../../types';
import { Star, ShieldCheck, User, MessageSquare } from 'lucide-react';

interface ReviewsListProps {
  reviews: Review[];
  title?: string;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, title = 'Verified Student Reviews' }) => {
  if (reviews.length === 0) {
    return (
      <div className="py-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
        <MessageSquare className="w-6 h-6 mx-auto mb-1 text-slate-300" />
        <span>No reviews yet for this student.</span>
      </div>
    );
  }

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          {title} ({reviews.length})
        </h4>
        <span className="text-xs font-extrabold text-slate-900">
          ★ {averageRating} / 5.0
        </span>
      </div>

      <div className="space-y-2.5">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-2xl text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={
                    rev.reviewerAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'
                  }
                  alt={rev.reviewerName}
                  className="w-6 h-6 rounded-full object-cover border border-slate-200"
                />
                <span className="font-bold text-slate-900">{rev.reviewerName}</span>
                {rev.orderNumber && (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full font-semibold border border-emerald-100">
                    Verified Purchase
                  </span>
                )}
              </div>

              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed">{rev.comment}</p>

            <span className="text-[10px] text-slate-400 block pt-0.5">
              {new Date(rev.createdAt).toLocaleDateString('en-NG', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

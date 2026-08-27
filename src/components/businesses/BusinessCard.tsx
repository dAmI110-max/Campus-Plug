import React from 'react';
import { BusinessProfile } from '../../types';
import {
  Building2,
  MapPin,
  Star,
  Phone,
  Clock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface BusinessCardProps {
  business: BusinessProfile;
  isFollowing: boolean;
  onSelect: (business: BusinessProfile) => void;
  onToggleFollow: (business: BusinessProfile) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  isFollowing,
  onSelect,
  onToggleFollow,
}) => {
  return (
    <div
      id={`biz-card-${business.id}`}
      onClick={() => onSelect(business)}
      className="group bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Cover */}
      <div className="relative aspect-[16/7] bg-slate-900 overflow-hidden">
        <img
          src={business.banner || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'}
          alt={business.businessName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-slate-800 shadow-sm backdrop-blur-sm uppercase">
            {business.category}
          </span>
        </div>

        {/* Rating on cover */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{business.rating.toFixed(1)}</span>
        </div>

        {/* Logo overlay */}
        <div className="absolute -bottom-3 left-4">
          <img
            src={business.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80'}
            alt={business.businessName}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-black text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
              {business.businessName}
            </h3>
            {business.status === 'verified' && (
              <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
            )}
          </div>

          <p className="text-xs text-slate-500 italic mt-0.5 line-clamp-1">
            "{business.tagline || 'Student favorite business near campus'}"
          </p>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2">
            {business.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500 truncate max-w-[170px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{business.address}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFollow(business);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isFollowing
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>
    </div>
  );
};

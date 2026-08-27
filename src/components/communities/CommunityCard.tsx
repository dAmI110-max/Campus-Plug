import React from 'react';
import { StudentCommunity } from '../../types';
import {
  Users,
  Lock,
  Globe,
  MapPin,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface CommunityCardProps {
  community: StudentCommunity;
  isMember: boolean;
  onSelect: (community: StudentCommunity) => void;
  onToggleJoin: (community: StudentCommunity) => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  isMember,
  onSelect,
  onToggleJoin,
}) => {
  return (
    <div
      id={`community-card-${community.id}`}
      onClick={() => onSelect(community)}
      className="group bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Cover */}
      <div className="relative aspect-[16/7] bg-slate-900 overflow-hidden">
        <img
          src={community.coverImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'}
          alt={community.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/20 to-transparent" />

        {/* Category */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-slate-800 shadow-sm backdrop-blur-sm uppercase">
            {community.category}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/40 text-white backdrop-blur-sm flex items-center gap-1">
            {community.privacy === 'private' ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
            {(community.privacy || 'PUBLIC').toUpperCase()}
          </span>
        </div>

        {/* Avatar positioned over cover */}
        <div className="absolute -bottom-3 left-4">
          <img
            src={community.avatarImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt={community.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 pt-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1">
            <h3 className="font-black text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
              {community.name}
            </h3>
            {community.verified && (
              <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
            )}
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1.5">
            {community.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <strong>{community.memberCount}</strong> members
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleJoin(community);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isMember
                ? 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isMember ? 'Joined' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  );
};

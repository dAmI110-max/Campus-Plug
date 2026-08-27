import React from 'react';
import { CampusEvent } from '../../types';
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface EventCardProps {
  event: CampusEvent;
  onSelect: (event: CampusEvent) => void;
  onBuyTicket: (event: CampusEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect, onBuyTicket }) => {
  const isFree = !event.isPaid || event.ticketPrice === 0;

  return (
    <div
      id={`event-card-${event.id}`}
      onClick={() => onSelect(event)}
      className="group bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
    >
      {/* Banner */}
      <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
        <img
          src={event.bannerImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'}
          alt={event.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/20 to-transparent" />

        {/* Category & Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-slate-800 shadow-sm backdrop-blur-sm">
            {(event.category || 'EVENT').replace('_', ' ').toUpperCase()}
          </span>
          {event.featured && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" /> Trending
            </span>
          )}
        </div>

        {/* Free / Price badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black shadow-md uppercase tracking-wider ${
              isFree ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
            }`}
          >
            {isFree ? 'Free Entry' : `₦${event.ticketPrice.toLocaleString()}`}
          </span>
        </div>

        {/* Date on banner bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl font-bold">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{event.date}</span>
            <span className="text-slate-300 text-[11px]">@ {event.time}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-slate-200 text-xs">
            <Users className="w-3 h-3 text-indigo-400" />
            <span>{event.attendeesCount || 0} attending</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span className="font-medium">{event.organizerName}</span>
          </div>

          <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors mb-2">
            {event.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500 truncate max-w-[170px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyTicket(event);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
          >
            <Ticket className="w-3.5 h-3.5" />
            {isFree ? 'Get Free Ticket' : 'Buy Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
};

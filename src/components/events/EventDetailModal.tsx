import React from 'react';
import { CampusEvent } from '../../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  DollarSign,
  Share2,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';

interface EventDetailModalProps {
  event: CampusEvent | null;
  onClose: () => void;
  onBuyTicket: (event: CampusEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onBuyTicket,
}) => {
  if (!event) return null;

  const isFree = !event.isPaid || event.ticketPrice === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Banner */}
        <div className="relative aspect-[16/8] bg-slate-900 overflow-hidden">
          <img
            src={event.bannerImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white inline-block mb-1">
              {(event.category || 'EVENT').replace('_', ' ').toUpperCase()}
            </span>
            <h1 className="text-xl sm:text-2xl font-black">{event.title}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Key metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Date</span>
              <span className="font-black text-slate-900 text-sm">{event.date}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Time</span>
              <span className="font-semibold text-slate-900">{event.time}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Venue</span>
              <span className="font-semibold text-slate-900 truncate block">{event.venue}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Pass Price</span>
              <span className="font-black text-indigo-600 text-sm">
                {isFree ? 'Free Entry' : `₦${event.ticketPrice.toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="flex items-center gap-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
              {event.organizerName.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Organized by</span>
              <h4 className="font-bold text-slate-900 text-xs">{event.organizerName}</h4>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Event Details & Schedule
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              {event.description}
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Attendance</span>
            <span className="text-xs font-bold text-slate-700">
              {event.attendeesCount || 0} students registered
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBuyTicket(event);
              }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Ticket className="w-4 h-4" />
              {isFree ? 'Claim Free Entry Pass' : `Buy Ticket (₦${event.ticketPrice.toLocaleString()})`}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

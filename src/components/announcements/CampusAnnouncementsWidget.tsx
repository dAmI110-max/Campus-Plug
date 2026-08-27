import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { CampusAnnouncement } from '../../types';
import {
  BellRing,
  AlertTriangle,
  Info,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CampusAnnouncementsWidgetProps {
  campusId?: string;
}

export const CampusAnnouncementsWidget: React.FC<CampusAnnouncementsWidgetProps> = ({
  campusId,
}) => {
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [expandedItem, setExpandedItem] = useState<CampusAnnouncement | null>(null);

  useEffect(() => {
    const list = StorageService.getAnnouncements(campusId);
    setAnnouncements(list);
  }, [campusId]);

  if (announcements.length === 0 || dismissed) return null;

  const current = announcements[currentIndex % announcements.length];

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white';
      case 'high':
        return 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white';
      default:
        return 'bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white';
    }
  };

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 p-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 ${getPriorityStyle(
          current.priority
        )}`}
      >
        <div
          onClick={() => setExpandedItem(current)}
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            {current.priority === 'urgent' ? (
              <AlertTriangle className="w-4 h-4 text-amber-300 animate-bounce" />
            ) : (
              <BellRing className="w-4 h-4 text-indigo-300" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
                {((current as any).type || current.category || current.priority || 'NOTICE').toUpperCase()}
              </span>
              <span className="text-xs font-black truncate">{current.title}</span>
            </div>
            <p className="text-[11px] text-white/85 truncate mt-0.5">{current.content}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setExpandedItem(current)}
            className="text-[11px] font-bold underline text-white/90 hover:text-white"
          >
            Read
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Announcement Dialog */}
      <AnimatePresence>
        {expandedItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                    Official Campus Notice
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-2">
                    {expandedItem.title}
                  </h2>
                </div>
                <button
                  onClick={() => setExpandedItem(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {expandedItem.content}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>Priority: {(expandedItem.priority || 'NORMAL').toUpperCase()}</span>
                <span>Published: {new Date(expandedItem.createdAt).toLocaleDateString()}</span>
              </div>

              <button
                onClick={() => setExpandedItem(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs"
              >
                Understood & Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

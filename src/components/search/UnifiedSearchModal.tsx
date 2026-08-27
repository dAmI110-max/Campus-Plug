import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { UnifiedSearchResult, AppViewMode } from '../../types';
import {
  Search,
  X,
  ShoppingBag,
  Home,
  Wrench,
  Briefcase,
  Calendar,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UnifiedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView: (view: AppViewMode, itemId?: string) => void;
  campusId?: string;
}

export const UnifiedSearchModal: React.FC<UnifiedSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToView,
  campusId,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UnifiedSearchResult | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults(null);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(() => {
      const res = StorageService.searchAll(query.trim(), campusId);
      setResults(res);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, campusId]);

  if (!isOpen) return null;

  const totalResultsCount = results
    ? results.products.length +
      results.accommodations.length +
      results.services.length +
      results.jobs.length +
      results.events.length +
      results.communities.length +
      results.businesses.length
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 pt-10 sm:pt-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, services, jobs, events, hostels, communities, stores..."
            className="flex-1 bg-transparent text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {!query.trim() ? (
            <div className="text-center py-10 space-y-2 text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto text-indigo-400" />
              <p className="text-xs font-bold text-slate-700">Unified Omni-Search 3.0</p>
              <p className="text-xs max-w-sm mx-auto">
                Type anything to search products, campus freelance services, jobs, events, hostelled rooms, and student communities.
              </p>
            </div>
          ) : totalResultsCount === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No matching records found for "<strong>{query}</strong>".
            </div>
          ) : (
            <div className="space-y-5">
              {/* Products */}
              {results && results.products.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <ShoppingBag className="w-3.5 h-3.5 text-indigo-500" />
                    Marketplace Products ({results.products.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.products.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onClose();
                          onNavigateToView('marketplace');
                        }}
                        className="p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs truncate">{p.title}</h4>
                            <span className="text-[11px] font-black text-indigo-600">
                              ₦{p.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {results && results.services.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Wrench className="w-3.5 h-3.5 text-emerald-500" />
                    Freelance Services ({results.services.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.services.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onClose();
                          onNavigateToView('services');
                        }}
                        className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={s.images[0]}
                            alt={s.title}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs truncate">{s.title}</h4>
                            <span className="text-[11px] font-black text-emerald-600">
                              From ₦{s.startingPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jobs */}
              {results && results.jobs.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                    Campus Jobs & Gigs ({results.jobs.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.jobs.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => {
                          onClose();
                          onNavigateToView('jobs');
                        }}
                        className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{j.title}</h4>
                          <span className="text-[11px] text-slate-500">
                            {j.companyName} • ₦{j.salary.toLocaleString()}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {results && results.events.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    Campus Events ({results.events.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.events.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => {
                          onClose();
                          onNavigateToView('events');
                        }}
                        className="p-3 bg-slate-50 hover:bg-purple-50/50 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{e.title}</h4>
                          <span className="text-[11px] text-slate-500">
                            {e.date} • {e.venue}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Communities */}
              {results && results.communities.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5 text-pink-500" />
                    Student Communities ({results.communities.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.communities.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onClose();
                          onNavigateToView('communities');
                        }}
                        className="p-3 bg-slate-50 hover:bg-pink-50/50 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{c.name}</h4>
                          <span className="text-[11px] text-slate-500">{c.memberCount} members</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Local Businesses */}
              {results && results.businesses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5 text-amber-500" />
                    Campus Businesses & Stores ({results.businesses.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.businesses.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          onClose();
                          onNavigateToView('businesses');
                        }}
                        className="p-3 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{b.businessName}</h4>
                          <span className="text-[11px] text-slate-500">{b.address}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { UnifiedSearchResult, AppViewMode, SearchVertical } from '../../types';
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
import { motion } from 'motion/react';

interface UnifiedSearchModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onNavigateToView?: (view: AppViewMode, itemId?: string) => void;
  onNavigate?: (view: any) => void;
  onSelectProduct?: (p: any) => void;
  onSelectAccommodation?: (a: any) => void;
  campusId?: string;
}

export const UnifiedSearchModal: React.FC<UnifiedSearchModalProps> = ({
  isOpen = true,
  onClose,
  onNavigateToView,
  onNavigate,
  onSelectProduct,
  onSelectAccommodation,
  campusId,
}) => {
  const handleNavigate = (view: AppViewMode, itemId?: string, payload?: any) => {
    onClose();
    if (view === 'marketplace' && payload && onSelectProduct) {
      onSelectProduct(payload);
      return;
    }
    if (view === 'accommodation' && payload && onSelectAccommodation) {
      onSelectAccommodation(payload);
      return;
    }
    if (onNavigateToView) {
      onNavigateToView(view, itemId);
    } else if (onNavigate) {
      onNavigate(view);
    }
  };
  const [query, setQuery] = useState('');
  const [activeVertical, setActiveVertical] = useState<SearchVertical>('all');
  const [results, setResults] = useState<UnifiedSearchResult[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setActiveVertical('all');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const res = StorageService.searchAll(query.trim(), activeVertical, campusId);
      setResults(res || []);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, activeVertical, campusId]);

  if (!isOpen) return null;

  const products = results.filter((r) => r.type === 'products');
  const services = results.filter((r) => r.type === 'services');
  const jobs = results.filter((r) => r.type === 'jobs');
  const events = results.filter((r) => r.type === 'events');
  const communities = results.filter((r) => r.type === 'communities');
  const businesses = results.filter((r) => r.type === 'businesses');
  const accommodation = results.filter((r) => r.type === 'accommodation');

  const totalResultsCount = results.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 pt-10 sm:pt-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, services, jobs, events, hostels, communities, stores..."
            className="flex-1 bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {!query.trim() ? (
            <div className="text-center py-10 space-y-2 text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto text-indigo-400" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Unified Omni-Search 3.0</p>
              <p className="text-xs max-w-sm mx-auto dark:text-slate-400">
                Type anything to search products, campus freelance services, jobs, events, hostelled rooms, and student communities.
              </p>
            </div>
          ) : totalResultsCount === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs dark:text-slate-400">
              No matching records found for "<strong>{query}</strong>".
            </div>
          ) : (
            <div className="space-y-5">
              {/* Products */}
              {products.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <ShoppingBag className="w-3.5 h-3.5 text-indigo-500" />
                    Marketplace Products ({products.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleNavigate('marketplace', p.id, p.linkPayload || p)}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.title}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600">
                              <ShoppingBag className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{p.title}</h4>
                            {p.price !== undefined && (
                              <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400">
                                ₦{p.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {services.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Wrench className="w-3.5 h-3.5 text-emerald-500" />
                    Freelance Services ({services.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {services.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleNavigate('services', s.id, s.linkPayload || s)}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {s.image ? (
                            <img
                              src={s.image}
                              alt={s.title}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600">
                              <Wrench className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{s.title}</h4>
                            {s.price !== undefined && (
                              <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                                From ₦{s.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jobs */}
              {jobs.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                    Campus Jobs & Gigs ({jobs.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {jobs.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => handleNavigate('jobs', j.id, j.linkPayload || j)}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{j.title}</h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{j.subtitle}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {events.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    Campus Events ({events.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {events.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => handleNavigate('events', e.id, e.linkPayload || e)}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{e.title}</h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{e.subtitle}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accommodations */}
              {accommodation.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Home className="w-3.5 h-3.5 text-teal-500" />
                    Accommodations & Hostels ({accommodation.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {accommodation.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => handleNavigate('accommodation', a.id, a.linkPayload || a)}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{a.title}</h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{a.subtitle}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Communities */}
              {communities.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5 text-pink-500" />
                    Student Communities ({communities.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {communities.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleNavigate('communities', c.id, c.linkPayload || c)}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-pink-50/50 dark:hover:bg-pink-950/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{c.title}</h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{c.subtitle}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Local Businesses */}
              {businesses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5 text-amber-500" />
                    Campus Businesses & Stores ({businesses.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {businesses.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => handleNavigate('businesses', b.id, b.linkPayload || b)}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{b.title}</h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{b.subtitle}</span>
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

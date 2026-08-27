import React, { useState } from 'react';
import { Search, ShoppingBag, Plus, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenCreateProduct: () => void;
  onExploreMarketplace: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onSelectCategory,
  onOpenCreateProduct,
  onExploreMarketplace,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    } else {
      onExploreMarketplace();
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-900 text-white pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-indigo-500/15 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
        {/* Campus Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold backdrop-blur-xs"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
          The Official UNIOSUN Student Marketplace & Hostels Hub
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white"
        >
          Everything UNIOSUN Students Need, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-300 via-indigo-200 to-white bg-clip-text text-transparent">
            All in One Campus Plug.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Buy and sell electronics, phones, textbooks, appliances, and find student accommodation across Osogbo, Ikire, Okuku, Ejigbo, Ifetedo & Ipetu-Ijesha campuses.
        </motion.p>

        {/* Hero Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-2 max-w-2xl mx-auto"
        >
          <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-2xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-4.5 top-4 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="What are you looking for today? (e.g. iPhone, Laptop, Hostel, Fan...)"
              className="w-full pl-12 pr-28 sm:pr-36 py-3.5 sm:py-4 bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl sm:rounded-3xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-4 focus:ring-indigo-500/30"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-4 sm:px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4 hidden sm:inline" />
            </button>
          </form>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">Popular:</span>
            <button
              type="button"
              onClick={() => onSelectCategory('cat-phones')}
              className="hover:text-indigo-300 underline underline-offset-2 transition-colors"
            >
              Smartphones
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onSelectCategory('cat-laptops')}
              className="hover:text-indigo-300 underline underline-offset-2 transition-colors"
            >
              Laptops & MacBooks
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onSelectCategory('cat-hostels')}
              className="hover:text-indigo-300 underline underline-offset-2 transition-colors"
            >
              Self-Contain Lodges
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onSelectCategory('cat-books')}
              className="hover:text-indigo-300 underline underline-offset-2 transition-colors"
            >
              Faculty Textbooks
            </button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-4 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={onExploreMarketplace}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl backdrop-blur-xs border border-white/15 transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
            Browse Marketplace
          </button>

          <button
            onClick={onOpenCreateProduct}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Sell An Item Now
          </button>
        </motion.div>

        {/* Platform Trust Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 mt-8 border-t border-white/10 text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">₦0 Listing Fees</div>
              <div className="text-[11px] text-slate-400">100% free for students</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Anti-Scam Protection</div>
              <div className="text-[11px] text-slate-400">Safety guidance & verified tags</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Direct WhatsApp Chat</div>
              <div className="text-[11px] text-slate-400">No middleman commissions</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">All 6 Campuses</div>
              <div className="text-[11px] text-slate-400">Osogbo, Ikire, Okuku & more</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

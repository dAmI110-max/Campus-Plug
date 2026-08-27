import React from 'react';
import { ShieldCheck, Mail, MapPin, Sparkles } from 'lucide-react';
import { CampusPlugLogo } from './CampusPlugLogo';

interface FooterProps {
  onNavigate?: (tab: string) => void;
  onOpenSafety?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSafety }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <CampusPlugLogo variant="full" theme="dark" size="md" />
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The centralized student marketplace and campus digital ecosystem for Osun State University (UNIOSUN).
              Discover affordable gear, buy from peers, find vetted student hostels, order services, and sell with zero hassle.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href="mailto:cplugsupport@gmail.com" className="hover:text-indigo-400 transition-colors">
                  cplugsupport@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Osun State University (UNIOSUN) — All 6 Campuses</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate?.('marketplace')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('marketplace')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Phones & Gadgets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('marketplace')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Laptops & Computing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('marketplace')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Textbooks & Past Qs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('marketplace')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Fashion & Footwear
                </button>
              </li>
            </ul>
          </div>

          {/* UNIOSUN Campuses */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Campuses</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Osogbo Main Campus
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Ikire Campus
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Ejigbo Campus
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Ifetedo Campus
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Ipetu-Ijesha Campus
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Okuku Campus
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Trust & Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={onOpenSafety}
                  className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-400" /> Safety Rules
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('accommodation')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Hostels & Lodges
                </button>
              </li>
              <li>
                <span className="text-slate-500 text-xs block">
                  Phase 1 MVP Architecture — Built for national university expansion.
                </span>
              </li>
              <li className="pt-2">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1 font-bold text-indigo-400 mb-1">
                    <Sparkles className="w-3 h-3" /> Ace Tech Guarantee
                  </span>
                  Zero listing fees for students in Phase 1 MVP.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} CampusPlug. Developed by <strong className="text-slate-400">Ace Tech</strong>. All rights reserved.
          </div>
          <div className="text-[11px] text-slate-500 text-center sm:text-right max-w-md">
            CampusPlug connects student buyers and sellers directly. Always inspect items in daylight within campus gates.
          </div>
        </div>
      </div>
    </footer>
  );
};

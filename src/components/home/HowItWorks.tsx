import React from 'react';
import { Search, MessageCircle, ShieldCheck, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onOpenCreateProduct: () => void;
  onExploreMarketplace: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onOpenCreateProduct,
  onExploreMarketplace,
}) => {
  const steps = [
    {
      number: '01',
      title: 'Discover or List an Item',
      description:
        'Browse phones, study lamps, laptops, and textbooks or list what you don’t need in under 60 seconds with zero charges.',
      icon: Search,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      number: '02',
      title: 'Chat Direct on WhatsApp',
      description:
        'Connect directly with the student seller or hostel caretaker without any platform fee or middlemen commission.',
      icon: MessageCircle,
      color: 'bg-teal-100 text-teal-700',
    },
    {
      number: '03',
      title: 'Inspect & Pay On Campus',
      description:
        'Meet at popular campus landmarks (Student Union Building or Main Gate). Inspect the item physically before paying.',
      icon: ShieldCheck,
      color: 'bg-sky-100 text-sky-700',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
            Simple, Safe & Direct
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            How CampusPlug Works for UNIOSUN
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
            Designed specifically for student life, trade, and accommodation across all Osun State University campuses.
          </p>
        </div>

        {/* 3 Step Cards in Bento style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-200 group-hover:text-indigo-600 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bento CTA Bar */}
        <div className="mt-10 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-[32px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-800/30">
          <div>
            <h3 className="text-xl sm:text-2xl font-black">Have things you no longer use?</h3>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 font-medium">
              Turn your old textbooks, gadgets, and hostels into quick cash or bookings right on campus.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onExploreMarketplace}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl backdrop-blur-xs transition-colors cursor-pointer"
            >
              Browse Items
            </button>
            <button
              onClick={onOpenCreateProduct}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Sell An Item</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

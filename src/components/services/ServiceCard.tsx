import React from 'react';
import { ServiceListing } from '../../types';
import {
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ServiceCardProps {
  service: ServiceListing;
  onSelect: (service: ServiceListing) => void;
  onRequestQuote: (service: ServiceListing) => void;
  onBook: (service: ServiceListing) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelect,
  onRequestQuote,
  onBook,
}) => {
  const isFixed = service.pricingModel === 'fixed';
  const isHourly = service.pricingModel === 'hourly';

  const pricingLabel = isFixed
    ? 'Fixed Price'
    : isHourly
    ? 'Per Hour'
    : service.pricingModel === 'starting_from'
    ? 'Starts from'
    : 'Custom Quote';

  return (
    <div
      id={`service-card-${service.id}`}
      onClick={() => onSelect(service)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
    >
      {/* Cover / Portfolio Image */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={service.portfolioImages[0] || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80'}
          alt={service.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/10" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-slate-800 shadow-sm backdrop-blur-sm">
            {service.categoryName}
          </span>
          {service.featured && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" /> Featured
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-600 text-white shadow-md uppercase tracking-wider">
            {pricingLabel}
          </span>
        </div>

        {/* Rating and completed stats on banner bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold">{service.providerRating.toFixed(1)}</span>
            <span className="text-slate-300 text-[10px]">({service.providerReviewCount})</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-slate-200">
            <Briefcase className="w-3 h-3 text-indigo-400" />
            <span className="font-medium">{service.providerCompletedJobs} orders done</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Provider Profile Header */}
          <div className="flex items-center gap-2.5 mb-2.5">
            <img
              src={service.providerAvatar}
              alt={service.providerName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {service.providerName}
                </span>
                {service.providerVerification && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 flex-shrink-0 text-slate-400" />
                {service.providerCampus}
              </p>
            </div>
          </div>

          {/* Service Title */}
          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors mb-2">
            {service.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Footer & Pricing */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium block">
              {isFixed ? 'Service Rate' : 'Starting From'}
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-black text-slate-900">
                ₦{service.startingPrice.toLocaleString()}
              </span>
              {isHourly && <span className="text-[11px] text-slate-500">/hr</span>}
            </div>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {service.pricingModel === 'custom_quote' ? (
              <button
                id={`req-quote-btn-${service.id}`}
                onClick={() => onRequestQuote(service)}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Request Quote
              </button>
            ) : (
              <button
                id={`book-service-btn-${service.id}`}
                onClick={() => onBook(service)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1"
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

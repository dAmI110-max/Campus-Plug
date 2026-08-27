import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs animate-pulse">
      <div className="w-full aspect-square bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 w-20 bg-slate-200 rounded-md" />
          <div className="h-3 w-12 bg-slate-200 rounded-md" />
        </div>
        <div className="h-4 w-full bg-slate-200 rounded-md" />
        <div className="h-4 w-3/4 bg-slate-200 rounded-md" />
        <div className="h-6 w-24 bg-slate-200 rounded-md pt-1" />
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200" />
          <div className="h-3 w-24 bg-slate-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const AccommodationCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs animate-pulse">
      <div className="w-full h-48 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 w-28 bg-slate-200 rounded-md" />
          <div className="h-4 w-16 bg-slate-200 rounded-md" />
        </div>
        <div className="h-5 w-full bg-slate-200 rounded-md" />
        <div className="h-3 w-3/4 bg-slate-200 rounded-md" />
        <div className="flex gap-2 pt-1">
          <div className="h-6 w-20 bg-slate-200 rounded-full" />
          <div className="h-6 w-24 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};

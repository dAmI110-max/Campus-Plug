import React from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

export const SafetyBanner: React.FC = () => {
  const { openModal } = useModal();

  return (
    <div className="bg-indigo-50/80 dark:bg-slate-900/80 border border-indigo-100/80 dark:border-slate-800 rounded-2xl py-2.5 px-4 shadow-2xs mb-2 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-950 dark:text-indigo-200 font-medium">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong>Campus Safety:</strong> Meet in designated campus zones (SUB, Library, Cafeteria). Never send advance unverified payments.
          </span>
        </div>
        <button
          onClick={() => openModal('safety_guidelines')}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold underline underline-offset-2 flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
        >
          Safety Guidelines <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { CampusJob } from '../../types';
import {
  X,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Users,
  CheckCircle2,
  Calendar,
  Share2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';

interface JobDetailModalProps {
  job: CampusJob | null;
  onClose: () => void;
  onApply: (job: CampusJob) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose, onApply }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                job.companyName.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm">{job.companyName}</h3>
                {job.verifiedEmployer && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
              </div>
              <span className="text-[11px] text-slate-500">{job.location}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Header Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                {(job.jobType || job.category || 'GIG').replace('_', ' ').toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {(job.category || 'GENERAL').replace('_', ' ').toUpperCase()}
              </span>
              {job.isRemote && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Remote Friendly
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {job.title}
            </h1>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Remuneration</span>
              <span className="font-black text-slate-900 text-sm">{job.salaryRate}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Applicants</span>
              <span className="font-black text-slate-900 text-sm">{job.applicantsCount || 0} students</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Deadline</span>
              <span className="font-semibold text-slate-900">{job.deadline || 'Rolling basis'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Campus</span>
              <span className="font-semibold text-slate-900">{job.location}</span>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Role Overview & Responsibilities
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              {job.description}
            </p>
          </div>

          {/* Requirements list */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Candidate Requirements
              </h3>
              <div className="space-y-1.5">
                {job.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Application Instructions */}
          {job.applicationInstructions && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-950">
              <span className="font-bold block mb-1">Application Notes from Employer:</span>
              <p>{job.applicationInstructions}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Posted {new Date(job.createdAt).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onApply(job);
              }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4" /> Apply for this Role
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

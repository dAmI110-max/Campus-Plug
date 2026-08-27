import React from 'react';
import { CampusJob } from '../../types';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Users,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface JobCardProps {
  job: CampusJob;
  onSelect: (job: CampusJob) => void;
  onApply: (job: CampusJob) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect, onApply }) => {
  const categoryLabels: Record<string, string> = {
    tutoring: 'Tutoring & Academic',
    tech_dev: 'Tech & Development',
    event_staff: 'Event Staff & Ushers',
    brand_ambassador: 'Brand Ambassador',
    campus_rep: 'Campus Representative',
    design_media: 'Design & Media',
    delivery: 'Delivery & Logistics',
    administrative: 'Office & Admin',
    research: 'Research Assistant',
    other: 'General Gig',
  };

  const typeLabels: Record<string, string> = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    gig: 'One-time Gig',
    internship: 'Student Internship',
    freelance: 'Freelance Task',
  };

  return (
    <div
      id={`job-card-${job.id}`}
      onClick={() => onSelect(job)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 p-5 flex flex-col justify-between cursor-pointer relative"
    >
      <div>
        {/* Header: Company & Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 font-black text-base">
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
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900">{job.companyName}</span>
                {job.verifiedEmployer && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {job.isRemote ? 'Remote / Online' : job.location}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {job.featured && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 fill-current" /> Featured
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">
              {job.jobType ? (typeLabels[job.jobType] || job.jobType) : (categoryLabels[job.category] || job.category || 'Gig')}
            </span>
          </div>
        </div>

        {/* Job Title */}
        <h3 className="font-black text-slate-900 text-base group-hover:text-indigo-600 transition-colors mb-2">
          {job.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {job.description}
        </p>

        {/* Tags / Requirements Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-medium">
            {categoryLabels[job.category] || job.category}
          </span>
          {job.requirements.slice(0, 2).map((req, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] truncate max-w-[150px]"
            >
              {req}
            </span>
          ))}
          {job.requirements.length > 2 && (
            <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded-lg text-[10px]">
              +{job.requirements.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Pay Rate</span>
          <span className="text-sm font-black text-slate-900">{job.salaryRate}</span>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Users className="w-3 h-3" /> {job.applicantsCount || 0} applied
          </span>
          <button
            onClick={() => onApply(job)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { StorageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { CampusJob, JobApplication, JobApplicationStatus } from '../../types';
import {
  X,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Link,
  MessageCircle,
  FileText,
} from 'lucide-react';
import { motion } from 'motion/react';

interface JobApplicationsModalProps {
  job: CampusJob | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onNavigateToChat?: (userId: string) => void;
}

export const JobApplicationsModal: React.FC<JobApplicationsModalProps> = ({
  job,
  isOpen,
  onClose,
  onRefresh,
  onNavigateToChat,
}) => {
  const { success, error: toastError } = useToast();

  if (!isOpen || !job) return null;

  const applications = StorageService.getJobApplications({ jobId: job.id });

  const handleUpdateStatus = (appId: string, status: JobApplicationStatus) => {
    try {
      StorageService.updateJobApplicationStatus(appId, status);
      success(`Candidate status updated to: ${status}`);
      onRefresh();
    } catch (err: any) {
      toastError(err.message || 'Failed to update status.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-base">Candidate Applications</h2>
              <p className="text-[11px] text-slate-500">
                {job.title} • {applications.length} applicants
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">No applications received yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Applicants from your campus will appear here in real time.
              </p>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4.5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.studentAvatar || app.applicantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                      alt={app.studentName || app.applicantName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{app.studentName || app.applicantName}</h4>
                      <p className="text-[11px] text-slate-500">
                        {app.studentDepartment || app.applicantDepartment || 'Student'} ({app.studentLevel || app.applicantLevel || '200L'}) • {app.studentPhone || app.applicantPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value as JobApplicationStatus)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border outline-none ${
                        app.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : app.status === 'shortlisted'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : app.status === 'interview'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : app.status === 'rejected'
                          ? 'bg-red-50 text-red-800 border-red-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="submitted">Submitted</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview">Interview</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    {onNavigateToChat && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToChat(app.studentId || app.applicantId || '');
                        }}
                        className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
                        title="Chat with applicant"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {app.coverMessage || app.coverNote}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {(app.skills || []).map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {(app.cvUrl || app.resumeUrl) && (
                      <a
                        href={app.cvUrl || app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> View CV
                      </a>
                    )}
                    {app.portfolioUrl && (
                      <a
                        href={app.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <Link className="w-3.5 h-3.5" /> Portfolio
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

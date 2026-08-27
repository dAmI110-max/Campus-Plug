import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { CampusEvent, EventTicket } from '../../types';
import {
  X,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  Scan,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

interface TicketScannerModalProps {
  event: CampusEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const TicketScannerModal: React.FC<TicketScannerModalProps> = ({
  event,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const { success, error: toastError } = useToast();
  const [ticketInput, setTicketInput] = useState('');
  const [lastScannedResult, setLastScannedResult] = useState<{
    status: 'success' | 'already_checked_in' | 'not_found';
    ticket?: EventTicket;
    message: string;
  } | null>(null);

  if (!isOpen || !event) return null;

  const handleVerifyTicket = (codeToVerify?: string) => {
    const code = (codeToVerify || ticketInput).trim();
    if (!code) {
      toastError('Please enter or scan a ticket code.');
      return;
    }

    const res = StorageService.validateAndCheckInTicket(event.id, code);

    if (res.status === 'success') {
      setLastScannedResult({
        status: 'success',
        ticket: res.ticket,
        message: `VALID PASS! Welcome ${res.ticket?.userName} to ${event.title}`,
      });
      success(`Checked in: ${res.ticket?.userName}`);
      setTicketInput('');
      onRefresh();
    } else if (res.status === 'already_checked_in') {
      setLastScannedResult({
        status: 'already_checked_in',
        ticket: res.ticket,
        message: `WARNING: This pass was ALREADY USED by ${res.ticket?.userName} on ${new Date(
          res.ticket?.checkedInAt || ''
        ).toLocaleTimeString()}! Duplicate entry prevented.`,
      });
      toastError('Duplicate entry! Ticket already scanned.');
    } else {
      setLastScannedResult({
        status: 'not_found',
        message: 'INVALID TICKET: No matching pass found for this event.',
      });
      toastError('Invalid ticket code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-base">Organizer Ticket Scanner</h2>
              <p className="text-[11px] text-slate-500">{event.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Scanner Simulation Box */}
          <div className="relative aspect-[16/9] bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-white p-4 border-2 border-indigo-500/30">
            {/* Animated Laser Scanning Line */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

            <QrCode className="w-16 h-16 text-indigo-400 opacity-80 mb-2" />
            <span className="text-xs font-bold tracking-wider text-slate-300">
              OPTICAL QR SCANNER ACTIVE
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              Aim camera at attendee's ticket or enter code below
            </span>
          </div>

          {/* Manual Input Form */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Enter Pass / Ticket Reference Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyTicket()}
                  placeholder="e.g. TKT-UNIOSUN-..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs uppercase outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={() => handleVerifyTicket()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Validate Pass
              </button>
            </div>
          </div>

          {/* Validation Result Box */}
          {lastScannedResult && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                lastScannedResult.status === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : lastScannedResult.status === 'already_checked_in'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {lastScannedResult.status === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block text-sm">
                    {lastScannedResult.status === 'success'
                      ? 'Access Granted ✓'
                      : lastScannedResult.status === 'already_checked_in'
                      ? 'Pass Already Used ⚠'
                      : 'Invalid Ticket ✕'}
                  </span>
                  <p className="mt-1">{lastScannedResult.message}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Demo Test Buttons */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
              Quick Test Organizer Simulation:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleVerifyTicket('TKT-UNIOSUN-001')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-mono"
              >
                Scan Ticket #001
              </button>
              <button
                type="button"
                onClick={() => handleVerifyTicket('TKT-UNIOSUN-002')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-mono"
              >
                Scan Ticket #002
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

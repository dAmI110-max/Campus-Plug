import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  ShieldCheck,
  Store,
  MapPin,
  Phone,
  CheckCircle2,
  ArrowRight,
  X,
  Lock,
  Building2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CampusPlugLogo } from '../common/CampusPlugLogo';

interface SellerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SellerOnboardingModal: React.FC<SellerOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser, completeSellerOnboarding } = useAuth();
  const { success, error: showError } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [sellerBio, setSellerBio] = useState(
    currentUser?.bio || 'UNIOSUN student vendor offering reliable study essentials, gadgets, and campus services.'
  );
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp || currentUser?.phone || '');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([
    'Oke-Baale Campus Gate',
    'Main SUB & Cafeteria',
  ]);

  const campusLocations = [
    'Oke-Baale Campus Gate',
    'Main SUB & Cafeteria',
    'University Library Foyer',
    'Faculty of Engineering Quad',
    'College of Health Sciences Block',
    'Ifetedo Law Auditorium',
    'Ikire Campus Gate & Hostels',
    'Ejigbo Agriculture Hub',
  ];

  const toggleLocation = (loc: string) => {
    if (selectedLocations.includes(loc)) {
      if (selectedLocations.length > 1) {
        setSelectedLocations(selectedLocations.filter((l) => l !== loc));
      } else {
        showError('Select at least one campus meetup location for buyer pickups.');
      }
    } else {
      setSelectedLocations([...selectedLocations, loc]);
    }
  };

  const handleFinish = async () => {
    if (!phone.trim()) {
      showError('Please provide a mobile contact number.');
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await completeSellerOnboarding({
        sellerBio,
        sellerPickupLocations: selectedLocations,
        phone,
        whatsapp: whatsapp || phone,
      });

      if (res.success) {
        success('Welcome to the CampusPlug Seller Network! You can now publish listings.');
        onSuccess();
        onClose();
      } else {
        showError(res.message || 'Failed to activate seller account.');
      }
    } catch {
      showError('An error occurred during seller onboarding.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <CampusPlugLogo variant="compact" theme="dark" size="sm" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Store className="w-6 h-6 text-amber-400" />
              Activate Seller Studio
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Start selling your gadgets, textbooks, hostels, and services to verified UNIOSUN students.
            </p>

            {/* Stepper Dots */}
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-8 bg-amber-400'
                      : s < step
                      ? 'w-4 bg-emerald-400'
                      : 'w-4 bg-slate-700'
                  }`}
                />
              ))}
              <span className="text-[11px] font-bold text-slate-400 ml-2">
                Step {step} of 3
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {step === 1 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-indigo-950">
                    <span className="font-bold block text-sm text-indigo-900 mb-0.5">
                      Verified Student Identity
                    </span>
                    Your seller account is tied directly to your active student profile at{' '}
                    <strong>{currentUser?.universityName || 'UNIOSUN'}</strong>.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Student Name
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {currentUser?.fullName}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Campus Center
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {currentUser?.campusName || 'Osogbo Main Campus'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Department / Level
                    </span>
                    <span className="font-bold text-slate-900">
                      {currentUser?.departmentName || 'General Studies'} ({currentUser?.level || '100L'})
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Account Status
                    </span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active Student
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <TrendingUp className="w-4 h-4" /> Why sell on CampusPlug?
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    <li>Direct access to thousands of verified UNIOSUN campus buyers</li>
                    <li>Built-in Escrow wallet for guaranteed payments upon delivery</li>
                    <li>Zero upfront setup fees or listing listing commissions</li>
                  </ul>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Seller Bio / Shop Pitch
                  </label>
                  <textarea
                    rows={2}
                    value={sellerBio}
                    onChange={(e) => setSellerBio(e.target.value)}
                    placeholder="Describe what you sell or offer to fellow students..."
                    className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-indigo-600" /> Phone Contact *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 08123456789"
                      className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="e.g. 2348123456789"
                      className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> Preferred Meetup / Pickup Locations
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Select the public spots on campus where you can hand over items to buyers:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {campusLocations.map((loc) => {
                      const isSelected = selectedLocations.includes(loc);
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => toggleLocation(loc)}
                          className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-50/80 border-indigo-300 text-indigo-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate">{loc}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                    <Lock className="w-4 h-4 text-amber-600" />
                    CampusPlug Escrow & Safety Pledge
                  </div>
                  <p className="text-xs text-amber-900/90 leading-relaxed">
                    By activating your seller account, you agree to:
                  </p>
                  <ul className="text-xs text-amber-950/80 space-y-1.5 list-disc list-inside">
                    <li>Only list genuine, working, and accurately described student items</li>
                    <li>Conduct all product viewings in safe, well-lit campus meetup zones</li>
                    <li>Accept Escrow orders securely via the CampusPlug Wallet</li>
                    <li>Never request direct wire transfers or advance off-platform deposits</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Instant Activation</div>
                    <div className="text-[11px] text-slate-500">
                      Your seller badge will be active immediately. You can start posting listings right away.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 2 && !phone.trim()) {
                    showError('Please enter a phone number to continue.');
                    return;
                  }
                  setStep((s) => (s + 1) as 1 | 2 | 3);
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-slate-900/20 transition-all"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Activating Seller Account...'
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Complete & Start Selling
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

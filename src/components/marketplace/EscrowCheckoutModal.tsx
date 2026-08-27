import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storageService';
import { Product, Order } from '../../types';
import {
  ShieldCheck,
  Lock,
  Wallet,
  CreditCard,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EscrowCheckoutModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: (order: Order) => void;
  onNavigateToWallet?: () => void;
}

export const EscrowCheckoutModal: React.FC<EscrowCheckoutModalProps> = ({
  product,
  onClose,
  onSuccess,
  onNavigateToWallet,
}) => {
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();

  const [deliveryCampus, setDeliveryCampus] = useState(product.sellerCampus || 'Osogbo (Main Campus)');
  const [deliveryLocation, setDeliveryLocation] = useState('Student Union Building (SUB)');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'direct_card'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!currentUser) return null;

  const wallet = StorageService.getWallet(currentUser.id);
  const settings = StorageService.getPlatformSettings();
  const hasEnoughWalletBalance = wallet.availableBalance >= product.price;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'wallet' && !hasEnoughWalletBalance) {
      showError('Insufficient wallet balance. Please fund your wallet or select Debit Card checkout.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // If direct card checkout, simulate funding wallet first then paying
      if (paymentMethod === 'direct_card') {
        StorageService.depositFunds(currentUser.id, product.price, 'paystack');
      }

      const res = StorageService.createOrder(
        currentUser.id,
        product.id,
        {
          campus: deliveryCampus,
          location: deliveryLocation,
          notes: deliveryNotes,
        },
        'wallet'
      );

      setIsProcessing(false);

      if (res.success && res.order) {
        success(`Order #${res.order.orderNumber} placed! Escrow funds are locked securely.`);
        onSuccess(res.order);
      } else {
        showError(res.message || 'Failed to create order');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">CampusPlug Escrow Checkout</h2>
              <span className="text-xs text-slate-500">100% Student Buyer Protection Guarantee</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
          >
            &times;
          </button>
        </div>

        {/* Product Card Summary */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-5 flex items-center gap-3">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'}
            alt={product.title}
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-sm text-slate-900 truncate">{product.title}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>Seller: {product.sellerName}</span>
              <span>&bull;</span>
              <span>{product.sellerCampus}</span>
            </div>
            <div className="text-base font-black text-indigo-600 mt-0.5">
              ₦{product.price.toLocaleString()}
            </div>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          {/* Meetup / Delivery Info */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              Pickup / Inspection Campus & Meetup Point
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <select
                value={deliveryCampus}
                onChange={(e) => setDeliveryCampus(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="Osogbo (Main Campus)">Osogbo (Main Campus)</option>
                <option value="Okuku Campus">Okuku Campus</option>
                <option value="Ikire Campus">Ikire Campus</option>
                <option value="Ejigbo Campus">Ejigbo Campus</option>
                <option value="Ifetedo Campus">Ifetedo Campus</option>
                <option value="Ipetu-Ijesha Campus">Ipetu-Ijesha Campus</option>
              </select>

              <select
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="Student Union Building (SUB)">Student Union Building (SUB)</option>
                <option value="Campus Main Gate / Security Post">Campus Main Gate</option>
                <option value="University Library">University Library</option>
                <option value="Central Cafeteria">Central Cafeteria</option>
                <option value="Faculty Lecture Theater">Faculty Lecture Theater</option>
                <option value="Hostel Area (Public Lounge)">Hostel Area (Public Lounge)</option>
              </select>
            </div>

            <input
              type="text"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="Specific meetup time or landmark (e.g. 2 PM after MAT101 lecture)"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Option 1: CampusPlug Wallet */}
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'wallet'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Wallet className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    Instant
                  </span>
                </div>
                <span className="block font-extrabold text-xs">CampusPlug Wallet</span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  Avail: ₦{wallet.availableBalance.toLocaleString()}
                </span>
              </button>

              {/* Option 2: Paystack Checkout */}
              <button
                type="button"
                onClick={() => setPaymentMethod('direct_card')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'direct_card'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Paystack
                  </span>
                </div>
                <span className="block font-extrabold text-xs">ATM Card / Transfer</span>
                <span className="block text-[11px] text-slate-500 mt-0.5">Direct checkout</span>
              </button>
            </div>

            {paymentMethod === 'wallet' && !hasEnoughWalletBalance && (
              <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                <span>Wallet balance is low (Need ₦{(product.price - wallet.availableBalance).toLocaleString()} more)</span>
                {onNavigateToWallet && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToWallet();
                    }}
                    className="font-bold text-indigo-700 underline"
                  >
                    Fund Wallet
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Escrow Fee & Price Breakdown */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span>Item Price:</span>
              <span className="font-bold text-slate-900">₦{product.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Escrow Buyer Protection:</span>
              <span className="font-bold text-emerald-600">FREE (Covered by CampusPlug)</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-900">
              <span>Total Escrow Deposit:</span>
              <span className="text-indigo-600 text-sm font-black">₦{product.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="text-[11px] text-slate-500 flex items-start gap-2 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
            <Lock className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              Your money remains held securely. The seller cannot claim payment until you test/inspect the item and confirm on your phone.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || (paymentMethod === 'wallet' && !hasEnoughWalletBalance)}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Securing Escrow Vault...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Lock ₦{product.price.toLocaleString()} in Escrow & Order
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

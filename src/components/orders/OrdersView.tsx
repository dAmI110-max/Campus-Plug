import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storageService';
import { Order, OrderStatus } from '../../types';
import {
  ShieldCheck,
  Package,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageCircle,
  Star,
  MapPin,
  ExternalLink,
  ChevronRight,
  Lock,
  RefreshCw,
  XCircle,
  HelpCircle,
  Truck,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrdersViewProps {
  onBack?: () => void;
  onOpenChatWithUser?: (targetUserId: string, orderId?: string, productId?: string) => void;
  onOpenReviewModal?: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  onBack,
  onOpenChatWithUser,
  onOpenReviewModal,
}) => {
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();

  const [activeTab, setActiveTab] = useState<'buyer' | 'seller' | 'all'>('buyer');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Modals
  const [showConfirmReleaseModal, setShowConfirmReleaseModal] = useState<Order | null>(null);
  const [showMarkDeliveredModal, setShowMarkDeliveredModal] = useState<Order | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState<Order | null>(null);

  // Form states
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [disputeReason, setDisputeReason] = useState('Item condition different from description');
  const [disputeDescription, setDisputeDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
        <p className="text-sm text-slate-600 mb-6">Log in to track your campus escrow orders and sales.</p>
      </div>
    );
  }

  const orders = StorageService.getOrders(currentUser.id, activeTab);

  const handleMarkDelivered = (order: Order) => {
    setIsProcessing(true);
    setTimeout(() => {
      const res = StorageService.markOrderDelivered(order.id, currentUser.id, deliveryNotes);
      setIsProcessing(false);
      if (res.success) {
        success('Order marked as delivered! Buyer notified to inspect and release payment.');
        setShowMarkDeliveredModal(null);
        setDeliveryNotes('');
      } else {
        showError(res.message || 'Action failed');
      }
    }, 600);
  };

  const handleReleaseEscrow = (order: Order) => {
    setIsProcessing(true);
    setTimeout(() => {
      const res = StorageService.confirmOrderReceivedAndReleaseEscrow(order.id, currentUser.id);
      setIsProcessing(false);
      if (res.success) {
        success(`Payment of ₦${order.sellerReceives.toLocaleString()} released to ${order.sellerName}'s wallet!`);
        setShowConfirmReleaseModal(null);
        if (onOpenReviewModal) {
          onOpenReviewModal(order);
        }
      } else {
        showError(res.message || 'Release failed');
      }
    }, 700);
  };

  const handleOpenDispute = (order: Order) => {
    if (!disputeDescription.trim()) {
      showError('Please explain the issue in detail');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const res = StorageService.openDispute(
        order.id,
        currentUser.id,
        disputeReason,
        disputeDescription,
        []
      );
      setIsProcessing(false);
      if (res.success) {
        success('Dispute opened. CampusPlug moderation has frozen funds and is reviewing.');
        setShowDisputeModal(null);
        setDisputeDescription('');
      } else {
        showError(res.message || 'Failed to open dispute');
      }
    }, 600);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'seller_processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            Seller Processing & Meetup
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            Delivered (Awaiting Buyer Confirmation)
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed & Funds Released
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Under Dispute Review
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            Cancelled / Refunded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Back Navigation Bar */}
      {onBack && (
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Back</span>
          </button>
          <span className="text-xs text-slate-400">/ Orders & Escrow</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Secure Campus Escrow Protocol
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Campus Orders & Escrow</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Your money is locked safely until you inspect the item in person and confirm delivery.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('buyer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'buyer'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Purchases ({StorageService.getOrders(currentUser.id, 'buyer').length})
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'seller'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Sales ({StorageService.getOrders(currentUser.id, 'seller').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Escrow Guarantee Banner */}
      <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-3xl p-4 sm:p-5 mb-8 flex items-start gap-3 text-xs text-indigo-950">
        <div className="w-8 h-8 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <span className="font-extrabold block text-sm mb-0.5">How CampusPlug Escrow Protects You:</span>
          <span>
            When an order is created, the payment is held in the neutral CampusPlug vault. The seller only receives the payout when the buyer confirms they received and inspected the item. If the item is damaged or never delivered, the buyer receives a 100% refund.
          </span>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-extrabold text-base text-slate-800">No {activeTab} orders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Browse the UNIOSUN marketplace to discover textbook deals, electronics, and fashion with Escrow protection.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isBuyer = order.buyerId === currentUser.id;
            const isSeller = order.sellerId === currentUser.id;

            return (
              <div
                key={order.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:border-indigo-200 transition-all flex flex-col gap-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('en-NG', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">{getStatusBadge(order.status)}</div>
                </div>

                {/* Main Order Content */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Product Details */}
                  <div className="flex items-center gap-4">
                    <img
                      src={order.productImage}
                      alt={order.productTitle}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 line-clamp-1">
                        {order.productTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                        <span className="font-extrabold text-slate-900 text-sm">
                          ₦{order.amount.toLocaleString()}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          {order.deliveryCampus} ({order.deliveryLocation})
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>{isBuyer ? `Seller: ${order.sellerName}` : `Buyer: ${order.buyerName}`}</span>
                        <span>&bull;</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Escrow: {(order.escrowStatus || 'HELD').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakdown / Payout */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-right sm:min-w-[170px] self-stretch sm:self-auto flex flex-col justify-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {isSeller ? 'Your Net Payout' : 'Total Escrow Held'}
                    </span>
                    <div className="text-lg font-black text-slate-900 mt-0.5">
                      ₦{(isSeller ? order.sellerReceives : order.amount).toLocaleString()}
                    </div>
                    {isSeller && (
                      <span className="text-[10px] text-slate-400">
                        (₦{order.platformFee} Platform fee deducted)
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress / Step Tracker */}
                <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-2">
                    <span className={order.status !== 'cancelled' ? 'text-indigo-600' : ''}>1. Escrow Funded</span>
                    <span className={order.status === 'delivered' || order.status === 'completed' ? 'text-indigo-600' : ''}>
                      2. Item Meetup / Dispatched
                    </span>
                    <span className={order.status === 'completed' ? 'text-emerald-600' : ''}>
                      3. Buyer Inspected & Released
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full bg-indigo-600 transition-all ${
                        order.status === 'seller_processing'
                          ? 'w-1/3'
                          : order.status === 'delivered'
                          ? 'w-2/3'
                          : order.status === 'completed'
                          ? 'w-full bg-emerald-600'
                          : 'w-full bg-rose-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Order Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {/* Chat with other party */}
                    {onOpenChatWithUser && (
                      <button
                        onClick={() =>
                          onOpenChatWithUser(
                            isBuyer ? order.sellerId : order.buyerId,
                            order.id,
                            order.productId
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-indigo-600" />
                        Chat with {isBuyer ? 'Seller' : 'Buyer'}
                      </button>
                    )}

                    {/* Dispute Button */}
                    {order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'disputed' && (
                      <button
                        onClick={() => setShowDisputeModal(order)}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Report Issue
                      </button>
                    )}
                  </div>

                  {/* Contextual Primary Action Button */}
                  <div className="flex items-center gap-2">
                    {/* Seller: Mark item delivered */}
                    {isSeller && order.status === 'seller_processing' && (
                      <button
                        onClick={() => setShowMarkDeliveredModal(order)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
                      >
                        <Truck className="w-4 h-4" />
                        Mark as Delivered / Ready
                      </button>
                    )}

                    {/* Buyer: Confirm Receipt & Release Escrow */}
                    {isBuyer && (order.status === 'delivered' || order.status === 'seller_processing') && (
                      <button
                        onClick={() => setShowConfirmReleaseModal(order)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Receipt & Release ₦{order.sellerReceives.toLocaleString()}
                      </button>
                    )}

                    {/* Review Button for completed order */}
                    {order.status === 'completed' && onOpenReviewModal && (
                      <button
                        onClick={() => onOpenReviewModal(order)}
                        className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        Rate Experience
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL: CONFIRM RECEIPT & RELEASE ESCROW --- */}
      <AnimatePresence>
        {showConfirmReleaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-black text-center text-slate-900 mb-1">
                Release Escrow to {showConfirmReleaseModal.sellerName}?
              </h3>
              <p className="text-xs text-center text-slate-500 mb-4">
                Please ensure you have thoroughly inspected "{showConfirmReleaseModal.productTitle}" in person. Once released, the payment of ₦{showConfirmReleaseModal.sellerReceives.toLocaleString()} is immediately credited to the seller's wallet.
              </p>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 mb-5 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Safety Notice:</strong> Only confirm if the product meets your satisfaction. Do not confirm if you haven't received the item.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowConfirmReleaseModal(null)}
                  className="py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReleaseEscrow(showConfirmReleaseModal)}
                  disabled={isProcessing}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Release Funds Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL: MARK DELIVERED --- */}
      <AnimatePresence>
        {showMarkDeliveredModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Mark Order Delivered</h3>
                    <p className="text-xs text-slate-500">Notify buyer to inspect item</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMarkDeliveredModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meetup / Delivery Confirmation Notes (Optional)
                  </label>
                  <textarea
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Handed over at SUB building Osogbo campus. Item tested and working."
                    rows={3}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-500">
                  Marking this order as delivered updates the buyer's screen with a one-click prompt to confirm and release your ₦{showMarkDeliveredModal.sellerReceives.toLocaleString()} earnings.
                </div>

                <button
                  onClick={() => handleMarkDelivered(showMarkDeliveredModal)}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Confirm Delivery & Notify Buyer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL: OPEN DISPUTE --- */}
      <AnimatePresence>
        {showDisputeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Open Escrow Dispute</h3>
                    <p className="text-xs text-slate-500">Freeze funds & request moderator review</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDisputeModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Dispute</label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Item condition different from description">Item condition different from description</option>
                    <option value="Item not working / defective">Item not working / defective</option>
                    <option value="Seller did not show up to meetup">Seller did not show up to meetup</option>
                    <option value="Wrong item received">Wrong item received</option>
                    <option value="Counterfeit or fraudulent listing">Counterfeit or fraudulent listing</option>
                    <option value="Other grievance">Other grievance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Explanation</label>
                  <textarea
                    value={disputeDescription}
                    onChange={(e) => setDisputeDescription(e.target.value)}
                    placeholder="Provide details about the issue. CampusPlug moderators will examine this to determine refund or release."
                    rows={4}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900">
                  Opening a dispute freezes the escrow deposit of ₦{showDisputeModal.amount.toLocaleString()}. No funds can be released until CampusPlug admin moderation concludes investigation.
                </div>

                <button
                  onClick={() => handleOpenDispute(showDisputeModal)}
                  disabled={isProcessing || !disputeDescription.trim()}
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                  Submit Dispute to Admin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

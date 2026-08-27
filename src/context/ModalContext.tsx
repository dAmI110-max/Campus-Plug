import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, Accommodation, Order, WalletTransaction } from '../types';

export type ModalType =
  | 'auth'
  | 'product_detail'
  | 'accommodation_detail'
  | 'create_product'
  | 'create_accommodation'
  | 'edit_product'
  | 'seller_onboarding'
  | 'verification'
  | 'report'
  | 'about'
  | 'review'
  | 'search'
  | 'subscriptions'
  | 'support'
  | 'safety_guidelines'
  | 'escrow_checkout'
  | 'wallet_deposit'
  | 'wallet_withdraw'
  | 'add_bank'
  | 'tx_receipt';

export interface ModalPayloadMap {
  auth: { initialMode?: 'login' | 'signup' | 'reset' };
  product_detail: { product: Product };
  accommodation_detail: { accommodation: Accommodation };
  create_product: undefined;
  create_accommodation: undefined;
  edit_product: { product: Product };
  seller_onboarding: undefined;
  verification: undefined;
  report: { targetId: string; targetType: 'product' | 'seller' | 'accommodation'; targetName: string };
  about: undefined;
  review: { order: Order };
  search: undefined;
  subscriptions: undefined;
  support: undefined;
  escrow_checkout: { product: Product };
  wallet_deposit: undefined;
  wallet_withdraw: undefined;
  add_bank: undefined;
  tx_receipt: { transaction: WalletTransaction };
}

export interface ActiveModalState {
  type: ModalType;
  props?: any;
}

interface ModalContextType {
  activeModal: ActiveModalState | null;
  openModal: <K extends ModalType>(
    type: K,
    props?: K extends keyof ModalPayloadMap ? ModalPayloadMap[K] : any
  ) => void;
  closeModal: () => void;
  isModalOpen: (type: ModalType) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ActiveModalState | null>(null);

  const openModal = useCallback(
    <K extends ModalType>(
      type: K,
      props?: K extends keyof ModalPayloadMap ? ModalPayloadMap[K] : any
    ) => {
      // Cleanly replace any open modal to strictly avoid modal/banner stacking and z-index overlap
      setActiveModal({ type, props });
    },
    []
  );

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const isModalOpen = useCallback(
    (type: ModalType) => {
      return activeModal?.type === type;
    },
    [activeModal]
  );

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal, isModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

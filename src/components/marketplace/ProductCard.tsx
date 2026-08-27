import React from 'react';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storageService';
import { Heart, MapPin, Sparkles, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onFavoriteToggle?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  onFavoriteToggle,
}) => {
  const { currentUser } = useAuth();
  const { success, error } = useToast();

  const isFav = currentUser ? StorageService.isFavorite(currentUser.id, product.id) : false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      error('Please log in to save items to your favorites.');
      return;
    }

    const added = StorageService.toggleFavorite(currentUser.id, product.id);
    if (added) {
      success(`Saved "${product.title}" to your favorites.`);
    }
    if (onFavoriteToggle) {
      onFavoriteToggle(product.id);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case 'New':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      case 'Like New':
        return 'bg-sky-500/10 text-sky-700 border-sky-200';
      case 'Used':
        return 'bg-amber-500/10 text-amber-800 border-amber-200';
      case 'Refurbished':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(product)}
      className="group relative bg-white dark:bg-slate-900 rounded-[26px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer flex flex-col h-full"
    >
      {/* Image & Badges */}
      <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={primaryImage}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap gap-1.5 pointer-events-auto">
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-xs shadow-xs ${getConditionColor(
                product.condition
              )}`}
            >
              {product.condition}
            </span>
            {product.featured && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-600 text-white shadow-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Featured
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="w-8 h-8 rounded-full bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-md backdrop-blur-xs transition-transform active:scale-90 pointer-events-auto border border-transparent dark:border-slate-700"
            aria-label="Save to favorites"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300 hover:text-rose-500'
              }`}
            />
          </button>
        </div>

        {/* Sold / Paused Overlay */}
        {product.status === 'sold' && (
          <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-2xs flex items-center justify-center">
            <span className="px-3.5 py-1.5 bg-rose-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transform -rotate-6">
              Sold Out
            </span>
          </div>
        )}
        {product.status === 'paused' && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center">
            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold uppercase rounded-lg">
              Paused
            </span>
          </div>
        )}

        {/* Category Pill at Bottom */}
        <div className="absolute bottom-2 left-2.5">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs">
            {product.categoryName}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Price */}
          <div className="flex items-line justify-between">
            <span className="text-base font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
              {formatPrice(product.price)}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
              <Eye className="w-3 h-3" /> {product.views || 1}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Campus Location & Seller */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 truncate max-w-[150px]">
            <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
            <span className="truncate">{product.sellerCampus || product.location}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <img
              src={product.sellerAvatar}
              alt={product.sellerName}
              referrerPolicy="no-referrer"
              className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <span className="font-semibold text-slate-700 dark:text-slate-300 max-w-[80px] truncate">{product.sellerName.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

import React from 'react';
import { Product } from '../../types';
import { ProductCard } from '../marketplace/ProductCard';
import { EmptyState } from '../common/EmptyState';

interface MyFavoritesTabProps {
  favoriteProducts: Product[];
  onProductClick: (product: Product) => void;
  onFavoriteToggle: (productId: string) => void;
  onExploreMarketplace: () => void;
}

export const MyFavoritesTab: React.FC<MyFavoritesTabProps> = ({
  favoriteProducts,
  onProductClick,
  onFavoriteToggle,
  onExploreMarketplace,
}) => {
  if (favoriteProducts.length === 0) {
    return (
      <EmptyState
        type="favorites"
        title="Your favorites list is empty"
        description="Save phones, books, fashion items, and gadgets you are interested in by tapping the heart icon on any listing."
        actionText="Browse Marketplace"
        onAction={onExploreMarketplace}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">
          Saved Items ({favoriteProducts.length})
        </h3>
        <p className="text-xs text-slate-500">
          Click any product to view full details and contact the seller on WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {favoriteProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
            onFavoriteToggle={onFavoriteToggle}
          />
        ))}
      </div>
    </div>
  );
};

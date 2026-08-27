import React, { useState, useEffect } from 'react';
import { Product, ProductCondition, ProductStatus } from '../../types';
import { StorageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { X, Edit3, Save, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [condition, setCondition] = useState<ProductCondition>('Used');
  const [status, setStatus] = useState<ProductStatus>('active');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setPrice(product.price);
      setCondition(product.condition);
      setStatus(product.status);
      setLocation(product.location);
      setDescription(product.description);
      setImages(product.images || []);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    if (images.length >= 5) {
      error('Maximum 5 images allowed per listing.');
      return;
    }
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !description.trim()) {
      error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    const updated = StorageService.updateProduct(product.id, {
      title: title.trim(),
      price: Number(price),
      condition,
      status,
      location: location.trim(),
      description: description.trim(),
      images: images.length > 0 ? images : product.images,
    });

    setIsSubmitting(false);

    if (updated) {
      success('Listing updated successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } else {
      error('Failed to update listing.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-100 relative my-6 max-h-[92vh] flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Edit Product Listing</h2>
                <p className="text-xs text-slate-500 truncate max-w-xs">{product.title}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 py-4 space-y-4 flex-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₦) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Condition *</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ProductCondition)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Used">Used</option>
                  <option value="Fair">Fair</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Listing Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProductStatus)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-emerald-700 focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="paused">Paused (Hidden)</option>
                  <option value="sold">Sold Out</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Product Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {images.map((url, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={url} alt="Product" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-0.5 bg-rose-600 text-white rounded-full"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste direct Image URL..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-98 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

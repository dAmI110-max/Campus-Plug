import React from 'react';
import { Category } from '../../types';
import {
  Smartphone,
  Laptop,
  BookOpen,
  Shirt,
  Home,
  Tv,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';

interface CategorySliderProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'phones':
      return Smartphone;
    case 'laptops':
      return Laptop;
    case 'textbooks':
      return BookOpen;
    case 'fashion':
      return Shirt;
    case 'hostels':
      return Home;
    case 'appliances':
      return Tv;
    case 'services':
      return Sparkles;
    default:
      return Layers;
  }
};

export const CategorySlider: React.FC<CategorySliderProps> = ({
  categories,
  onSelectCategory,
}) => {
  return (
    <section className="py-8 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Explore by Category</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Discover items listed specifically by students around your campus</p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Categories Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectCategory(cat.id)}
                className="bg-white dark:bg-slate-900 rounded-[24px] p-4 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600 dark:group-hover:text-white flex items-center justify-center transition-colors mb-2.5 shadow-2xs">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                  {cat.itemCount || 0} items
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

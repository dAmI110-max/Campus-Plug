import React from 'react';
import { AccommodationFilterOptions, Campus, RoomType } from '../../types';
import { Search, ChevronDown, RefreshCw } from 'lucide-react';

interface AccommodationFiltersProps {
  filters: AccommodationFilterOptions;
  campuses: Campus[];
  onFilterChange: (newFilters: AccommodationFilterOptions) => void;
  onReset: () => void;
  totalResults: number;
}

const ROOM_TYPES: (RoomType | 'All')[] = [
  'All',
  'Self-contain',
  'Single Room',
  '2-Bedroom Flat',
  'Shared Apartment',
  'Off-Campus Hostel',
];

export const AccommodationFilters: React.FC<AccommodationFiltersProps> = ({
  filters,
  campuses,
  onFilterChange,
  onReset,
  totalResults,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleCampusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, campusId: e.target.value });
  };

  const handleRoomTypeSelect = (rt: RoomType | 'All') => {
    onFilterChange({ ...filters, roomType: rt === 'All' ? undefined : rt });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as AccommodationFilterOptions['sortBy'] });
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={handleSearchChange}
            placeholder="Search hostels near UNIOSUN Oke-Baale, Ikire, Ifetedo, Okuku..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 shadow-2xs"
          />
        </div>

        {/* Campus & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[170px]">
            <select
              value={filters.campusId || 'all'}
              onChange={handleCampusChange}
              className="w-full appearance-none pl-3 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500 shadow-2xs cursor-pointer"
            >
              <option value="all">All UNIOSUN Campuses</option>
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          <div className="relative min-w-[130px]">
            <select
              value={filters.sortBy || 'newest'}
              onChange={handleSortChange}
              className="w-full appearance-none pl-3 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500 shadow-2xs cursor-pointer"
            >
              <option value="newest">Newest Listed</option>
              <option value="price_asc">Rent: Low to High</option>
              <option value="price_desc">Rent: High to Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Room type chips */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-semibold text-slate-500 dark:text-slate-400 mr-1">Room Type:</span>
          {ROOM_TYPES.map((rt) => {
            const isSelected = (!filters.roomType && rt === 'All') || filters.roomType === rt;
            return (
              <button
                key={rt}
                onClick={() => handleRoomTypeSelect(rt)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {rt}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {(filters.searchQuery || filters.campusId || filters.roomType) && (
            <button
              onClick={onReset}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          )}
          <span className="text-slate-400 dark:text-slate-500 font-medium">{totalResults} lodges listed</span>
        </div>
      </div>
    </div>
  );
};

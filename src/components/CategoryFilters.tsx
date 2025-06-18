import React from 'react';
import type { CategoryData } from '../utils/iconLoader';

interface CategoryFiltersProps {
  categories: CategoryData[];
  selectedCategories: string[];
  onSelectCategory: (categoryId: string) => void;
  totalIcons: number;
  filteredIconsCount: number;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  categories,
  selectedCategories,
  onSelectCategory,
  totalIcons,
  filteredIconsCount
}) => {
  return (
    <div className="pt-2 pb-2">
      {/* Category Pills */}
      <div className="px-2 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {/* All Categories Pill */}
          <button
            onClick={() => onSelectCategory('')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 border ${
              selectedCategories.length === 0
                ? 'bg-gray-100 text-gray-900 border-gray-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Categories
            <span className="text-xs opacity-75">({totalIcons})</span>
          </button>

          {/* Individual Category Pills */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                // Only allow one category selection at a time
                if (selectedCategories.includes(category.id)) {
                  onSelectCategory(''); // Deselect if already selected
                } else {
                  onSelectCategory(category.id); // Select only this category
                }
              }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 border ${
                selectedCategories.includes(category.id)
                  ? 'bg-braze-action text-white border-braze-action shadow-lg'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category.name}
              <span className="text-xs opacity-75">({category.count})</span>
            </button>
          ))}

          {/* Clear Filters Pill */}
          {selectedCategories.length > 0 && (
            <button
              onClick={() => onSelectCategory('')}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 border bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="px-4 mb-6">
        <p className="text-xs text-gray-500">
          Showing {filteredIconsCount} of {totalIcons} icons
        </p>
      </div>
    </div>
  );
};

export default CategoryFilters; 
import React, { useMemo } from 'react';
import type { IconData } from '../utils/iconLoader';
import { getHumanReadableCategoryName } from '../utils/iconLoader';
import EmptyState from './EmptyState';
import QuickCopyButton from './QuickCopyButton';

interface IconGridProps {
  icons: IconData[];
  selectedCategories: string[];
  selectedStyles: string[];
  selectedContainerColor: string | null;
  onIconClick?: (icon: IconData) => void;
  selectedIconIndex?: number;
  onCategoriesChange?: (categories: string[]) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
  onClearFilters?: () => void;
  onClearAll?: () => void;
  onShowToast?: (message: string, type?: 'success' | 'error') => void;
  onCloseModal?: () => void;
}

interface GroupedIcons {
  [category: string]: IconData[];
}

function getDefaultStyleSvg(icon: IconData) {
  const stroke = icon.styles.find(s => s.style === 'stroke');
  return stroke ? stroke.svg : icon.styles[0]?.svg || '';
}



const IconGrid: React.FC<IconGridProps> = ({
  icons,
  selectedCategories,
  selectedStyles,
  selectedContainerColor,
  onIconClick,
  selectedIconIndex = -1,
  onCategoriesChange,
  searchQuery,
  onClearSearch,
  onClearFilters,
  onClearAll,
  onShowToast,
  onCloseModal
}) => {
  // Group icons by category
  const groupedIcons = useMemo(() => {
    const groups: GroupedIcons = {};
    icons.forEach(icon => {
      if (!groups[icon.category]) {
        groups[icon.category] = [];
      }
      groups[icon.category].push(icon);
    });
    return groups;
  }, [icons]);

  // Get sorted category names
  const sortedCategories = useMemo(() => {
    const categories = Object.keys(groupedIcons).sort();
    // Notify parent component of the current categories
    if (onCategoriesChange) {
      onCategoriesChange(categories);
    }
    return categories;
  }, [groupedIcons, onCategoriesChange]);

  if (icons.length === 0) {
    // Determine empty state type based on context
    const hasFilters = selectedCategories.length > 0 || selectedStyles.length > 0;
    const hasSearch = searchQuery && searchQuery.trim().length > 0;
    
    let emptyStateType: 'search' | 'filter' | 'general' = 'general';
    if (hasSearch && hasFilters) {
      emptyStateType = 'search'; // Prioritize search context
    } else if (hasSearch) {
      emptyStateType = 'search';
    } else if (hasFilters) {
      emptyStateType = 'filter';
    }

    return (
      <EmptyState
        type={emptyStateType}
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
        selectedStyles={selectedStyles}
        onClearSearch={onClearSearch}
        onClearFilters={onClearFilters}
        onClearAll={onClearAll}
      />
    );
  }

  let globalIconIndex = 0;

  return (
    <div className="space-y-12">
      {sortedCategories.map(category => {
        const categoryIcons = groupedIcons[category];
        
        return (
          <div key={category} className="space-y-4">
            {/* Category Header */}
            <div data-category-header={category}>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {getHumanReadableCategoryName(category)}
                </h2>
                <span className="text-xs text-gray-500">
                  {categoryIcons.length}
                </span>
              </div>
            </div>

            {/* Icons Grid for this category */}
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
              {categoryIcons.map((icon) => {
                const currentIndex = globalIconIndex++;
                const isSelected = selectedIconIndex === currentIndex;
                
                return (
                  <div
                    key={icon.id}
                    data-icon-index={currentIndex}
                    className={`icon-card group bg-white rounded-lg sm:rounded-xl lg:rounded-2xl border-2 shadow-sm transition-all duration-300 cursor-pointer p-3 sm:p-4 lg:p-6 flex flex-col items-center gap-1 sm:gap-2 relative overflow-hidden ${
                      isSelected 
                        ? 'border-braze-action shadow-lg ring-4 ring-braze-action/20 -translate-y-1 scale-105' 
                        : 'border-gray-200/50 hover:border-gray-300/70 hover:shadow-lg hover:-translate-y-1 hover:scale-105'
                    }`}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open export modal for ${icon.name}`}
                    onClick={() => onIconClick && onIconClick(icon)}
                  >
                    {/* Quick Copy Button - Desktop only */}
                    <div className="hidden sm:block">
                      <QuickCopyButton
                        icon={icon}
                        onFallbackToModal={() => onIconClick && onIconClick(icon)}
                        onShowToast={onShowToast || (() => {})}
                        onCloseModal={onCloseModal}
                      />
                    </div>
                    <div className="aspect-square flex items-center justify-center mb-2 sm:mb-3">
                      <div
                        className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                        style={selectedContainerColor ? { color: selectedContainerColor } : undefined}
                        dangerouslySetInnerHTML={{ __html: getDefaultStyleSvg(icon) }}
                      />
                    </div>
                    <h3 className="font-medium text-slate-700 text-center text-xs sm:text-sm leading-tight break-words text-balance">
                      {icon.name}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IconGrid; 
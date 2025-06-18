import React from 'react';
import SearchBar from './SearchBar';
import type { IconData, CategoryData } from '../utils/iconLoader';

interface HeaderProps {
  iconCount: number;
  categoryCount: number;
  searchQuery: string;
  onSearch: (query: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  icons: IconData[];
  categories: CategoryData[];
}

// Hardcoded values for instant LCP performance
const TOTAL_ICONS = 1190;
const TOTAL_CATEGORIES = 21;

// Placeholder for Braze logo SVG
const BrazeLogo = () => (
  <img src="/images/Braze_Primary_logo_PURPLE.svg" alt="Braze Logo" className="w-full h-full" />
);

const Header: React.FC<HeaderProps> = ({
  iconCount,
  categoryCount,
  searchQuery,
  onSearch,
  searchInputRef,
  icons,
  categories,
}) => {
  // Use hardcoded values for initial LCP, fallback to dynamic for filtered results
  const displayIconCount = searchQuery || iconCount < TOTAL_ICONS ? iconCount : TOTAL_ICONS;
  const displayCategoryCount = searchQuery || categoryCount < TOTAL_CATEGORIES ? categoryCount : TOTAL_CATEGORIES;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 py-10 bg-gradient-to-br from-white/95 via-blue-50/60 to-purple-50/40 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(87,16,229,0.03)_0%,_transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(168,85,247,0.02)_0%,_transparent_50%)] pointer-events-none"></div>
      <div className="relative container mx-auto px-4">
        <div className="pt-3 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: Logo and Title */}
            <div className="flex flex-col gap-2 items-center lg:items-start">
              <div className="w-16 sm:w-24 h-auto mb-2 sm:mb-3">
                <BrazeLogo />
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start mb-1 sm:mb-2">
                  <h1 className="font-bold text-gray-900 text-3xl sm:text-3xl lg:text-[40px] leading-tight">
                    Icon Library
                  </h1>
                </div>
                <p className="text-gray-600 max-w-xl lg:max-w-none text-base sm:text-base lg:text-[16px] px-2 lg:px-0 text-balance">
                  Managing <span className="text-braze-purple">{displayIconCount} icon{displayIconCount !== 1 ? 's' : ''}</span> across{' '}
                  <span className="text-braze-purple">{displayCategoryCount} categor{displayCategoryCount === 1 ? 'y' : 'ies'}</span> with{' '}
                  <span className="text-braze-purple">multi-style support</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Search Bar */}
        <div>
          <SearchBar
            searchQuery={searchQuery}
            onSearch={onSearch}
            searchInputRef={searchInputRef}
            icons={icons}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
};

export default Header; 
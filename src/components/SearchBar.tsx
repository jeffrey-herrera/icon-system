import React, { useEffect, useRef, useState } from 'react';
import SearchSuggestions from './SearchSuggestions';
import type { IconData, CategoryData } from '../utils/iconLoader';

interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  icons: IconData[];
  categories: CategoryData[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearch,
  searchInputRef: externalSearchInputRef,
  icons,
  categories,
}) => {
  const internalSearchInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = externalSearchInputRef || internalSearchInputRef;
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: any) => {
    if (suggestion.type === 'category') {
      // For category suggestions, we'll just search for the category name
      onSearch(suggestion.category.id);
    } else {
      // For icon, tag, or typo suggestions, use the icon name
      onSearch(suggestion.text);
    }
    setShowSuggestions(false);
  };

  // Handle input focus/blur for suggestions
  const handleInputFocus = () => {
    if (searchQuery.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 150);
  };

  // Show suggestions when typing
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 z-10">
          <svg className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          ref={searchInputRef}
          type="text"
          id="search-input"
          placeholder="Search icons by name, category, or description..."
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              onSearch('');
              e.currentTarget.blur();
              setShowSuggestions(false);
            }
          }}
          className="w-full pl-12 sm:pl-14 pr-16 sm:pr-20 h-14 sm:h-14 bg-white/95 backdrop-blur-sm border-2 border-white/90 shadow-lg rounded-xl sm:rounded-2xl placeholder:text-gray-400 focus:bg-white focus:border-braze-action/50 focus:ring-4 focus:ring-braze-action/10 focus:outline-none transition-all duration-300 font-normal disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:border-white hover:shadow-xl text-sm sm:text-[14px]"
          aria-label="Search icons"
        />
        {/* Keyboard shortcut hint */}
        <div className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm pointer-events-none">
          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">/</kbd>
        </div>
        
        {/* Search Suggestions */}
        <SearchSuggestions
          query={searchQuery}
          icons={icons}
          categories={categories}
          onSuggestionSelect={handleSuggestionSelect}
          onClose={() => setShowSuggestions(false)}
          isVisible={showSuggestions}
        />
      </div>
    </div>
  );
};

export default SearchBar; 
import React from 'react';

interface EmptyStateProps {
  type: 'search' | 'filter' | 'general';
  searchQuery?: string;
  selectedCategories?: string[];
  selectedStyles?: string[];
  onClearSearch?: () => void;
  onClearFilters?: () => void;
  onClearAll?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  searchQuery,
  selectedCategories = [],
  selectedStyles = [],
  onClearSearch,
  onClearFilters,
  onClearAll
}) => {
  const hasFilters = selectedCategories.length > 0 || selectedStyles.length > 0;
  
  // Determine the primary action based on context
  const getPrimaryAction = () => {
    if (type === 'search' && searchQuery) {
      return {
        text: 'Clear search',
        action: onClearSearch,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      };
    }
    if (type === 'filter' && hasFilters) {
      return {
        text: 'Clear filters',
        action: onClearFilters,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        )
      };
    }
    return {
      text: 'Show all icons',
      action: onClearAll,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
    };
  };

  const getEmptyStateContent = () => {
    if (type === 'search' && searchQuery) {
      return {
        icon: (
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-1">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" strokeWidth="2"/>
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        ),
        title: `No results for "${searchQuery}"`,
        description: "We couldn't find any icons matching your search. Try different keywords or browse by category.",
        suggestions: [
          "Check your spelling",
          "Try broader search terms",
          "Browse categories instead"
        ]
      };
    }

    if (type === 'filter' && hasFilters) {
      return {
        icon: (
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-1">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
        ),
        title: "No icons match your filters",
        description: "Try adjusting your category or style filters to see more results.",
        suggestions: [
          "Remove some filters",
          "Try different categories",
          "Check all style options"
        ]
      };
    }

    // General empty state
    return {
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-slate-100 rounded-2xl flex items-center justify-center mb-1">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
          </svg>
        </div>
      ),
      title: "No icons available",
      description: "There are no icons to display at the moment.",
      suggestions: []
    };
  };

  const content = getEmptyStateContent();
  const primaryAction = getPrimaryAction();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-500">
      {/* Animated Icon */}
      <div className="mb-6 animate-in zoom-in duration-700 delay-100">
        {content.icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold mb-3 text-gray-900 animate-in slide-in-from-bottom-4 duration-500 delay-200">
        {content.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md leading-relaxed animate-in slide-in-from-bottom-4 duration-500 delay-300">
        {content.description}
      </p>

      {/* Suggestions */}
      {content.suggestions.length > 0 && (
        <div className="mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-400">
          <p className="text-sm font-medium text-gray-700 mb-3">Try these suggestions:</p>
          <ul className="space-y-2">
            {content.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-braze-purple rounded-full flex-shrink-0"></div>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 animate-in slide-in-from-bottom-4 duration-500 delay-500">
        {primaryAction.action && (
          <button
            onClick={primaryAction.action}
            className="inline-flex items-center gap-2 px-6 py-3 bg-braze-purple text-white rounded-xl font-medium hover:bg-braze-purple/90 transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            {primaryAction.icon}
            {primaryAction.text}
          </button>
        )}
        
        {/* Secondary action for combined search + filter scenarios */}
        {type === 'search' && hasFilters && onClearAll && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset everything
          </button>
        )}
      </div>

      {/* Floating decoration elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-200 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-200 rounded-full animate-pulse delay-1500"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-orange-200 rounded-full animate-pulse delay-2000"></div>
      </div>
    </div>
  );
};

export default EmptyState; 
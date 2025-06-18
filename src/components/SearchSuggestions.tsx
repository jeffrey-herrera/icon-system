import React, { useMemo, useState, useEffect } from 'react';
import type { IconData, CategoryData } from '../utils/iconLoader';

interface SearchSuggestion {
  type: 'icon' | 'category' | 'tag' | 'typo';
  text: string;
  description?: string;
  icon?: IconData;
  category?: CategoryData;
  originalQuery?: string; // For typo corrections
}

interface SearchSuggestionsProps {
  query: string;
  icons: IconData[];
  categories: CategoryData[];
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
  onClose: () => void;
  isVisible: boolean;
  maxSuggestions?: number;
}

// Popular/common icon names for better suggestions
const POPULAR_ICONS = [
  'add', 'arrow', 'check', 'close', 'delete', 'edit', 'email', 'home', 'menu', 'search',
  'settings', 'user', 'heart', 'star', 'share', 'download', 'upload', 'play', 'pause', 'stop',
  'calendar', 'clock', 'location', 'phone', 'message', 'notification', 'warning', 'info'
];

// Simple fuzzy matching for typo detection
function fuzzyMatch(query: string, target: string, threshold: number = 0.6): boolean {
  if (query.length === 0) return false;
  if (target.toLowerCase().includes(query.toLowerCase())) return true;
  
  // Simple Levenshtein-like scoring
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  
  let matches = 0;
  let j = 0;
  
  for (let i = 0; i < q.length && j < t.length; i++) {
    if (q[i] === t[j]) {
      matches++;
      j++;
    } else {
      // Allow one character skip
      j++;
      if (j < t.length && q[i] === t[j]) {
        matches++;
        j++;
      }
    }
  }
  
  return matches / Math.max(q.length, t.length) >= threshold;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  icons,
  categories,
  onSuggestionSelect,
  onClose,
  isVisible,
  maxSuggestions = 8
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const q = query.toLowerCase().trim();
    const results: SearchSuggestion[] = [];

    // 1. Category matches (most useful since they filter the view)
    const categoryMatches = categories.filter(cat => 
      cat.name.toLowerCase().includes(q) || cat.id.toLowerCase().includes(q)
    ).slice(0, 3);
    
    categoryMatches.forEach(category => {
      results.push({
        type: 'category',
        text: `Show ${category.name}`,
        description: `${category.count} icons`,
        category
      });
    });

    // 2. Popular search terms (only if they're not already obvious)
    const popularMatches = POPULAR_ICONS.filter(popular => 
      popular.includes(q) && popular !== q && // Don't suggest exact matches
      !results.some(r => r.text.toLowerCase().includes(popular))
    ).slice(0, 2);
    
    popularMatches.forEach(popular => {
      const matchingIconsCount = icons.filter(icon => 
        icon.name.toLowerCase().includes(popular) ||
        (icon.tags && icon.tags.some(tag => tag.toLowerCase().includes(popular)))
      ).length;
      
      if (matchingIconsCount > 0) {
        results.push({
          type: 'tag',
          text: popular,
          description: `${matchingIconsCount} icons`,
        });
      }
    });

    return results.slice(0, 4); // Keep it small
  }, [query, icons, categories]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            onSuggestionSelect(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (isVisible && e.target instanceof Element) {
        // Check if click is outside the suggestions dropdown
        const suggestionsElement = document.querySelector('[data-suggestions-dropdown]');
        if (suggestionsElement && !suggestionsElement.contains(e.target)) {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, suggestions, selectedIndex, onSuggestionSelect, onClose]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'category':
        return (
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'tag':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      data-suggestions-dropdown
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
    >
      <div className="py-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={`${suggestion.type}-${suggestion.text}-${index}`}
            onClick={() => onSuggestionSelect(suggestion)}
            className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
              index === selectedIndex ? 'bg-braze-action/10 border-r-2 border-braze-action' : ''
            }`}
          >
            <div className="flex-shrink-0">
              {getSuggestionIcon(suggestion)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {suggestion.text}
              </div>
              {suggestion.description && (
                <div className="text-sm text-gray-500 truncate">
                  {suggestion.description}
                </div>
              )}
            </div>
            {index === selectedIndex && (
              <div className="flex-shrink-0">
                <svg className="w-4 h-4 text-braze-action" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions; 
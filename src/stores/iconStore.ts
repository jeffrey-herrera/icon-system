import type { IconData, CategoryData } from '../utils/iconLoader';
import { filterIcons } from '../utils/iconLoader';

// State interface
export interface IconSystemState {
  selectedCategories: string[];
  selectedStyles: string[];
  selectedContainerColor: string | null;
}

// Default state
export const defaultState: IconSystemState = {
  selectedCategories: [],
  selectedStyles: [],
  selectedContainerColor: null,
};

// Load state from localStorage
export function loadState(): IconSystemState {
  if (typeof window === 'undefined') return defaultState;
  
  const savedState = localStorage.getItem('iconSystemState');
  if (!savedState) return defaultState;
  
  try {
    return { ...defaultState, ...JSON.parse(savedState) };
  } catch {
    return defaultState;
  }
}

// Save state to localStorage
export function saveState(state: Partial<IconSystemState>) {
  if (typeof window === 'undefined') return;
  
  const currentState = loadState();
  const newState = { ...currentState, ...state };
  localStorage.setItem('iconSystemState', JSON.stringify(newState));
}

// Filter icons based on current state
export function getFilteredIcons(
  icons: IconData[],
  searchQuery: string,
  selectedCategories: string[],
  selectedStyles: string[]
): IconData[] {
  return filterIcons(icons, searchQuery, selectedCategories, selectedStyles);
}

// Get categories with counts
export function getCategories(icons: IconData[]): CategoryData[] {
  const categoryMap = new Map<string, number>();
  
  icons.forEach(icon => {
    const count = categoryMap.get(icon.category) || 0;
    categoryMap.set(icon.category, count + 1);
  });
  
  return Array.from(categoryMap.entries()).map(([id, count]) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    count
  }));
} 
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import type { IconData, CategoryData } from '../utils/iconLoader';
import { filterIcons } from '../utils/iconLoader';
import StyleFilter from './StyleFilter';
import IconGrid from './IconGrid';
import ExportModal from './ExportModal';
import Header from './Header';
import CategoryFilters from './CategoryFilters';
import JumpToTop from './JumpToTop';
import Toast from './Toast';

interface IconLibraryProps {
  icons: IconData[];
  categories: CategoryData[];
}

const IconLibrary: React.FC<IconLibraryProps> = ({ icons, categories }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIcon, setModalIcon] = useState<IconData | null>(null);

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedContainerColor, setSelectedContainerColor] = useState<string | null>('#801ED7'); // Default to purple
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard navigation state
  const [selectedIconIndex, setSelectedIconIndex] = useState(-1);
  const [keyboardNavigationActive, setKeyboardNavigationActive] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  const [isOpeningModal, setIsOpeningModal] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const iconGridRef = useRef<HTMLDivElement>(null);

  const handleIconClick = (icon: IconData) => {
    // Clear keyboard navigation state when clicking with mouse
    setKeyboardNavigationActive(false);
    setSelectedIconIndex(-1);
    
    setIsOpeningModal(true);
    setModalIcon(icon);
    setModalOpen(true);
    // Reset the flag after a short delay
    setTimeout(() => setIsOpeningModal(false), 100);
  };

  const handleModalExited = () => {
    setModalIcon(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleShowToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  const handleSelectCategory = (categoryId: string) => {
    if (categoryId === '') {
      // Clear all categories
      setSelectedCategories([]);
    } else {
      // Only allow one category selection at a time
      if (selectedCategories.includes(categoryId)) {
        setSelectedCategories([]); // Deselect if already selected
      } else {
        setSelectedCategories([categoryId]); // Select only this category
      }
    }
  };

  const handleSelectStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  };

  // Filter icons based on search, categories, and styles
  const filteredIcons = useMemo(() => filterIcons(
    icons,
    searchQuery,
    selectedCategories,
    selectedStyles
  ), [icons, searchQuery, selectedCategories, selectedStyles]);

  // Reset selected icon index when filtered icons change
  useEffect(() => {
    setSelectedIconIndex(-1);
    setKeyboardNavigationActive(false);
  }, [filteredIcons]);

  // Calculate grid dimensions for keyboard navigation
  const getGridDimensions = useCallback(() => {
    if (!iconGridRef.current) return { cols: 6, rows: 1 };
    
    const gridElement = iconGridRef.current.querySelector('.grid');
    if (!gridElement) return { cols: 6, rows: 1 };
    
    const computedStyle = window.getComputedStyle(gridElement);
    const gridTemplateColumns = computedStyle.gridTemplateColumns;
    const cols = gridTemplateColumns.split(' ').length;
    const rows = Math.ceil(filteredIcons.length / cols);
    
    return { cols, rows };
  }, [filteredIcons.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search input with '/'
      if (e.key === '/' && !modalOpen) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Handle escape key
      if (e.key === 'Escape') {
        if (modalOpen) {
          handleCloseModal();
        } else if (searchQuery) {
          setSearchQuery('');
          searchInputRef.current?.blur();
        } else if (keyboardNavigationActive) {
          setKeyboardNavigationActive(false);
          setSelectedIconIndex(-1);
        }
        return;
      }

      // Don't handle arrow keys if search input is focused, modal is open, or we're opening a modal
      if (document.activeElement === searchInputRef.current || modalOpen || isOpeningModal) {
        return;
      }

      // Handle arrow key navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
        e.preventDefault();
        
        if (filteredIcons.length === 0) return;

        const { cols } = getGridDimensions();
        let newIndex = selectedIconIndex;

        if (!keyboardNavigationActive) {
          // Start keyboard navigation
          setKeyboardNavigationActive(true);
          newIndex = 0;
        } else {
          switch (e.key) {
            case 'ArrowRight':
              newIndex = Math.min(selectedIconIndex + 1, filteredIcons.length - 1);
              break;
            case 'ArrowLeft':
              newIndex = Math.max(selectedIconIndex - 1, 0);
              break;
            case 'ArrowDown':
              newIndex = Math.min(selectedIconIndex + cols, filteredIcons.length - 1);
              break;
            case 'ArrowUp':
              newIndex = Math.max(selectedIconIndex - cols, 0);
              break;
            case 'Enter':
              if (selectedIconIndex >= 0 && selectedIconIndex < filteredIcons.length) {
                e.stopPropagation();
                handleIconClick(filteredIcons[selectedIconIndex]);
              }
              return;
          }
        }

        setSelectedIconIndex(newIndex);

        // Scroll selected icon into view
        setTimeout(() => {
          const iconElement = iconGridRef.current?.querySelector(`[data-icon-index="${newIndex}"]`);
          if (iconElement) {
            iconElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 0);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIconIndex, keyboardNavigationActive, filteredIcons, modalOpen, isOpeningModal, searchQuery, getGridDimensions, handleIconClick, handleCloseModal]);

  return (
    <>
      {/* Header with search */}
      <div>
        <Header
          iconCount={filteredIcons.length}
          categoryCount={categories.length}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchInputRef={searchInputRef}
          icons={icons}
          categories={categories}
        />
      </div>
      
      {/* Category Filters and Results Summary */}
      <CategoryFilters
        categories={categories}
        selectedCategories={selectedCategories}
        onSelectCategory={handleSelectCategory}
        totalIcons={icons.length}
        filteredIconsCount={filteredIcons.length}
      />

      {/* Icon Grid */}
      <div ref={iconGridRef}>
        <IconGrid
          icons={filteredIcons}
          selectedCategories={selectedCategories}
          selectedStyles={selectedStyles}
          selectedContainerColor={selectedContainerColor}
          onIconClick={handleIconClick}
          selectedIconIndex={keyboardNavigationActive ? selectedIconIndex : -1}
          onCategoriesChange={setVisibleCategories}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onClearFilters={() => {
            setSelectedCategories([]);
            setSelectedStyles([]);
          }}
          onClearAll={() => {
            setSearchQuery('');
            setSelectedCategories([]);
            setSelectedStyles([]);
          }}
          onShowToast={handleShowToast}
          onCloseModal={handleCloseModal}
        />
      </div>
      
      {/* Keyboard shortcuts help - Desktop only */}
      <div className="hidden sm:block fixed bottom-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-lg animate-in slide-in-from-bottom-2 fade-in duration-300">
        <div className="flex items-center gap-2">
          {/* Context-aware shortcuts */}
          {modalOpen ? (
            <>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono text-gray-700">Esc</kbd>
              <span className="text-gray-600 font-medium">Close</span>
            </>
          ) : (
            <>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono text-gray-700">/</kbd>
              <span className="text-gray-600 font-medium">Search</span>
              <div className="w-px h-4 bg-gray-300 rounded-full"></div>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono tracking-wider text-gray-700">↑ ↓ ← →</kbd>
              <span className="text-gray-600 font-medium">Navigate</span>
              <div className="w-px h-4 bg-gray-300 rounded-full"></div>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono text-gray-700">⏎</kbd>
              <span className="text-gray-600 font-medium">Open</span>
            </>
          )}
        </div>
      </div>

      {/* Jump to Top Button */}
      <JumpToTop categories={visibleCategories} />

      {/* Export Modal */}
      <ExportModal 
        icon={modalIcon} 
        open={modalOpen} 
        onClose={handleCloseModal} 
        onExited={handleModalExited} 
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </>
  );
};

export default IconLibrary; 
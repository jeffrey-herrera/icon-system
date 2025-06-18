import React, { useState, useEffect } from 'react';

interface JumpToTopProps {
  categories: string[];
}

const JumpToTop: React.FC<JumpToTopProps> = ({ categories }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const updateCurrentSection = () => {
      const categoryHeaders = document.querySelectorAll('[data-category-header]');
      let current = null;
      
      for (let i = categoryHeaders.length - 1; i >= 0; i--) {
        const header = categoryHeaders[i] as HTMLElement;
        const rect = header.getBoundingClientRect();
        // Use a more generous threshold - if the header is anywhere near the top half of viewport
        if (rect.top <= 200) { 
          current = header.dataset.categoryHeader || null;
          break;
        }
      }
      
      setCurrentSection(current);
    };

    const handleScroll = () => {
      toggleVisibility();
      updateCurrentSection();
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (categoryId: string) => {
    const element = document.querySelector(`[data-category-header="${categoryId}"]`);
    if (element) {
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      
      // Get the actual header height dynamically
      const header = document.querySelector('div[class*="fixed"][class*="top-0"]') as HTMLElement;
      const headerHeight = header ? header.offsetHeight : 200; // fallback to 200px
      const extraSpacing = 32; // Desired spacing below header
      const offset = headerHeight + extraSpacing;
      
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      });
    }
  };

  const getCurrentSectionIndex = () => {
    const categoryHeaders = document.querySelectorAll('[data-category-header]');
    const header = document.querySelector('div[class*="fixed"][class*="top-0"]') as HTMLElement;
    const headerHeight = header ? header.offsetHeight : 200;
    const targetPosition = headerHeight + 32; // Where we want sections to appear
    
    // Find which section is currently at or closest to our target position
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    for (let i = 0; i < categoryHeaders.length; i++) {
      const headerElement = categoryHeaders[i] as HTMLElement;
      const rect = headerElement.getBoundingClientRect();
      const distance = Math.abs(rect.top - targetPosition);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  };

  const goToPreviousSection = () => {
    if (categories.length === 0) return;
    
    const currentIndex = getCurrentSectionIndex();
    
    // Always allow going to previous section, even if it's the first one
    if (currentIndex > 0) {
      scrollToSection(categories[currentIndex - 1]);
    } else {
      // If we're already at or near the first section, scroll to it anyway to ensure proper positioning
      scrollToSection(categories[0]);
    }
  };

  const goToNextSection = () => {
    if (categories.length === 0) return;
    
    const currentIndex = getCurrentSectionIndex();
    const targetIndex = Math.min(categories.length - 1, currentIndex + 1);
    
    // Only scroll if we're not already at the last section
    if (currentIndex < categories.length - 1) {
      scrollToSection(categories[targetIndex]);
    }
  };

  const currentIndex = categories.length > 0 ? getCurrentSectionIndex() : -1;
  const hasPrevious = categories.length > 0; // Always allow previous - it will go to first section if needed
  const hasNext = categories.length > 0 && currentIndex < categories.length - 1;

  const buttonBaseClass = "bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-gray-600 font-medium";

  return (
    <div className={`hidden sm:flex fixed bottom-4 left-4 flex-row gap-2 transition-all duration-300 ${
      isVisible 
        ? 'opacity-100 translate-y-0 pointer-events-auto' 
        : 'opacity-0 translate-y-2 pointer-events-none'
    }`}>
      {/* Jump to Top Button */}
      <button
        onClick={scrollToTop}
        className={buttonBaseClass}
        aria-label="Jump to top"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span>Jump to top</span>
      </button>

      {/* Previous Section Button */}
      <button
        onClick={goToPreviousSection}
        disabled={!hasPrevious}
        className={`${buttonBaseClass} ${
          !hasPrevious ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Previous section"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
        <span>Previous Section</span>
      </button>

      {/* Next Section Button */}
      <button
        onClick={goToNextSection}
        disabled={!hasNext}
        className={`${buttonBaseClass} ${
          !hasNext ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Next section"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
        <span>Next Section</span>
      </button>
    </div>
  );
};

export default JumpToTop; 
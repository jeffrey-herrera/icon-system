import React, { useState } from 'react';
import type { IconData } from '../utils/iconLoader';
import { generateOptimizedSVG, COLORS } from '../utils/iconLoader';

interface QuickCopyButtonProps {
  icon: IconData;
  onFallbackToModal: () => void;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
  onCloseModal?: () => void;
}

const QuickCopyButton: React.FC<QuickCopyButtonProps> = ({ 
  icon, 
  onFallbackToModal, 
  onShowToast,
  onCloseModal
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const convertToPNG = async (svgString: string, size: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      // Create a clean SVG for conversion
      let cleanSVG = svgString;
      
      // Ensure proper namespace
      if (!cleanSVG.includes('xmlns=')) {
        cleanSVG = cleanSVG.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      
      // Create blob URL for the SVG
      const svgBlob = new Blob([cleanSVG], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Transparent background (no fill)
          ctx.clearRect(0, 0, size, size);
          
          // Draw the SVG
          ctx.drawImage(img, 0, 0, size, size);
          
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Could not create PNG blob'));
            }
          }, 'image/png');
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Could not load SVG image'));
      };
      
      img.src = url;
    });
  };

  const handleQuickCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling to parent icon card
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Generate SVG with purple stroke style, 512px
      const svgContent = generateOptimizedSVG(icon, COLORS.purple, 512, false, undefined, 'stroke');
      
      // Convert to PNG
      const pngBlob = await convertToPNG(svgContent, 512);
      
      // Try to copy to clipboard
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': pngBlob })
          ]);
          
          onShowToast(
            'PNG copied! This is medium quality - click any icon for higher quality and customization options.',
            'success'
          );
          // Close modal if it's open - no need to open fallback modal
          onCloseModal?.();
          return;
        } catch (clipboardError) {
          // Fallback to modal
          onShowToast(
            'Quick copy unavailable. Opening export options for you!',
            'error'
          );
          onFallbackToModal();
        }
      } else {
        // Browser doesn't support clipboard images
        onShowToast(
          'Quick copy unavailable. Opening export options for you!',
          'error'
        );
        onFallbackToModal();
      }
    } catch (error) {
      console.error('Quick copy failed:', error);
      onShowToast(
        'Quick copy unavailable. Opening export options for you!',
        'error'
      );
      onFallbackToModal();
    } finally {
      setIsLoading(false);
    }
  };

  // Button should be wider than tall: px (horizontal) should be 1.5x+ larger than py (vertical)
  return (
    <button
      onClick={handleQuickCopy}
      disabled={isLoading}
      className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-md px-2 py-1.5 text-[9px] leading-none min-h-0 h-auto shadow-md hover:bg-white hover:shadow-lg hover:border-purple-500 hover:text-purple-700 transition-all duration-200 flex items-center gap-1 text-gray-600 font-medium opacity-0 group-hover:opacity-100 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Quick Copy PNG"
    >
      {isLoading ? (
        <svg className="w-2.5 h-2.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ) : (
        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
      <span>Quick Copy</span>
    </button>
  );
};

export default QuickCopyButton; 
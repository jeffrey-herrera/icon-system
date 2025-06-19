import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import type { IconData, ColorKey, ContainerColorKey, StyleType } from "../utils/iconLoader";
import { COLORS, generateOptimizedSVG, CONTAINER_COLORS } from "../utils/iconLoader";

interface ExportModalProps {
  icon: IconData | null;
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}

type ExportFormat = "svg" | "png";

export default function ExportModal({ icon, open, onClose, onExited }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>("svg");
  const [style, setStyle] = useState<StyleType>("stroke");
  const [containerColor, setContainerColor] = useState<ContainerColorKey>("purple");
  const [selectedColor, setSelectedColor] = useState<ColorKey>("purple");
  const [isExporting, setIsExporting] = useState(false);

  // Check if a style is available for this icon
  const isStyleAvailable = (styleType: StyleType): boolean => {
    if (!icon) return false;
    if (styleType === "container") {
      // Disable container style for Alt icons (solid-only alternatives)
      return !icon.name.toLowerCase().includes('alt');
    }
    return icon.styles.some(s => s.style === styleType);
  };

  // Get the first available style as default
  const getDefaultStyle = (): StyleType => {
    if (!icon) return "stroke";
    if (icon.styles.some(s => s.style === "stroke")) return "stroke";
    if (icon.styles.some(s => s.style === "duocolor")) return "duocolor";
    if (icon.styles.some(s => s.style === "solid")) return "solid";
    return "stroke"; // fallback
  };

  // Set default style when icon changes
  useEffect(() => {
    if (icon) {
      const defaultStyle = getDefaultStyle();
      setStyle(defaultStyle);
      setSelectedColor("purple");
      setContainerColor("purple");
      setFormat("svg");
    }
  }, [icon?.id]);

  // Handle modal close
  useEffect(() => {
    if (!open) {
      setTimeout(() => onExited(), 300);
    }
  }, [open, onExited]);

  if (!icon) return null;

  // Helper function to create and download blob
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Simple PNG conversion
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

          // White background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, size, size);
          
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

  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    
    try {
      const size = format === "png" ? 1200 : 64;
      const withContainer = style === "container";
      
      let svgContent: string;
      
      if (withContainer) {
        // For container style, use the best available icon style within the container
        const iconStyle = icon.styles.some(s => s.style === "stroke") ? "stroke" : icon.styles[0].style;
        svgContent = generateOptimizedSVG(icon, selectedColor, size, true, containerColor, iconStyle);
      } else {
        svgContent = generateOptimizedSVG(icon, COLORS[selectedColor], size, false, undefined, style);
      }
      
      const filename = `${icon.name.toLowerCase().replace(/\s+/g, '-')}-${style}`;
      
      if (format === "svg") {
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        downloadBlob(blob, `${filename}.svg`);
      } else {
        const pngBlob = await convertToPNG(svgContent, size);
        downloadBlob(pngBlob, `${filename}.png`);
      }
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again or contact support if the issue persists.');
    } finally {
      setIsExporting(false);
    }
  };

  const getPreviewSVG = () => {
    try {
      const previewSize = 64;
      const withContainer = style === "container";
      
      if (withContainer) {
        const iconStyle = icon.styles.some(s => s.style === "stroke") ? "stroke" : icon.styles[0].style;
        return generateOptimizedSVG(icon, selectedColor, previewSize, true, containerColor, iconStyle);
      } else {
        return generateOptimizedSVG(icon, COLORS[selectedColor], previewSize, false, undefined, style);
      }
    } catch (error) {
      console.error('Preview generation failed:', error);
      return `<svg width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="#f3f4f6" rx="4"/></svg>`;
    }
  };

  const styleConfig = {
    stroke: { label: "Stroke Icon", description: "Outline version" },
    duocolor: { label: "Duocolor Icon", description: "Stroke with light fill" },
    solid: { label: "Solid Icon", description: "Filled version" },
    container: { label: "With Container", description: "Icon in colored container" }
  };

  const showColorPicker = style !== "container";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xs sm:max-w-sm max-h-[85vh] overflow-y-auto">
        {/* Close Button - positioned at the very edge of the modal */}
        <button 
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 transition-colors z-50 w-6 h-6 flex items-center justify-center" 
          onClick={onClose} 
          title="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content with responsive padding */}
        <div className="p-3 sm:p-6">
          <DialogHeader className="mt-3 mb-4 sm:mb-6">
          <DialogTitle>
            <span className="text-lg sm:text-xl">Export {icon.name}</span>
          </DialogTitle>
          <DialogDescription>
            <span className="text-sm sm:text-base">Choose style, color and format for export</span>
          </DialogDescription>
        </DialogHeader>

        {/* Preview with responsive sizing */}
        <div className="w-full rounded-2xl p-4 sm:p-6 mb-3 sm:mb-4" style={{ backgroundColor: '#E6E4F7' }}>
          <div className="flex justify-center">
            <div 
              dangerouslySetInnerHTML={{ __html: getPreviewSVG() }}
              className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16"
            />
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Style Selection */}
          <div className="space-y-2 sm:space-y-3">
            <label className="block text-sm font-medium text-gray-900 mb-1 sm:mb-2">Style</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(styleConfig) as StyleType[]).map((styleType) => {
                const available = isStyleAvailable(styleType);
                const config = styleConfig[styleType];
                
                return (
                  <button
                    key={styleType}
                    onClick={() => available ? setStyle(styleType) : null}
                    disabled={!available}
                    className={`px-2 py-2 sm:py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2 flex flex-col items-center justify-center text-center min-h-[2.5rem] sm:min-h-[3rem] ${
                      style === styleType && available
                        ? "border-braze-action text-gray-900"
                        : available
                        ? "border-[#E5E7EB] text-gray-600 hover:bg-gray-50"
                        : "border-[#E5E7EB] text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                    style={{
                      backgroundColor: style === styleType && available ? "#F9F5FE" : "white"
                    }}
                  >
                    <span className="font-medium text-xs sm:text-sm">{config.label}</span>
                    {!available && (
                      <span className="text-xs text-gray-400 mt-1">Not available</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Container Color Selection */}
          {style === "container" && (
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-sm font-medium text-gray-900 mb-1 sm:mb-2">Container Color</label>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {Object.entries(CONTAINER_COLORS).map(([key, color]) => (
                  <button
                    key={key}
                    onClick={() => setContainerColor(key as ContainerColorKey)}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-200 shadow-sm hover:shadow-md ${
                      containerColor === key 
                        ? "ring-2 ring-braze-action ring-offset-2 scale-110" 
                        : "hover:scale-105"
                    } ${key === 'white' ? 'border-2 border-gray-200' : ''}`}
                    style={{ backgroundColor: color }}
                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                ))}
              </div>
              {containerColor !== "white" && (
                <p className="text-xs text-gray-500">
                  Icon will be white on colored containers
                </p>
              )}
              {containerColor === "white" && (
                <div className="p-3 bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-200 rounded-xl">
                  <p className="text-xs text-gray-700 font-medium mb-1">
                    🎨 Automatic Gradient Applied
                  </p>
                  <p className="text-xs text-gray-600">
                    Icons in white containers automatically use the pink-to-orange gradient for optimal branding consistency.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Icon Color Selection */}
          {showColorPicker && (
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-sm font-medium text-gray-900 mb-1 sm:mb-2">Icon Color</label>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {Object.entries(COLORS).map(([key, color]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedColor(key as ColorKey)}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-200 shadow-sm hover:shadow-md ${
                      selectedColor === key 
                        ? "ring-2 ring-braze-action ring-offset-2 scale-110" 
                        : "hover:scale-105"
                    } ${key === 'white' ? 'border-2 border-gray-200' : ''}`}
                    style={{ backgroundColor: color }}
                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Format Selection */}
          <div className="space-y-2 sm:space-y-3">
            <label className="block text-sm font-medium text-gray-900 mb-1 sm:mb-2">Format</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFormat("svg")}
                className={`flex-1 px-3 py-2 sm:py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                  format === "svg"
                    ? "border-braze-action text-gray-900"
                    : "border-[#E5E7EB] text-gray-600 hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: format === "svg" ? "#F9F5FE" : "white"
                }}
              >
                SVG
              </button>
              <button
                onClick={() => setFormat("png")}
                className={`flex-1 px-3 py-2 sm:py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                  format === "png"
                    ? "border-braze-action text-gray-900"
                    : "border-[#E5E7EB] text-gray-600 hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: format === "png" ? "#F9F5FE" : "white"
                }}
              >
                PNG
              </button>
            </div>
            {format === "png" && (
              <p className="text-xs text-gray-500">
                High-quality PNG export at 1200×1200px with white background
              </p>
            )}
          </div>

          {/* Export Button */}
          <div className="relative mt-4 sm:mt-6">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className={`w-full bg-gradient-to-r from-[#5710E5] via-[#7C3AED] to-[#A855F7] hover:from-[#4A0DCC] hover:via-[#6B21A8] hover:to-[#9333EA] text-white font-bold text-sm sm:text-base py-3 sm:py-4 px-4 sm:px-6 rounded-full shadow-2xl hover:shadow-[0_20px_40px_-8px_rgba(87,16,229,0.6)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3 relative overflow-hidden ${
                isExporting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              
              <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span className="tracking-wide">
                  {isExporting ? `Exporting ${format.toUpperCase()}...` : `Export ${format.toUpperCase()}`}
                </span>
              </div>
              
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-all duration-700 hover:translate-x-full"></div>
            </button>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
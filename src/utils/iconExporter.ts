import type { IconData } from './iconLoader';

interface ExportOptions {
  format: 'svg' | 'png';
  size?: number;
  color?: string;
  containerColor?: string;
}

export async function exportIcon(icon: IconData, options: ExportOptions): Promise<Blob> {
  if (options.format === 'svg') {
    return exportSVG(icon, options);
  } else {
    return exportPNG(icon, options);
  }
}

async function exportSVG(icon: IconData, options: ExportOptions): Promise<Blob> {
  let svgContent = (icon as any).svg;
  
  // Apply color if specified
  if (options.color) {
    svgContent = svgContent.replace(/fill="[^"]*"/g, `fill="${options.color}"`);
    svgContent = svgContent.replace(/stroke="[^"]*"/g, `stroke="${options.color}"`);
  }
  
  // Apply container color if specified
  if (options.containerColor) {
    svgContent = svgContent.replace(/<svg[^>]*>/, (match: string) => {
      return match.replace(/fill="[^"]*"/, `fill="${options.containerColor}"`);
    });
  }

  // If exporting PNG, ensure root SVG has no fill attribute (transparent background)
  if (options.format === 'png') {
    svgContent = svgContent.replace(/(<svg[^>]*)\sfill="[^"]*"/i, '$1');
    // If this is a stroke icon, add fill="none" to all <path> elements without a fill attribute
    if (svgContent.includes('stroke=')) {
      svgContent = svgContent.replace(/<path((?!fill=)[^>])*?>/g, (match: string) => {
        // Only add fill="none" if not already present
        if (!/fill=/.test(match)) {
          return match.replace('<path', '<path fill="none"');
        }
        return match;
      });
    }
  }

  return new Blob([svgContent], { type: 'image/svg+xml' });
}

async function exportPNG(icon: IconData, options: ExportOptions): Promise<Blob> {
  const size = options.size || 1200;
  
  // Create a temporary SVG element
  const svgBlob = await exportSVG(icon, options);
  const svgUrl = URL.createObjectURL(svgBlob);
  
  // Create an image element
  const img = new Image();
  img.src = svgUrl;
  
  // Wait for the image to load
  await new Promise((resolve) => {
    img.onload = resolve;
  });
  
  // Create a canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  // Draw the SVG to the canvas
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  ctx.drawImage(img, 0, 0, size, size);
  
  // Convert to PNG
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      URL.revokeObjectURL(svgUrl);
    }, 'image/png');
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
} 
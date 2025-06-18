// This file contains interfaces and client-side utility functions for icons.

export interface IconStyle {
  style: 'stroke' | 'duocolor' | 'solid';
  svg: string;
  file: string;
}

export interface IconData {
  id: string; // e.g., general/activity
  name: string;
  category: string;
  styles: IconStyle[];
  tags: string[];
  lastModified: number;
}

export interface CategoryData {
  id: string;
  name: string;
  count: number;
}

// Style types including container
export type StyleType = 'stroke' | 'duocolor' | 'solid' | 'container';

// Color definitions
export type ColorKey = 'black' | 'white' | 'darkPurple' | 'purple' | 'orange' | 'pink';

export const COLORS: Record<ColorKey, string> = {
  black: '#000000',
  white: '#FFFFFF',
  darkPurple: '#300266',
  purple: '#801ED7',
  orange: '#FFA524',
  pink: '#FFA4FB',
};

// Container color definitions
export type ContainerColorKey = 'white' | 'orange' | 'purple' | 'pink' | 'darkPurple';

export const CONTAINER_COLORS: Record<ContainerColorKey, string> = {
  white: '#FFFFFF',
  orange: '#FFA524',
  purple: '#801ED7',
  pink: '#FFA4FB',
  darkPurple: '#300266',
};

// Generate optimized SVG with container support
export function generateOptimizedSVG(
  icon: IconData,
  color: ColorKey | string,
  size: number,
  withContainer: boolean = false,
  containerColor?: ContainerColorKey,
  iconStyle?: StyleType
): string {
  // Get the icon SVG for the specified style
  const styleToUse = iconStyle && iconStyle !== 'container' ? iconStyle : 'stroke';
  const iconStyleObj = icon.styles.find(s => s.style === styleToUse) || icon.styles[0];
  
  if (!iconStyleObj) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="#f3f4f6" rx="4"/></svg>`;
  }

  let iconSvg = iconStyleObj.svg;
  
  if (withContainer && containerColor) {
    const containerBg = CONTAINER_COLORS[containerColor];
    const iconColor = containerColor === 'white' ? 'url(#gradient)' : '#FFFFFF';
    
    // Create container SVG with icon inside
    const gradientDef = containerColor === 'white' ? `
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#FFA4FB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FFA524;stop-opacity:1" />
        </linearGradient>
      </defs>
    ` : '';
    
    // Extract the inner content of the SVG (everything between <svg> tags)
    const svgContentMatch = iconSvg.match(/<svg[^>]*>(.*?)<\/svg>/s);
    const innerContent = svgContentMatch ? svgContentMatch[1] : '';
    
    // Replace currentColor with the appropriate icon color, but preserve fill="none"
    let processedContent = innerContent.replace(/stroke="currentColor"/g, `stroke="${iconColor}"`);
    // Only replace fill="currentColor" if it exists, don't touch fill="none"
    processedContent = processedContent.replace(/fill="currentColor"/g, `fill="${iconColor}"`);
    
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      ${gradientDef}
      <rect width="24" height="24" rx="6" fill="${containerBg}"/>
      <g transform="translate(4, 4) scale(0.67)" fill="none">
        ${processedContent}
      </g>
    </svg>`;
  } else {
    // Regular icon without container
    const colorValue = typeof color === 'string' ? color : COLORS[color];
    
    // Apply color by replacing currentColor and any hardcoded colors
    let processedSvg = iconSvg.replace('<svg', `<svg width="${size}" height="${size}" style="color: ${colorValue}"`);
    
    // Also replace any hardcoded stroke and fill colors with currentColor so the CSS color applies
    processedSvg = processedSvg.replace(/stroke="#[^"]*"/g, 'stroke="currentColor"');
    processedSvg = processedSvg.replace(/fill="#[^"]*"/g, 'fill="currentColor"');
    
    return processedSvg;
  }
}

// Human-readable category names mapping
export function getHumanReadableCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'alerts-feedback': 'Alerts & Feedback',
    'arrows': 'Arrows',
    'brands': 'Brands',
    'channels': 'Channels',
    'charts': 'Charts',
    'communication': 'Communication',
    'development': 'Development',
    'editor': 'Editor',
    'education': 'Education',
    'files': 'Files',
    'finance-ecommerce': 'Finance & E-commerce',
    'general': 'General',
    'images': 'Images',
    'layout': 'Layout',
    'maps-travel': 'Maps & Travel',
    'media-devices': 'Media & Devices',
    'security': 'Security',
    'shapes': 'Shapes',
    'time': 'Time',
    'users': 'Users',
    'weather': 'Weather'
  };
  
  return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

export function getCategories(icons: IconData[]): CategoryData[] {
  const categoryMap = new Map<string, number>();

  // Count icons per category
  icons.forEach(icon => {
    const count = categoryMap.get(icon.category) || 0;
    categoryMap.set(icon.category, count + 1);
  });

  // Convert to array format
  return Array.from(categoryMap.entries()).map(([id, count]) => ({
    id,
    name: getHumanReadableCategoryName(id),
    count
  }));
}

export function filterIcons(
  icons: IconData[],
  search: string,
  selectedCategories: string[],
  selectedStyles: string[]
): IconData[] {
  return icons.filter(icon => {
    // Search filter
    if (search) {
      const query = search.toLowerCase().trim();
      const matchesSearch = 
        icon.name.toLowerCase().includes(query) ||
        icon.category.toLowerCase().includes(query) ||
        (icon.tags && Array.isArray(icon.tags) && icon.tags.some(tag => 
          tag && tag.toLowerCase().includes(query)
        ));
      if (!matchesSearch) {
        return false;
      }
    }

    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(icon.category)) {
      return false;
    }

    // Style filter
    if (selectedStyles.length > 0 && !selectedStyles.some(style => icon.styles.some(s => s.style === style))) {
      return false;
    }

    return true;
  });
} 
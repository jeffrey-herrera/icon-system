import { loadState, saveState } from '../stores/iconStore';
import { exportIcon, downloadBlob } from '../utils/iconExporter';

// Extend Window interface for iconData
declare global {
  interface Window {
    iconData: any[];
  }
}

// Initialize state
let state = loadState();

// DOM Elements
const searchInput = document.querySelector<HTMLInputElement>('#search-input');
const categoryButtons = document.querySelectorAll<HTMLButtonElement>('[data-category]');
const styleCheckboxes = document.querySelectorAll<HTMLInputElement>('[data-style]');
const containerColorButtons = document.querySelectorAll<HTMLButtonElement>('[data-container-color]');
const exportButtons = document.querySelectorAll<HTMLButtonElement>('[data-export]');

// Event Listeners
searchInput?.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  // Trigger search update
  document.dispatchEvent(new CustomEvent('searchUpdate', { detail: target.value }));
});

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    if (!category) return;
    
    const isSelected = button.classList.contains('bg-braze-purple');
    if (isSelected) {
      button.classList.remove('bg-braze-purple', 'text-white');
      button.classList.add('bg-gradient-card', 'text-slate-700');
      state.selectedCategories = state.selectedCategories.filter(c => c !== category);
    } else {
      button.classList.add('bg-braze-purple', 'text-white');
      button.classList.remove('bg-gradient-card', 'text-slate-700');
      state.selectedCategories.push(category);
    }
    
    saveState({ selectedCategories: state.selectedCategories });
    document.dispatchEvent(new CustomEvent('filterUpdate'));
  });
});

styleCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const style = checkbox.dataset.style;
    if (!style) return;
    
    if (checkbox.checked) {
      state.selectedStyles.push(style);
    } else {
      state.selectedStyles = state.selectedStyles.filter(s => s !== style);
    }
    
    saveState({ selectedStyles: state.selectedStyles });
    document.dispatchEvent(new CustomEvent('filterUpdate'));
  });
});

containerColorButtons.forEach(button => {
  button.addEventListener('click', () => {
    const color = button.dataset.containerColor;
    if (!color) return;
    
    // Remove active class from all buttons
    containerColorButtons.forEach(btn => {
      btn.classList.remove('ring-2', 'ring-braze-purple', 'ring-offset-2');
    });
    
    // Add active class to clicked button
    button.classList.add('ring-2', 'ring-braze-purple', 'ring-offset-2');
    
    state.selectedContainerColor = color === 'none' ? null : color;
    saveState({ selectedContainerColor: state.selectedContainerColor });
    
    document.dispatchEvent(new CustomEvent('containerColorUpdate'));
  });
});

exportButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const iconId = button.dataset.iconId;
    const format = button.dataset.format as 'svg' | 'png';
    if (!iconId || !format) return;
    
    const icon = window.iconData.find((i: any) => i.id === iconId);
    if (!icon) return;
    
    try {
      const blob = await exportIcon(icon, {
        format,
        size: format === 'png' ? 1200 : undefined,
        color: state.selectedContainerColor || undefined
      });
      
      const filename = `${icon.name.toLowerCase().replace(/\s+/g, '-')}.${format}`;
      downloadBlob(blob, filename);
    } catch (error) {
      console.error('Export failed:', error);
    }
  });
}); 
import React from 'react';

interface StyleFilterProps {
  selectedStyles: string[];
  onSelectStyle?: (style: string) => void;
}

const STYLES = [
  { id: 'stroke', label: 'Stroke' },
  { id: 'duocolor', label: 'Duocolor' },
  { id: 'solid', label: 'Solid' },
];

const StyleFilter: React.FC<StyleFilterProps> = ({ selectedStyles, onSelectStyle }) => (
  <div className="flex gap-2">
    {STYLES.map((style) => (
      <button
        key={style.id}
        className={[
          "px-4 py-2 rounded-xl border font-medium text-sm transition-all",
          selectedStyles.includes(style.id)
            ? "border-braze-purple bg-braze-purple/10 text-braze-purple"
            : "border-slate-200 text-slate-500 bg-white"
        ].join(' ')}
        onClick={() => onSelectStyle && onSelectStyle(style.id)}
      >
        {style.label}
      </button>
    ))}
  </div>
);

export default StyleFilter; 
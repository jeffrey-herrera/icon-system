import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
      <div className={`w-[32rem] max-w-[95vw] rounded-xl shadow-lg border backdrop-blur-sm px-4 py-3 flex items-start gap-3 ${
        type === 'success' 
          ? 'bg-green-50/95 border-green-200 text-green-800' 
          : 'bg-red-50/95 border-red-200 text-red-800'
      }`}>
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {type === 'success' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        
        {/* Message */}
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export default Toast; 
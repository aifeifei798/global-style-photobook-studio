import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div
      id="global-toast-notification"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-[#141414] text-[#e5e5e5] rounded-xl shadow-2xl border border-[#d4af37]/40 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
      )}
      <span className="text-sm font-medium tracking-wide font-serif-hk">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-[#777777] hover:text-[#d4af37] transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

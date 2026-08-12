import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { type = 'success', message } = toast;

  const config = {
    success: {
      bg: 'bg-emerald-600',
      icon: <CheckCircle2 className="w-5 h-5 text-white shrink-0" />,
    },
    error: {
      bg: 'bg-rose-600',
      icon: <AlertCircle className="w-5 h-5 text-white shrink-0" />,
    },
    info: {
      bg: 'bg-blue-600',
      icon: <Info className="w-5 h-5 text-white shrink-0" />,
    },
  };

  const { bg, icon } = config[type] || config.success;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-fade-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl ${bg} text-white max-w-sm`}>
        {icon}
        <span className="text-sm font-semibold flex-1 pr-1">{message}</span>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

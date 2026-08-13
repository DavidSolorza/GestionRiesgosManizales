import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastNotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function ToastNotification({ message, isVisible, onClose, duration = 3000 }: ToastNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
        <div className="bg-success-100 text-success-500 rounded-full p-1">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <p className="text-slate-800 text-sm font-medium">{message}</p>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

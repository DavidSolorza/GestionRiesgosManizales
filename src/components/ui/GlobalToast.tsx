import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEmergencyStore } from '../../features/emergency_map/application/useEmergencyStore';

export function GlobalToast() {
  const { globalToast, hideToast } = useEmergencyStore();

  if (!globalToast || !globalToast.visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[3000] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 min-w-[300px]">
        {globalToast.message.includes('error') || globalToast.message.includes('incorrecta') ? (
          <AlertCircle className="w-5 h-5 text-alert-400 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-success-400 flex-shrink-0" />
        )}
        <p className="text-sm font-medium flex-1">{globalToast.message}</p>
        <button 
          onClick={hideToast}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <span className="sr-only">Cerrar</span>
          &times;
        </button>
      </div>
    </div>
  );
}

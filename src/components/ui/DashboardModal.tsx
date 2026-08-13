import { X, LayoutDashboard, Activity, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useEmergencyStore } from '../../features/emergency_map/application/useEmergencyStore';

export function DashboardModal() {
  const { isDashboardOpen, setDashboardOpen, reports, offers } = useEmergencyStore();

  if (!isDashboardOpen) return null;

  const totalReports = reports.length;
  const requiresHelp = reports.filter(r => r.status === 'requiere_ayuda').length;
  const inProgress = reports.filter(r => r.status === 'en_proceso').length;
  const attended = reports.filter(r => r.status === 'atendidos').length;
  const totalOffers = offers.length;

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800">
            <LayoutDashboard className="w-5 h-5 text-brand-600" />
            <h2 className="font-semibold text-lg">Dashboard de Emergencias</h2>
          </div>
          <button 
            onClick={() => setDashboardOpen(false)}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
              <Activity className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Reportes</p>
              <p className="text-3xl font-bold text-slate-800">{totalReports}</p>
            </div>
            
            <div className="bg-alert-50 rounded-xl p-4 border border-alert-100 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-8 h-8 text-alert-500 mb-2" />
              <p className="text-sm font-medium text-alert-600 uppercase tracking-wider">Requieren Ayuda</p>
              <p className="text-3xl font-bold text-alert-700">{requiresHelp}</p>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 flex flex-col items-center justify-center text-center">
              <Clock className="w-8 h-8 text-orange-500 mb-2" />
              <p className="text-sm font-medium text-orange-600 uppercase tracking-wider">En Proceso</p>
              <p className="text-3xl font-bold text-orange-700">{inProgress}</p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-sm font-medium text-green-600 uppercase tracking-wider">Atendidos</p>
              <p className="text-3xl font-bold text-green-700">{attended}</p>
            </div>
          </div>

          <div className="bg-brand-50 border border-brand-100 rounded-xl p-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-brand-800 text-lg mb-1">Solidaridad Ciudadana</h3>
              <p className="text-brand-600 text-sm">Ofrecimientos de ayuda registrados por la comunidad.</p>
            </div>
            <div className="text-4xl font-black text-brand-600">
              {totalOffers}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

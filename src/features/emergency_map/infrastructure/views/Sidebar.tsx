import { Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEmergencyStore } from '../../application/useEmergencyStore';

export function Sidebar() {
  const { reports, isLoading, activeFilter, setFilter } = useEmergencyStore();

  const filteredReports = reports.filter(report => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'sin_reportes') return false; // Or logic if there are no reports in an area, but for now we hide
    return report.status === activeFilter;
  });

  return (
    <aside className="w-[400px] h-full bg-white border-l border-slate-200 shadow-xl flex flex-col z-[500] absolute right-0 top-0 pt-[60px] transition-all">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-slate-800">Sectores reportados</h2>
          <span className="bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full text-sm">
            {reports.length}
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              activeFilter === 'all' 
                ? 'bg-brand-600 text-white border-brand-600' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Todos
          </button>
          
          <button 
            onClick={() => setFilter('requiere_ayuda')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-2 transition-colors ${
              activeFilter === 'requiere_ayuda'
                ? 'bg-red-50 text-alert-700 border-alert-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-sm bg-alert-600"></div>
            Requieren ayuda
          </button>
          
          <button 
            onClick={() => setFilter('en_proceso')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-2 transition-colors ${
              activeFilter === 'en_proceso'
                ? 'bg-orange-50 text-orange-700 border-orange-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-sm bg-orange-500"></div>
            En proceso
          </button>
          
          <button 
            onClick={() => setFilter('atendidos')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-2 transition-colors ${
              activeFilter === 'atendidos'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            Atendidos
          </button>

          <button 
            onClick={() => setFilter('sin_reportes')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-2 transition-colors ${
              activeFilter === 'sin_reportes'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-sm bg-purple-400"></div>
            Sin reportes
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-50">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay emergencias para esta categoría.</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div 
              key={report.id} 
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="mb-3">
                <span className="inline-block bg-alert-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                  {report.status === 'requiere_ayuda' ? 'REQUIERE AYUDA' : report.status === 'en_proceso' ? 'EN PROCESO' : 'ATENDIDO'}
                </span>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">
                  {report.title}
                </h3>
              </div>
              
              <div className="text-sm text-brand-600 font-medium mb-1">
                Requiere: {report.needs || 'Otros'}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone className="w-3.5 h-3.5 text-alert-600" />
                <span>{report.reporterName}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

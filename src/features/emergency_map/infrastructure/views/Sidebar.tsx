import { Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEmergencyStore } from '../../application/useEmergencyStore';

export function Sidebar() {
  const { reports, isLoading, activeFilter, setFilter, isAdmin, updateReportStatus } = useEmergencyStore();

  const filteredReports = reports.filter(report => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'sin_reportes') return false; 
    return report.status === activeFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requiere_ayuda': return 'bg-alert-100 text-alert-700 border-alert-200';
      case 'en_proceso': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'atendidos': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'requiere_ayuda': return 'REQUIERE AYUDA';
      case 'en_proceso': return 'EN PROCESO';
      case 'atendidos': return 'ATENDIDO';
      default: return status;
    }
  };

  return (
    <aside className="w-full lg:w-[400px] h-[45vh] lg:h-full bg-white border-t lg:border-t-0 lg:border-l border-slate-200 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] lg:shadow-xl flex flex-col z-[500] absolute right-0 bottom-0 lg:top-0 lg:bottom-auto pt-0 lg:pt-[60px] transition-all">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-brand-600" />
          Filtros de Estado
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'requiere_ayuda', label: 'Requieren ayuda' },
            { id: 'en_proceso', label: 'En proceso' },
            { id: 'atendidos', label: 'Atendidos' },
            { id: 'sin_reportes', label: 'Sin reportes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                activeFilter === tab.id 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 space-y-2">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-brand-500 rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Cargando reportes...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-center px-4">
            <CheckCircle2 className="w-12 h-12 mb-3 text-slate-300" />
            <p className="font-medium text-slate-600">No hay reportes en esta categoría</p>
            <p className="text-sm mt-1">Todo está tranquilo por aquí.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div 
              key={report.id} 
              className={`bg-white rounded-xl shadow-sm border p-4 transition-all hover:shadow-md ${
                report.status === 'requiere_ayuda' ? 'border-l-4 border-l-alert-500 border-y-slate-200 border-r-slate-200' : 
                report.status === 'en_proceso' ? 'border-l-4 border-l-orange-500 border-y-slate-200 border-r-slate-200' :
                'border-l-4 border-l-green-500 border-y-slate-200 border-r-slate-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(report.status)}`}>
                  {getStatusLabel(report.status)}
                </span>
                <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full">
                  Hace {Math.floor(Math.random() * 60) + 1} min
                </span>
              </div>
              
              <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{report.title}</h3>
              
              <div className="text-brand-600 text-xs font-semibold mb-2 bg-brand-50 inline-block px-2 py-1 rounded">
                Necesita: {report.needs || 'Otros'}
              </div>
              
              <p className="text-slate-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                {report.description}
              </p>
              
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="bg-white p-1.5 rounded-full shadow-sm">
                  <Phone className="w-3.5 h-3.5 text-brand-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Reportado por</span>
                  <span className="text-xs font-medium text-slate-700">{report.reporterName}</span>
                </div>
                <a 
                  href={`tel:${report.reporterPhone}`}
                  className="ml-auto text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                >
                  Llamar
                </a>
              </div>

              {isAdmin && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Acciones Admin</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateReportStatus(report.id, 'en_proceso')}
                      className={`flex-1 text-xs py-1.5 rounded font-medium transition-colors ${report.status === 'en_proceso' ? 'bg-orange-100 text-orange-700 cursor-default' : 'bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600'}`}
                    >
                      En proceso
                    </button>
                    <button 
                      onClick={() => updateReportStatus(report.id, 'atendidos')}
                      className={`flex-1 text-xs py-1.5 rounded font-medium transition-colors ${report.status === 'atendidos' ? 'bg-green-100 text-green-700 cursor-default' : 'bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-green-600'}`}
                    >
                      Atendido
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

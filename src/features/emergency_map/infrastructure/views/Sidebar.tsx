import { AlertTriangle, MapPin, Clock } from 'lucide-react';
import { useEmergencyStore } from '../../application/useEmergencyStore';

export function Sidebar() {
  const { reports, isLoading } = useEmergencyStore();

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-alert-100 text-alert-700 border-alert-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-success-100 text-success-700 border-success-200';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical': return 'Crítico';
      case 'high': return 'Alto';
      case 'medium': return 'Medio';
      default: return 'Bajo';
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    }).format(date);
  };

  return (
    <aside className="w-80 h-full bg-white/90 backdrop-blur-xl border-r border-slate-200 shadow-xl flex flex-col z-[500] absolute left-0 top-0 pt-[72px] transition-all">
      <div className="p-5 border-b border-slate-100 bg-white/50">
        <div className="flex items-center gap-2 text-brand-700 mb-1">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-lg font-bold">Reportes Activos</h2>
        </div>
        <p className="text-sm text-slate-500">
          Mostrando {reports.length} emergencias registradas en tiempo real.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <CheckCircleIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay emergencias reportadas.</p>
          </div>
        ) : (
          reports.map(report => (
            <div 
              key={report.id} 
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-brand-600 transition-colors line-clamp-2">
                  {report.title}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ml-2 ${getSeverityStyle(report.severity)}`}>
                  {getSeverityLabel(report.severity)}
                </span>
              </div>
              
              <p className="text-sm text-slate-600 mb-2 line-clamp-2 leading-snug">
                {report.description}
              </p>
              
              <div className="mb-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{report.reporterName}</span> • <a href={`tel:${report.reporterPhone}`} className="text-brand-600 hover:underline">{report.reporterPhone}</a>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(report.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

const CheckCircleIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

import { X, Phone, Info, ShieldAlert, HeartHandshake } from 'lucide-react';
import { useEmergencyStore } from '../../features/emergency_map/application/useEmergencyStore';

export function HelpModal() {
  const { isHelpOpen, setHelpOpen } = useEmergencyStore();

  if (!isHelpOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-brand-50">
          <div className="flex items-center gap-2 text-brand-700">
            <Info className="w-6 h-6" />
            <h2 className="font-bold text-xl">Ayuda e Información</h2>
          </div>
          <button 
            onClick={() => setHelpOpen(false)}
            className="text-brand-500 hover:text-brand-700 hover:bg-brand-100 p-1.5 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Cómo usar la app */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-orange-500" />
                ¿Cómo usar la plataforma?
              </h3>
              
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">1</span>
                  <p><strong>Para reportar una emergencia:</strong> Haz clic en el botón "+ Reportar necesidad", luego busca el lugar exacto en el mapa y haz clic. Llena el formulario con los detalles.</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">2</span>
                  <p><strong>Para ofrecer ayuda:</strong> Haz clic en "Ofrecimientos" y llena el formulario indicando qué puedes aportar (víveres, refugio, herramientas).</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">3</span>
                  <p><strong>Filtros:</strong> Usa el panel derecho (Sidebar) para filtrar los reportes por su estado actual y ver dónde se requiere ayuda urgente.</p>
                </li>
              </ul>
            </div>

            {/* Números de emergencia */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-500" />
                Líneas de Emergencia (Manizales)
              </h3>
              
              <div className="space-y-3">
                <a href="tel:123" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:border-brand-300 hover:bg-brand-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 group-hover:text-brand-700">Línea Única de Emergencias</p>
                      <p className="text-xs text-slate-500">Policía Nacional</p>
                    </div>
                  </div>
                  <span className="font-bold text-lg text-slate-700">123</span>
                </a>

                <a href="tel:119" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:border-brand-300 hover:bg-brand-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 group-hover:text-brand-700">Bomberos Manizales</p>
                      <p className="text-xs text-slate-500">Urgencias e incendios</p>
                    </div>
                  </div>
                  <span className="font-bold text-lg text-slate-700">119</span>
                </a>

                <a href="tel:132" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:border-brand-300 hover:bg-brand-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 group-hover:text-brand-700">Cruz Roja</p>
                      <p className="text-xs text-slate-500">Asistencia médica</p>
                    </div>
                  </div>
                  <span className="font-bold text-lg text-slate-700">132</span>
                </a>

                <a href="tel:144" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:border-brand-300 hover:bg-brand-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 group-hover:text-brand-700">Defensa Civil</p>
                      <p className="text-xs text-slate-500">Búsqueda y rescate</p>
                    </div>
                  </div>
                  <span className="font-bold text-lg text-slate-700">144</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

import { ChevronDown, Plus, Heart, LayoutDashboard, HelpCircle, ShieldAlert } from 'lucide-react';
import { useEmergencyStore } from '../../features/emergency_map/application/useEmergencyStore';

export function TopNavbar() {
  const { 
    showToast, 
    setDashboardOpen, 
    setHelpOpen, 
    setOfferFormOpen, 
    setAdminLoginOpen,
    isAdmin 
  } = useEmergencyStore();

  return (
    <header className="absolute top-0 left-0 right-0 z-[1000] bg-white border-b border-slate-200 shadow-sm h-[60px] flex items-center px-4 justify-between">
      
      {/* Lado izquierdo */}
      <div className="flex items-center gap-4">
        {/* Dropdown de ubicación */}
        <button 
          className="flex items-center gap-2 px-4 py-1.5 border border-brand-600 text-brand-700 rounded-full font-semibold text-sm hover:bg-brand-50 transition-colors"
          onClick={() => showToast('Actualmente solo disponible para Manizales y alrededores.')}
        >
          Manizales y alrededores
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Botón Reportar */}
        <button 
          className="flex items-center gap-2 px-4 py-1.5 bg-brand-600 text-white rounded-full font-semibold text-sm hover:bg-brand-700 transition-colors shadow-sm"
          onClick={() => showToast('Por favor, haz clic en el mapa para seleccionar la ubicación exacta de la emergencia.')}
        >
          <Plus className="w-4 h-4" />
          Reportar necesidad
        </button>
      </div>

      {/* Lado derecho */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setOfferFormOpen(true)}
          className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 text-slate-700 rounded-full font-medium text-sm hover:bg-slate-50 transition-colors"
        >
          <Heart className="w-4 h-4 text-orange-500" />
          Ofrecimientos
        </button>

        <button 
          onClick={() => setDashboardOpen(true)}
          className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 text-slate-700 rounded-full font-medium text-sm hover:bg-slate-50 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4 text-green-500" />
          Dashboard
        </button>

        <button 
          onClick={() => setHelpOpen(true)}
          className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 text-slate-700 rounded-full font-medium text-sm hover:bg-slate-50 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-red-500" />
          Ayuda
        </button>

        <button 
          onClick={() => setAdminLoginOpen(true)}
          className={`flex items-center gap-2 px-4 py-1.5 border rounded-full font-medium text-sm transition-colors ${isAdmin ? 'bg-brand-50 border-brand-200 text-brand-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
        >
          <ShieldAlert className={`w-4 h-4 ${isAdmin ? 'text-brand-600' : 'text-slate-400'}`} />
          {isAdmin ? 'Admin Activo' : 'Panel admin'}
        </button>
      </div>
    </header>
  );
}
